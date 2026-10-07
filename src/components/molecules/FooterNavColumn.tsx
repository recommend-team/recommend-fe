import Image from "next/image";
import Link from "next/link";
import { Text } from "@/components/atoms/Text";

/** A plain label, or a link. Off-site links open in a new tab. */
export type FooterItem = string | { label: string; href: string };

type FooterNavColumnProps = {
  heading: string;
  links: readonly FooterItem[];
  showStar?: boolean;
};

const isExternal = (href: string) => /^https?:\/\//.test(href);

export function FooterNavColumn({
  heading,
  links,
  showStar = false,
}: FooterNavColumnProps) {
  return (
    <div className="flex flex-col gap-3">
      <Text variant="neighborhoods-title" color="dark">
        {heading}
      </Text>
      <ul className="flex flex-col gap-2">
        {links.map((item) => {
          const label = typeof item === "string" ? item : item.label;
          const text = (
            <Text variant="neighborhoods-list" color="dark">
              {label}
            </Text>
          );

          return (
            <li key={label} className="flex items-center gap-1.5">
              {showStar && (
                <Image
                  src="/svg/star-bullet.svg"
                  alt=""
                  width={10}
                  height={10}
                  className="flex-shrink-0 mt-0.5"
                />
              )}
              {typeof item === "string" ? (
                text
              ) : isExternal(item.href) ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-70"
                >
                  {text}
                </a>
              ) : (
                <Link href={item.href} className="transition-opacity hover:opacity-70">
                  {text}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
