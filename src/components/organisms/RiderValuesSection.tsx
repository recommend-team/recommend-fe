import ValuesSectionTemplate from "../templates/ValuesSectionTemplate";

export default function RiderValuesSection() {
  return (
    <ValuesSectionTemplate
      headingLine1="Your hustle,"
      headingLine1Color="orange"
      headingLine2="your rules."
      headingLine2Color="grey"
      strengthIcon="/svg/strength.svg"
      centerImages={[
        "/images/payouts.png",
        "/images/schedule.png",
        "/images/cleandelivery.png",
       "/images/neighborhood.png",
      ]}
      centerImageAlt="Payouts"
      faqs={[
        {
          title: "Fast Payouts",
          description:
            "Withdraw your earnings anytime directly to your bank account. No waiting, no delays — your money, your pace.",
        },
        {
          title: "Flexible Schedule",
          description:
            "Ride when it works for you. Accept orders, take breaks, or log off — no shifts, no quotas, no manager.",
        },
        {
          title: "Simple Rider App",
          description:
            "A clean dashboard built for the road. See orders, navigate, and track earnings without digging through menus.",
        },
        {
          title: "Neighborhood",
          description:
            "We match you with orders close to where you already are. Less driving between jobs, more income per hour.",
        },
      ]}
    />
  );
}