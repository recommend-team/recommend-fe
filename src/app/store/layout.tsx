import { Providers } from "../providers";

export const metadata = {
  title: "Recommend Store",
  description: "Browse products and place your order",
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
