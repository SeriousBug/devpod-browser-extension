import { clsx } from "@lib/utils/clsx";
import { HTMLMotionProps, motion } from "framer-motion";
import { forwardRef } from "react";

type ButtonStyleProps = {
  variant?: "solid" | "outline";
  color?: "primary";
};
type ButtonProps = HTMLMotionProps<"button"> & ButtonStyleProps;
type ButtonLinkProps = HTMLMotionProps<"a"> & ButtonStyleProps;

function colors({ variant = "solid", color = "primary" }: ButtonStyleProps) {
  if (variant === "outline") {
    const borderColor = (() => {
      switch (color) {
        case "primary":
          return "border-primary text-text";
      }
    })();
    return clsx(borderColor, "border-thick");
  }

  switch (color) {
    case "primary":
      return "bg-primary text-primary-contrast";
  }
}

function commonProps<Type extends "a" | "button">({
  className,
  ...props
}: Type extends "a" ? ButtonLinkProps : ButtonProps): Type extends "a"
  ? ButtonLinkProps
  : ButtonProps {
  return {
    className: clsx(
      "rounded shadow-sm flex flex-row justify-center items-center gap-2 px py-1",
      colors(props),
      className,
    ),
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

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ children, ...props }, ref) => {
    return (
      <motion.a ref={ref} {...commonProps<"a">(props)}>
        {children}
      </motion.a>
    );
  },
);
ButtonLink.displayName = "ButtonLink";
