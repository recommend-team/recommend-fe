import { Text } from "../atoms/Text";

const CaricatureMiddle = () => {
  return (
    <div className="flex items-center justify-center w-full gap-4 md:gap-6 lg:gap-10 px-4">
      
      {/* left line */}
      <div className="flex-1 h-0.5 bg-green-500 opacity-30 px-10" />

      {/* middle text */}
      <Text
        variant="section-heading-48"
        color="orange"
        className="text-center"
      >
        Find Your Place in <br className="hidden sm:block" /> Recommend
      </Text>

      {/* right line */}
      <div className="flex-1 h-0.5 bg-green-500 opacity-30 px-10" />
    </div>
  );
};

export { CaricatureMiddle };