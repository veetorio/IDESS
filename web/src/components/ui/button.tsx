import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primário — fundo azul-roxo institucional
        default:
          "bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary",
        // Verde — ações de destaque (inscrição, CTA)
        success:
          "bg-green text-white hover:bg-green-dark focus-visible:ring-green",
        // Azul complementar
        secondary:
          "bg-blue text-white hover:bg-blue-dark focus-visible:ring-blue",
        // Contorno primário
        outline:
          "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white focus-visible:ring-primary",
        // Contorno branco (para usar sobre fundo primário)
        "outline-white":
          "border-2 border-base text-white bg-transparent hover:bg-white/10 focus-visible:ring-base",
        // Fantasma
        ghost:
          "text-primary bg-transparent hover:bg-primary/10 focus-visible:ring-primary",
        // Destrutivo
        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
        // Link
        link: "text-blue underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-8 px-4 text-xs",
        default: "h-10 px-6",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
