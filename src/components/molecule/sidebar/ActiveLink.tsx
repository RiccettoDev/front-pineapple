"use client";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { cloneElement, ReactElement } from "react";

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  shouldMatchExactHref?: boolean;
}

export const ActiveLink: React.FC<ActiveLinkProps> = ({
  children,
  shouldMatchExactHref = false,
  ...rest
}) => {
  const path = usePathname();

  let isActive = false;

  if (shouldMatchExactHref && (path === rest.href || path === rest.as)) {
    isActive = true;
  } else if (
    !shouldMatchExactHref &&
    (path.startsWith(String(rest.href)) || path.startsWith(String(rest.as)))
  ) {
    isActive = true;
  }
  return (
    <Link {...rest}>
      {cloneElement(
        children,
        isActive ? { bg: "#b9fa3c", color: "#0c0c32" } : {}
      )}
    </Link>
  );
};
