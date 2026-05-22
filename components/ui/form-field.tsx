import { useId } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FormFieldProps = Omit<React.ComponentProps<typeof Input>, "id"> & {
  label: string;
  helpText?: string;
  error?: string;
};

export function FormField({
  label,
  helpText,
  error,
  className,
  ...props
}: FormFieldProps) {
  const inputId = useId();
  const helpId = helpText ? `${inputId}-help` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={inputId}>
        {label}
      </label>
      <Input
        id={inputId}
        className={cn(className)}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {helpText ? (
        <p id={helpId} className="form-field__help">
          {helpText}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="form-field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
