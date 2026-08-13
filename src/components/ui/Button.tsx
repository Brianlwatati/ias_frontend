import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          variant === "primary" && "btn-primary",
          variant === "secondary" && "btn-secondary",
          variant === "danger" &&
            "btn-primary bg-danger hover:bg-danger/90",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
