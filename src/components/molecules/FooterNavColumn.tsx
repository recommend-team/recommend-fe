import Image from "next/image";
import { Text } from "@/components/atoms/Text";

type FooterNavColumnProps = {
  heading: string;
  links: string[];
  showStar?: boolean;
};

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
        {links.map((link) => (
          <li key={link} className="flex items-center gap-1.5">
            {showStar && (
              <Image
                src="/svg/star-bullet.svg"
                alt=""
                width={10}
                height={10}
                className="flex-shrink-0 mt-0.5"
              />
            )}
            <a href="#">
              <Text variant="neighborhoods-list" color="dark">
                {link}
              </Text>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}