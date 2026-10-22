import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-white",
        primary: "bg-primary text-white",
        success: "bg-green text-white",
        secondary: "bg-neutral-200 text-neutral-700",
        blue: "bg-blue text-white",
        outline: "border border-primary text-primary bg-transparent",
        muted: "bg-neutral-100 text-neutral-700",
        destructive: "bg-red-100 text-red-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
