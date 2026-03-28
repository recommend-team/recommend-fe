import { CaricatureMiddle } from "../molecules/CaricatureMiddle";
import { BackgroundThree } from "../templates/BackgroundThree";
import { CaricatureBottom } from "./CaricatureBottom";
import { CaricatureTop } from "./CaricatureTop";
import { MobileOnlyCaricatureSection } from "./MobileOnlyCaricatureSection";

const CaricatureSection = () => {
  return (
    <BackgroundThree>
      <div className="flex flex-col">
        <CaricatureTop />
        <CaricatureMiddle />
        <CaricatureBottom />
        <MobileOnlyCaricatureSection />
      </div>
    </BackgroundThree>
  );
};

export default CaricatureSection;
