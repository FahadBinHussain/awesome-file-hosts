"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { useEffect, useState } from "react";

type LinkHref = LinkProps<string>["href"];

type Props = {
  href: LinkHref;
  children: ReactNode;
  className?: string;
  pendingClassName?: string;
  loadingLabel?: string;
  target?: string;
  rel?: string;
};

function pathFromHref(href: LinkHref) {
  if (typeof href === "string") {
    return href.split("#")[0]?.split("?")[0] || "/";
  }

  return href.pathname ?? "/";
}

export function LoadingLink({
  href,
  children,
  className = "",
  pendingClassName = "",
  loadingLabel = "Loading…",
  target,
  rel
}: Props) {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setPending(false);
  }, [pathname]);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0 ||
      target === "_blank"
    ) {
      return;
    }

    if (pathFromHref(href) !== pathname) {
      setPending(true);
    }
  }

  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      onClick={handleClick}
      aria-busy={pending || undefined}
      className={[
        "loading-link",
        className,
        pending ? `loading-link-pending ${pendingClassName}` : ""
      ].join(" ")}
    >
      {children}
      {pending ? (
        <>
          <span className="loading-link-bar" aria-hidden="true">
            <span />
          </span>
          <span className="sr-only" aria-live="polite">
            {loadingLabel}
          </span>
        </>
      ) : null}
    </Link>
  );
}
