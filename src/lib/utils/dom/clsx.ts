type ClassValue = string | undefined | null | boolean;

export function clsx(...args: (ClassValue | ClassValue[])[]) {
  return args.flat(1).filter(Boolean).join(" ");
}
