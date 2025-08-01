import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface FinancialInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  suffix?: string;
  error?: string;
  animate?: boolean;
}

const FinancialInput = forwardRef<HTMLInputElement, FinancialInputProps>(
  ({ className, type, label, icon, suffix, error, animate = true, ...props }, ref) => {
    const Component = animate ? motion.div : 'div';
    const motionProps = animate ? {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.5, ease: "easeOut" as any }
    } : {};

    return (
      <Component {...motionProps} className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-foreground/80">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "financial-input flex h-12 w-full rounded-lg px-3 py-2 text-base ring-offset-background",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-10",
              suffix && "pr-12",
              error && "border-destructive focus:border-destructive",
              className
            )}
            ref={ref}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {suffix}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </Component>
    );
  }
);

FinancialInput.displayName = "FinancialInput";

export { FinancialInput };