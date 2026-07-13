import { useEffect, useState } from "react";
import { Text } from "../atoms/Text";
import { cn } from "@/lib/utilities";
import { useNetworkStatus } from "@/hooks/useNetworkChecker";
import { LucideIcon } from "lucide-react";

const alertVariants = {
  warning: "bg-red-800 text-white border border-red-400/20",
  inform: "bg-green-800 text-white border border-amber-400/20",
  positive_alert: "bg-blue-500 text-white border border-emerald-400/20",
} as const;

type VariantType = keyof typeof alertVariants;

interface AlertBarProps {
  AlertText: string;
  variant: VariantType;
  className?: string;
  icon?: LucideIcon;
  hide: boolean;
  iconColor?: "red" | "yellow" | "blue" | "green";
}

const AlertBar = ({
  AlertText,
  variant,
  className,
  icon: Icon,
  iconColor = "yellow",
  hide,
}: AlertBarProps) => {
  const { isOnline } = useNetworkStatus();

  const [displayText, setDisplayText] = useState(AlertText);
  const [displayVariant, setDisplayVariant] = useState<VariantType>(variant);

  const [wasOffline, setWasOffline] = useState(!isOnline);

  useEffect(() => {
    const handleSetStateAsynchronously = () => {
      let timer: NodeJS.Timeout;

      if (!isOnline) {
        setDisplayText("No internet connection");
        setDisplayVariant("warning");
        setWasOffline(true);
      } else if (wasOffline && isOnline) {
        setDisplayText("Connection restored");
        setDisplayVariant("positive_alert");

        timer = setTimeout(() => {
          setDisplayText(AlertText);
          setDisplayVariant(variant);
          setWasOffline(false);
        }, 5000);
      } else {
        setDisplayText(AlertText);
        setDisplayVariant(variant);
      }

      return () => {
        if (timer) clearTimeout(timer);
      };
    };
    handleSetStateAsynchronously();
  }, [isOnline, wasOffline, AlertText, variant]);

  const iconcolor = {
    red: "red",
    yellow: "yellow",
    blue: "blue",
    green: "green",
  };

  return (
    <div
      className={cn(
        "fixed top-0 left-0 z-10000 flex flex-row justify-center items-center gap-2 w-full py-2.5 px-4 text-center transition-colors duration-200",
        alertVariants[displayVariant],
        className,
        hide ? "hidden" : "",
      )}
    >
      {Icon && (
        <Icon
          className={cn("w-4 h-4 shrink-0 text-black", `${iconColor}`)}
          fill={iconcolor[iconColor]}
        />
      )}

      <Text
        variant="cta-sublabel"
        className="font-semibold tracking-wide text-white"
      >
        {displayText}
      </Text>
    </div>
  );
};

export { AlertBar };
