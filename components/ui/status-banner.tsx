import { CheckCircle2, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusBannerVariant = "status" | "error";

type StatusBannerProps = React.ComponentPropsWithoutRef<"div"> & {
  title: string;
  variant?: StatusBannerVariant;
};

export function StatusBanner({
  title,
  variant = "status",
  className,
  children,
  ...props
}: StatusBannerProps) {
  const Icon = variant === "error" ? TriangleAlert : CheckCircle2;
  const role = variant === "error" ? "alert" : "status";

  return (
    <div
      role={role}
      className={cn(
        "alert-banner",
        variant === "error" && "alert-error",
        className,
      )}
      {...props}
    >
      <Icon aria-hidden="true" className="alert-banner__icon" />
      <div>
        <h2 className="alert-banner__title">{title}</h2>
        <div className="alert-banner__body">{children}</div>
      </div>
    </div>
  );
}
