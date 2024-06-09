import { clsx } from "@lib/utils/clsx";
import { WithRequired } from "@lib/utils/typeUtils/WithRequired";
import { HTMLMotionProps, motion } from "framer-motion";
import { forwardRef } from "react";

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

function commonProps<Type extends "a" | "button">({
  className,
  ...props
}: Type extends "a" ? LinkProps : ButtonProps): (Type extends "a"
  ? LinkProps
  : ButtonProps) & { className: string } {
  // @ts-expect-error These types do match, but TypeScript doesn't seem to like it
  return {
    className: clsx(variantClasses(props), className, "cursor-pointer"),
    ...props,
  };
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <motion.button ref={ref} {...commonProps<"button">(props)}>
        {children}
      </motion.button>
    );
  },
);
Button.displayName = "Button";

export const ButtonLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ children, ...props }, ref) => {
    return (
      <motion.a ref={ref} {...commonProps<"a">(props)}>
        {children}
      </motion.a>
    );
  },
);
ButtonLink.displayName = "ButtonLink";

export const Link = forwardRef<HTMLAnchorElement, Omit<LinkProps, "variant">>(
  ({ children, ...props }, ref) => {
    return (
      <motion.a ref={ref} {...commonProps<"a">({ variant: "link", ...props })}>
        {children}
      </motion.a>
    );
  },
);
Link.displayName = "Link";
