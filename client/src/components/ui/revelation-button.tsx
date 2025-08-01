import { ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const revelationButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft",
        glass: "glass-button text-foreground hover:text-primary",
        revelation: "bg-gradient-revelation text-primary-foreground hover:scale-105 shadow-revelation",
        success: "status-success shadow-soft hover:scale-105",
        warning: "status-warning shadow-soft hover:scale-105",
        accent: "status-accent shadow-soft hover:scale-105",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface RevelationButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof revelationButtonVariants> {
  asChild?: boolean;
  animate?: boolean;
  particles?: boolean;
}

const RevelationButton = forwardRef<HTMLButtonElement, RevelationButtonProps>(
  ({ className, variant, size, asChild = false, animate = true, particles = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const Component = animate ? motion.button : (Comp as any);
    
    const motionProps = animate ? {
      whileHover: { scale: variant === "revelation" ? 1.05 : 1.02 },
      whileTap: { scale: 0.98 },
      transition: { type: "spring", stiffness: 400, damping: 17 }
    } : {};

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (particles && variant === "revelation") {
        // Create particle burst effect
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        for (let i = 0; i < 12; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle-burst';
          particle.style.left = `${x}px`;
          particle.style.top = `${y}px`;
          particle.style.setProperty('--dx', `${(Math.random() - 0.5) * 200}px`);
          particle.style.setProperty('--dy', `${(Math.random() - 0.5) * 200}px`);
          e.currentTarget.appendChild(particle);
          
          setTimeout(() => particle.remove(), 2000);
        }
      }
      
      props.onClick?.(e);
    };

    return (
      <Component
        className={cn(revelationButtonVariants({ variant, size, className }))}
        ref={ref}
        {...motionProps}
        {...props}
        onClick={handleClick}
      >
        {children}
      </Component>
    );
  }
);

RevelationButton.displayName = "RevelationButton";

export { RevelationButton, revelationButtonVariants };