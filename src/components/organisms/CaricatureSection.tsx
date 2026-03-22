import { CaricatureMiddle } from "../molecules/CaricatureMiddle";
import { CaricatureBottom } from "./CaricatureBottom";
import { CaricatureTop } from "./CaricatureTop";
import { MobileOnlyCaricatureSection } from "./MobileOnlyCaricatureSection";

const CaricatureSection = () => {
  return (
    <div className="flex flex-col">
      <CaricatureTop />
      <CaricatureMiddle />
      <CaricatureBottom />
      <MobileOnlyCaricatureSection/>
    </div>
  );
};

export default CaricatureSection;
