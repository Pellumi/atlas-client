import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "../../utils/classNames";
import { FiX } from "react-icons/fi";

export function Sheet({ open, onOpenChange, children }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 transition-opacity" />
        {children}
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function SheetContent({ children, side = "left", className }) {
  return (
    <Dialog.Content
      className={cn(
        "fixed top-0 h-full w-64 bg-white shadow-lg z-50 p-4 transition-transform duration-300",
        side === "left" ? "left-0 translate-x-0" : "right-0 translate-x-0",
        className
      )}
    >
      <button
        onClick={() => Dialog.Root?.onOpenChange?.(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <FiX className="w-5 h-5" />
      </button>
      {children}
    </Dialog.Content>
  );
}
