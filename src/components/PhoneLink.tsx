import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface PhoneLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  number: string;
  countryCode?: string;
  label?: string;
}

const normalizeNumber = (number: string, countryCode: string) => {
  const digits = number.replace(/\D/g, "");
  const sanitized = digits.startsWith("0") ? digits.slice(1) : digits;
  return `https://wa.me/${countryCode}${sanitized}`;
};

export const PhoneLink = ({ number, countryCode = "964", label, className, children, ...rest }: PhoneLinkProps) => {
  const href = normalizeNumber(number, countryCode);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-colors",
        "bg-secondary/10 text-secondary hover:bg-secondary hover:text-white",
        className,
      )}
      aria-label={`WhatsApp ${label ?? number}`}
      {...rest}
    >
      {children ?? label ?? number}
    </a>
  );
};
