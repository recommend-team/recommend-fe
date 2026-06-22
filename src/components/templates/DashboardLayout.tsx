import {
  BoxIcon,
  ChartColumnBig,
  CheckCircle,
  ReceiptText,
  Store,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { Card } from "../atoms/Card";
import { VendorDashboardTab } from "../molecules/DashboardTab";

export type DashboardTabType = keyof typeof vendorDashboardTabs;

export const vendorDashboardTabs = {
  dashboard: { icon: BoxIcon, title: "Dashboard" },
  orders: { icon: CheckCircle, title: "Orders" },
  inventory: { icon: Store, title: "Inventory" },
  payments: { icon: ReceiptText, title: "Payments" },
  grow: { icon: ChartColumnBig, title: "Grow" },
};

const dashboardvendorDashboardTabs: DashboardTabType[] = [
  "dashboard",
  "orders",
  "inventory",
  "payments",
  "grow",
];

type DashboardLayoutType = {
  dashboard: ReactNode;
  orders: ReactNode;
  inventory: ReactNode;
  payments: ReactNode;
  grow: ReactNode;
};

const DashboardLayout = ({
  dashboard,
  orders,
  inventory,
  payments,
  grow,
}: DashboardLayoutType) => {
  const [activeTab, setActiveTab] = useState<DashboardTabType>("dashboard");

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <div>{dashboard}</div>;
      case "orders":
        return <div>{orders}</div>;
      case "inventory":
        return <div>{inventory}</div>;
      case "payments":
        return <div>{payments}</div>;
      case "grow":
        return <div>{grow}</div>;
      default:
        return null;
    }
  };

  return (
    <Card hoverable={false} className="p-0 overflow-hidden">
      {/* Clickable header */}
      <div className="w-full bg-[#F6F8FA] h-auto md:h-24 flex items-center pt-2 md:pt-0">
        <div className="flex flex-row  flex-wrap h-full justify-start md:justify-center  items-center gap-2 md:gap-6 pt-0 md:pt-2">
          {dashboardvendorDashboardTabs.map((tab, index) => {
            const TabIcon = vendorDashboardTabs[tab].icon;
            const isActive = activeTab === tab;

            return (
              <VendorDashboardTab
                TabIcon={TabIcon}
                activeTab={activeTab}
                isActive={isActive}
                setActiveTab={setActiveTab}
                tab={tab}
                tabs={vendorDashboardTabs}
                key={index}
              />
            );
          })}
        </div>
      </div>
      {/* Main Content Area */}
      <div className="h-50 p-6 vertical-scroll-allow">{renderTabContent()}</div>
    </Card>
  );
};

export { DashboardLayout };
