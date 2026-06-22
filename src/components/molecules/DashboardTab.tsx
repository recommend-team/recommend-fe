import { cn } from "@/lib/utilities";
import React, { Dispatch, SetStateAction } from "react";
import {
  DashboardTabType,
  vendorDashboardTabs,
} from "../templates/DashboardLayout";
import { LucideIcon } from "lucide-react";

type VendorDashboardTabType = {
  activeTab: DashboardTabType;
  tab: DashboardTabType;
  setActiveTab: Dispatch<SetStateAction<DashboardTabType>>;
  TabIcon: LucideIcon;
  isActive: boolean;
  tabs: typeof vendorDashboardTabs;
};

const VendorDashboardTab = ({
  activeTab,
  tab,
  setActiveTab,
  TabIcon,
  isActive,
  tabs,
}: VendorDashboardTabType) => {
  return (
    <div
      onClick={() => setActiveTab(tab)}
      className={cn(
        "flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity px-8 h-full rounded-t-lg",
        activeTab === tab ? "bg-white" : "bg-none",
      )}
    >
      <p
        className={cn(
          activeTab === tab
            ? "font-bold text-black"
            : "font-normal text-gray-500",
        )}
      >
        {tabs[tab].title}
      </p>
      <TabIcon
        height={15}
        width={15}
        className={isActive ? "text-yellow-500" : "text-gray-400"}
      />
    </div>
  );
};

export { VendorDashboardTab };
