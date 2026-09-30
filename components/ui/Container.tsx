import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer";
};

export function Container({ children, className, as = "div" }: ContainerProps) {
  const Component = as as ElementType;

  return (
    <Component className={cn("mx-auto max-w-[1120px] px-[22px] md:px-[40px]", className)}>
      {children}
    </Component>
  );
}
