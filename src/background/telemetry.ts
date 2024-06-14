import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  SpanExporter,
  WebTracerProvider,
} from "@opentelemetry/sdk-trace-web";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { Span, trace } from "@opentelemetry/api";
import { Resource } from "@opentelemetry/resources";
import { ulid } from "ulidx";
import { z } from "zod";
import { Storage } from "./storage";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { deobfuscateString } from "./deobfuscate";

const ObservabilityConsent = z
  .object({
    consent: z.literal(false),
  })
  .or(
    z.object({
      consent: z.literal(true),
      canTrackUserId: z.boolean(),
    }),
  );

const ObservabilityUserId = z.string();

const observabilityConsent = new Storage(
  "consent.observability",
  ObservabilityConsent.parseAsync,
);
const observabilityUserId = new Storage(
  "observability.user-id",
  ObservabilityUserId.parseAsync,
);

async function getObservabilityUserId() {
  let userId = await observabilityUserId.get();
  if (!userId) {
    userId = ulid();
    await observabilityUserId.set(userId);
  }
  return userId;
}

function deobfuscateHoneycombKey() {
  // Don't read, secret! 🙈
  //
  // Okay just kidding. I know this is not encrypted or anything. I'm just
  // throwing in some obfuscation so automated tools scanning extensions can't
  // just pick up the honeycomb secret. This secret is okay to expose.
  return deobfuscateString(
    import.meta.env.VITE_OBFUSCATED_HONEYCOMB_SECRET,
    import.meta.env.VITE_OBFUSCATION_SECRET,
    Number(import.meta.env.VITE_OBFUSCATION_ROT),
  );
}

export async function setupObservability() {
  const consent = await observabilityConsent.get();
  let userId = "no-consent";
  if (consent?.consent && consent.canTrackUserId) {
    console.info("User ID observability consent given.");
    userId = await getObservabilityUserId();
  } else {
    console.info("No observability consent for user ID tracking.");
  }

  const session = ulid();
  const provider = new WebTracerProvider({
    resource: new Resource({
      version: APP_VERSION,
      build: BROWSER,
      session,
      userId,
    }),
  });

  //
  // So, I have to shelve this for now. Because the OTLPTraceExporter requires
  // XHR, which is not available in service workers. They have plans for fetch
  // support, but it hasn't materialized yet.
  //

  let exporter: SpanExporter = new ConsoleSpanExporter();
  if (true || consent?.consent) {
    const apiKey = await deobfuscateHoneycombKey();
    exporter = new OTLPTraceExporter({
      concurrencyLimit: 1,
      timeoutMillis: 10_000,
      url: "https://api.honeycomb.io/v1/traces",
      headers: {
        "x-honeycomb-team": apiKey,
      },
    });
  }

  const spanProcessor =
    NODE_ENV === "development"
      ? new SimpleSpanProcessor(exporter)
      : new BatchSpanProcessor(exporter);

  provider.addSpanProcessor(spanProcessor);
  provider.register({
    // Changing default contextManager to use ZoneContextManager - supports asynchronous operations - optional
    contextManager: new ZoneContextManager(),
  });
}

export function span<T>(name: string, fn: (span: Span) => T): T;
export function span<T>(
  name: string,
  fn: (span: Span) => Promise<T>,
): Promise<T>;
export function span<T>(
  name: string,
  fn: (span: Span) => T | Promise<T>,
): T | Promise<T> {
  const tracer = trace.getTracer("devpod-ext", APP_VERSION);
  return tracer.startActiveSpan(name, (span) => {
    const result = fn(span);
    if (result instanceof Promise) {
      return result.finally(() => span.end());
    } else {
      span.end();
      return result;
    }
  });
}
