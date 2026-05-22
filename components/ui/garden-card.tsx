import { cn } from "@/lib/utils";

type GardenCardProps = React.ComponentPropsWithoutRef<"section"> & {
  eyebrow?: string;
  title: string;
};

export function GardenCard({
  eyebrow,
  title,
  className,
  children,
  ...props
}: GardenCardProps) {
  return (
    <section className={cn("garden-bed", className)} {...props}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="garden-card-title">{title}</h2>
      <div className="garden-card-body">{children}</div>
    </section>
  );
}
