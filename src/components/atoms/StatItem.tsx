import { Text } from "./Text";

type StatItemProps = {
  number: string;
  label: string;
};

export function StatItem({ number, label }: StatItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <Text variant="stats-number" color="orange">
        {number}
      </Text>
      <div className="w-35 h-[2px] bg-[#DC4634] opacity-50 mb-1" />
      <Text variant="stats-label" color="dark">
        {label}
      </Text>
    </div>
  );
}