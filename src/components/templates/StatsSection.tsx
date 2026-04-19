import { StatItem } from "../atoms/StatItem";
import { BackgroundThree } from "./BackgroundThree";

const stats = [
  { number: "10M+", label: "Customers Reached" },
  { number: "98%",  label: "Satisfaction Rate" },
  { number: "500+", label: "Local Businesses" },
  { number: "<60s", label: "Avg Response Time" },
];

export default function StatsSection() {
  return (
    <BackgroundThree>
      <div className="w-full px-6 md:px-14 py-12 md:py-16 flex justify-center">

        {/* Desktop: single row | Mobile: 2x2 grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-20">
          {stats.map((stat) => (
            <StatItem key={stat.number} number={stat.number} label={stat.label} />
          ))}
        </div>

      </div>
    </BackgroundThree>
  );
}