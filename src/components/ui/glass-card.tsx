import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  animate?: boolean;
  onClick?: () => void;
}

const GlassCard = ({ 
  children, 
  className, 
  hover = false, 
  glow = false,
  animate = true,
  onClick 
}: GlassCardProps) => {
  const Component = animate ? motion.div : 'div';
  const motionProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" as any }
  } : {};

  return (
    <Component
      {...motionProps}
      onClick={onClick}
      className={cn(
        "glass-card rounded-lg p-6",
        hover && "hover-lift cursor-pointer",
        glow && "revelation-glow",
        className
      )}
    >
      {children}
    </Component>
  );
};

export { GlassCard };