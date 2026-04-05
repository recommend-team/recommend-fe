import Image from "next/image";
import { Text } from "../atoms/Text";
import { Button } from "../molecules/Button";
import FoodStack from "../molecules/FoodStack";
import { BackgroundTwo } from "../templates/BackgroundTwo";

const LandingSectionOne = () => {
  return (
    <BackgroundTwo>
      <main className="flex flex-col p-5 md:p-10 pt-56 md:pt-64 gap-10 justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <Text variant="hero-heading" color="orange">
            Your Personal AI Market <br className="hidden md:flex" /> Assistant.
          </Text>

          <Text variant="hero-subtext" className="mt-5">
            Anything you need, delivered <br className="md:hidden" />
            right on WhatsApp.
          </Text>
          <div className="pt-5">
            <Button
              variant="gradient"
              text="Start Ordering"
              icon={
                <Image
                  alt="whatsapp icon"
                  src="/icon_whatsapp.svg"
                  width={20}
                  height={20}
                />
              }
            />
          </div>
        </div>
        <FoodStack />
      </main>
    </BackgroundTwo>
  );
};

export { LandingSectionOne };
