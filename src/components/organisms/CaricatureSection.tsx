import { CaricatureMiddle } from "../molecules/CaricatureMiddle";
import { CaricatureBottom } from "./CaricatureBottom";
import { CaricatureTop } from "./CaricatureTop";

const CaricatureSection = () => {
  return (
    <div className="flex flex-col">
      <CaricatureTop />
      <CaricatureMiddle />
      <CaricatureBottom />
    </div>
  );
};

export default CaricatureSection;
