import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "border-neutral-800 text-sm placeholder:text-neutral-600 bg-neutral-800 rounded-xl py-0 px-[15px] focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
