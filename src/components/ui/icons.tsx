import type { SVGProps } from "react";

// Small monochrome line icons, drawn in currentColor so a chip controls colour.
const base: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

export function IconSearch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="6" />
      <line x1="20" y1="20" x2="16.5" y2="16.5" />
    </svg>
  );
}

export function IconLayers(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4 3 9l9 5 9-5-9-5Z" />
      <path d="M3 14l9 5 9-5" />
    </svg>
  );
}

export function IconSpark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3c.6 3.8 2.4 5.6 6 6-3.6.4-5.4 2.2-6 6-.6-3.8-2.4-5.6-6-6 3.6-.4 5.4-2.2 6-6Z" />
    </svg>
  );
}

export function IconSend(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function IconCanvas(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M9 4v16M4 9h16" />
    </svg>
  );
}

export function IconPeople(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="9" r="3" />
      <path d="M15 6.5a3 3 0 0 1 0 6" />
      <path d="M4 19a5 5 0 0 1 10 0" />
      <path d="M15.5 14.5A5 5 0 0 1 20 19" />
    </svg>
  );
}
