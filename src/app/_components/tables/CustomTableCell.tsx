import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function CustomTableCell({ children, className, parentClassName }: { children: React.ReactNode; className?: string, parentClassName?: string }) {
  return (
    <TableCell className={cn(parentClassName)}>
      <div 
        className={cn(
          "text-sm text-gray-600 line-clamp-2",
          className
        )}
        >
        {children}
      </div>
    </TableCell>
  );
}
