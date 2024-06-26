import { clsx } from "@lib/utils/dom/clsx";
import { WithRequired } from "@lib/utils/typeUtils/WithRequired";
import { HTMLMotionProps, motion, useAnimate } from "framer-motion";
import { forwardRef, useMemo } from "react";

type ButtonStyleProps = {
  variant?: "solid" | "outline" | "link";
  color?: "primary";
};
type ButtonProps = HTMLMotionProps<"button"> & ButtonStyleProps;
type LinkProps = WithRequired<HTMLMotionProps<"a">, "href"> & ButtonStyleProps;

function variantClasses({
  variant = "solid",
  color = "primary",
}: ButtonStyleProps) {
  if (variant === "outline") {
    const borderColor = (() => {
      switch (color) {
        case "primary":
          return "border-primary text-primary rounded flex flex-row justify-center items-center gap-2 px py-1";
      }
    })();
    return clsx(borderColor, "border-thick");
  }
  if (variant === "link") {
    return clsx("text-primary inline");
  }

  switch (color) {
    case "primary":
      return "bg-primary text-primary-contrast shadow-sm rounded flex flex-row justify-center items-center gap-2 px py-1";
  }
}

function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref !== null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

function useCommonProps<Type extends "a" | "button">(
  { className, ...props }: Type extends "a" ? LinkProps : ButtonProps,
  ref: Type extends "a"
    ? React.Ref<HTMLAnchorElement>
    : React.Ref<HTMLButtonElement>,
): (Type extends "a" ? LinkProps : ButtonProps) & { className: string } {
  const [scope, animate] = useAnimate();

  // @ts-expect-error These types do match, but TypeScript doesn't seem to like it
  return useMemo(
    () => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick: async (e: any) => {
        props.onClick?.(e);
        await animate(scope.current, { opacity: 0.95 }, { duration: 0.1 });
        await animate(scope.current, { opacity: 0.8 }, { duration: 0.1 });
      },
      initial: { opacity: 1 },
      whileHover: { opacity: 0.8 },
      whileFocus: { opacity: 0.8 },
      className: clsx(
        variantClasses(props),
        className,
        "cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
      ),
      ...props,
      ref: mergeRefs(ref, scope),
    }),
    [animate, className, props, ref, scope],
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <motion.button {...useCommonProps<"button">(props, ref)}>
        {children}
      </motion.button>
    );
  },
);
Button.displayName = "Button";

export const ButtonLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ children, ...props }, ref) => {
    const common = useCommonProps<"a">(props, ref);

    return <motion.a {...common}>{children}</motion.a>;
  },
);
ButtonLink.displayName = "ButtonLink";

export const Link = forwardRef<HTMLAnchorElement, Omit<LinkProps, "variant">>(
  ({ children, ...props }, ref) => {
    return (
      <motion.a {...useCommonProps<"a">({ variant: "link", ...props }, ref)}>
        {children}
      </motion.a>
    );
  },
);
Link.displayName = "Link";
