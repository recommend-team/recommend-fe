import { Text } from "@/components/atoms/Text";

export default function Home() {
  return (
    <main className="p-10 space-y-10">

      <Text variant="hero-heading" color="orange">
        Your Personal AI Market Assistant
      </Text>

      <Text variant="hero-subtext">
        Anything you need, delivered right on WhatsApp.
      </Text>

      <Text variant="section-heading-96" color="orange">
        What You Can Order
      </Text>

      <Text variant="section-heading-48">
        Fresh Groceries Delivered Fast
      </Text>

      <Text variant="cta-label" color="green">
        Start Ordering Now
      </Text>

      <Text variant="cta-sublabel">
        It only takes a few seconds
      </Text>

    </main>
  );
}