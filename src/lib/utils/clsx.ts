type ClassValue = string | undefined | null | boolean;

export function clsx(...args: (ClassValue | ClassValue[])[]) {
  return args.filter(Boolean).join(" ");
}
