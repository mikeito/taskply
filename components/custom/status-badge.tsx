import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Dot } from "lucide-react";

const colorVariants = cva(
  "flex items-center border rounded-md h-7 text-xs w-32 capitalize",
  {
    variants: {
      variant: {
        default: "border-primary-200 bg-primary-600/10 text-primary-500",
        //acounts
        active: "border-green-200 bg-green-300/10 text-green-500",
        suspended: "border-gray-200 bg-gray-300/10 text-gray-500",
        deactivated: "border-red-200 bg-red-300/10 text-red-500",
        //transactions
        pending: "border-yellow-200 bg-yellow-300/10 text-yellow-500",
        validated: "border-green-200 bg-green-300/10 text-green-500",
        activated: "border-green-200 bg-green-300/10 text-green-500",
        rejected: "border-red-500 bg-red-300/10 text-red-500",
        failed: "border-red-500 bg-red-300/10 text-red-500",
        collected: "border-blue-200 bg-blue-300/10 text-blue-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface StatusBadgeProps {
  status: string;
  className?: string;
}
const statusToVariantMap: Record<
  string,
  VariantProps<typeof colorVariants>["variant"]
> = {
  default: "default",
  active: "active",
  deactivated: "deactivated",
  activated: "activated",
  suspended: "suspended",
  pending: "pending",
  validated: "validated",
  rejected: "rejected",
  collected: "collected",
  failed: "failed",
};

export default function StatusBadge({ status = "", className }: StatusBadgeProps) {

  if (!status) {
    return <></>
  }
  const statusVariant = statusToVariantMap[status.toLowerCase()] || "default";
  
  return (
    <div className={cn(colorVariants({ variant: statusVariant }), className)}>
      <Dot size={28} />
      <span className="truncate"> {status}</span>
    </div>
  );
}