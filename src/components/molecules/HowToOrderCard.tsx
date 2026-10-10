"use client";

import Image from "next/image";
import { Text } from "../atoms/Text";

type CardProps = {
  title: string;
  description: string;
  image: string;
};

export const HowToOrderCard = ({ title, description, image }: CardProps) => {
  return (
    <div className="flex flex-col gap-8 w-full  max-w-sm rounded-2xl overflow-hidden">
      <div className="flex flex-col gap-8">
        <Text variant="cta-label" color="dark" className="text-start">
          {title}
        </Text>

        <div className=" flex flex-col justify-center h-10">
          <Text
            variant="neighborhoods-list"
            color="grey"
            className="text-start"
          >
            {description}
          </Text>
        </div>
      </div>
      <div className="relative w-full aspect-241/136">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
    </div>
  );
};
