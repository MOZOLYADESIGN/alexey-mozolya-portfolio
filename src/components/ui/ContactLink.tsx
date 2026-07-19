import type { AnchorHTMLAttributes, ReactNode } from "react";

import { telegramUrl } from "@/content/site";

interface ContactLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  children: ReactNode;
}

export function ContactLink({ children, ...props }: ContactLinkProps) {
  return (
    <a href={telegramUrl} {...props}>
      {children}
    </a>
  );
}

