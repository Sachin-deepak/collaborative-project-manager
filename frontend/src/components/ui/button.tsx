import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "dark:bg-gradient-to-br dark:from-primary/80 dark:to-primary dark:backdrop-blur-sm dark:border dark:border-white/10 dark:shadow-lg dark:shadow-primary/20 dark:text-primary-foreground dark:hover:shadow-xl dark:hover:shadow-primary/30 dark:hover:scale-[1.02] bg-gradient-to-br from-primary/90 to-primary backdrop-blur-sm border border-black/10 shadow-lg shadow-primary/10 text-primary-foreground hover:shadow-xl hover:shadow-primary/20 hover:scale-[1.02]",
        destructive:
          "dark:bg-gradient-to-br dark:from-destructive/80 dark:to-destructive dark:backdrop-blur-sm dark:border dark:border-white/10 dark:shadow-lg dark:shadow-destructive/20 dark:text-destructive-foreground dark:hover:shadow-xl dark:hover:shadow-destructive/30 dark:hover:scale-[1.02] bg-gradient-to-br from-destructive/90 to-destructive backdrop-blur-sm border border-black/10 shadow-lg shadow-destructive/10 text-destructive-foreground hover:shadow-xl hover:shadow-destructive/20 hover:scale-[1.02]",
        outline:
          "dark:border dark:border-white/20 dark:bg-white/10 dark:backdrop-blur-md dark:shadow-lg dark:hover:bg-white/20 dark:hover:shadow-xl dark:hover:scale-[1.02] border border-black/20 bg-black/5 backdrop-blur-md shadow-lg hover:bg-black/10 hover:shadow-xl hover:scale-[1.02] transition-all",
        secondary:
          "dark:bg-gradient-to-br dark:from-secondary/80 dark:to-secondary dark:backdrop-blur-sm dark:border dark:border-white/10 dark:shadow-lg dark:shadow-secondary/20 dark:text-secondary-foreground dark:hover:shadow-xl dark:hover:shadow-secondary/30 dark:hover:scale-[1.02] bg-gradient-to-br from-secondary/90 to-secondary backdrop-blur-sm border border-black/10 shadow-lg shadow-secondary/10 text-secondary-foreground hover:shadow-xl hover:shadow-secondary/20 hover:scale-[1.02]",
        ghost: 
          "dark:hover:bg-white/10 dark:backdrop-blur-sm dark:hover:text-accent-foreground hover:bg-black/5 backdrop-blur-sm hover:text-accent-foreground transition-colors",
        link: 
          "text-primary underline-offset-4 hover:underline",
        glass: 
          "dark:bg-white/10 dark:backdrop-blur-md dark:border dark:border-white/20 dark:shadow-lg dark:hover:bg-white/20 dark:hover:shadow-xl dark:hover:scale-[1.02] bg-black/5 backdrop-blur-md border border-black/10 shadow-lg hover:bg-black/10 hover:shadow-xl hover:scale-[1.02] transition-all",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
