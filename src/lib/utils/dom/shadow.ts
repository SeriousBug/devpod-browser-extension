import { EError, EErrorOptions } from "../error";
import styles from "../../../tailwind.css?inline";
import { WithPartial } from "../typeUtils/WithPartial";

type EShadowErrorData = {
  selector: { content: string };
};
export class EShadowError extends EError<EShadowErrorData> {
  constructor({
    message = "open-devpod-browser-extension is unable to attach an element to the page.",
    data,
  }: WithPartial<EErrorOptions<EShadowErrorData>, "message">) {
    super({ message, data });
    this.name = "EShadowError";
  }
}

function attachStyles(target: HTMLElement | DocumentFragment) {
  const style = document.createElement("style");
  style.innerHTML = styles;
  target.appendChild(style);
}

export function attachShadow<E extends Element = Element>(target: E | null) {
  if (!target) {
    throw new EShadowError({});
  }
  const shadowTarget = document.createElement("div");
  target.appendChild(shadowTarget);
  const shadow = shadowTarget.attachShadow({ mode: "closed" });
  attachStyles(shadow);
  return { shadow, target: shadowTarget };
}
