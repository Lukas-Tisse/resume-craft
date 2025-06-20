import { TooltipProvider } from "@radix-ui/react-tooltip";
import {
  Tooltip as TooltipRoot,
  TooltipContent,
  TooltipTrigger,
} from "./primitive";
import { ReactNode } from "react";

type TooltipProps = {
  children: ReactNode;
  content: string | number | ReactNode;
};

export const Tooltip = ({ children, content, ...props }: TooltipProps) => {
  return (
    <TooltipProvider>
      <TooltipRoot delayDuration={300}>
        <TooltipTrigger asChild {...props}>
          {children}
        </TooltipTrigger>
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
};
