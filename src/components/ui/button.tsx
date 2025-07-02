import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "gradient";
  size?: "default" | "sm" | "lg" | "xl";
  rounded?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "default", rounded = false, ...props },
    ref
  ) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
          {
            // Variants
            "bg-primary hover:bg-primary-dark text-white shadow-sm hover:shadow-md":
              variant === "default",
            "border border-border bg-transparent hover:bg-hover hover:border-primary text-foreground":
              variant === "outline",
            "bg-transparent hover:bg-hover text-foreground": variant === "ghost",
            "text-primary underline-offset-4 hover:underline hover:text-primary-dark":
              variant === "link",
            "btn-gradient": variant === "gradient",

            // Sizes
            "h-10 px-4 py-2 text-sm": size === "default",
            "h-9 px-3 text-xs": size === "sm",
            "h-12 px-6 text-base": size === "lg",
            "h-14 px-8 text-lg": size === "xl",

            // Border radius
            "rounded-md": !rounded,
            "rounded-full": rounded,
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
