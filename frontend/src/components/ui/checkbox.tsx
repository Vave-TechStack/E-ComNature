import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

function Checkbox({
  className,
  checked,
  onCheckedChange,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "checked"> & {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}) {
  return (
    <label
      data-slot="checkbox"
      className={cn(
        "group relative inline-flex items-center justify-center",
        className
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className="peer sr-only"
        {...props}
      />
      <div
        className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-white transition-colors peer-checked:border-primary-600 peer-checked:bg-primary-600 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500/20 peer-disabled:opacity-50"
      >
        <Check className="h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
      </div>
    </label>
  )
}

export { Checkbox }
