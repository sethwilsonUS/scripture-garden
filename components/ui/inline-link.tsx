import Link from "next/link";
import { cn } from "@/lib/utils";

type InlineLinkProps = React.ComponentPropsWithoutRef<typeof Link>;

export function InlineLink({ className, ...props }: InlineLinkProps) {
  return <Link className={cn("inline-link", className)} {...props} />;
}
