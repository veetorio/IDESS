import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  erro?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, erro, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-md border bg-white px-3 py-2 text-sm",
          "placeholder:text-neutral-600",
          "focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors",
          erro
            ? "border-red-500 focus:ring-red-500"
            : "border-neutral-300",
          className
        )}
        ref={ref}
        aria-invalid={erro ? "true" : undefined}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
