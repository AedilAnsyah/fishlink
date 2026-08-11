import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[44px]",
  {
    variants: {
      variant: {
        default: "bg-ocean-900 text-white hover:bg-ocean-700 active:bg-ocean-700",
        outline:
          "border-[1.5px] border-ocean-900 text-ocean-900 bg-transparent hover:bg-sky-50",
        accent: "bg-sky-400 text-ink-900 hover:bg-sky-200 font-semibold",
        secondary: "bg-ink-100 text-ink-900 hover:bg-ink-200",
        ghost: "hover:bg-ink-100 text-ink-900",
        destructive: "bg-danger-600 text-white hover:bg-danger-600/90",
      },
      size: {
        default: "h-11 px-4 py-2.5",
        sm: "h-9 rounded-md px-3 text-xs min-h-[36px]",
        lg: "h-12 rounded-[10px] px-6 text-base min-h-[48px]",
        icon: "h-11 w-11",
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
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
