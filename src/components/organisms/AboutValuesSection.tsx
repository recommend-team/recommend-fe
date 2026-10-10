import ValuesSectionTemplate from "../templates/ValuesSectionTemplate";

export default function AboutValuesSection() {
  return (
    <ValuesSectionTemplate
      headingLine1="Four words."
      headingLine1Color="dark"
      headingLine2="Everything we do."
      headingLine2Color="orange"
      strengthIcon="/svg/strength.svg"
      centerImages={[
        "/images/stopwatch.png",
        "/images/trusted.png",
        "/images/simple.png",
        "/images/local.png",
      ]}
      centerImageAlt="Rotating image"
      joyleapIcon="/svg/joyleap.svg"
      faqs={[
        {
          title: "Fast",
          description:
            "Seconds, not minutes. Every feature we build asks one question: does this make it faster?",
        },
        {
          title: "Trusted",
          description:
            "Every vendor verified. Every transaction protected. We don't just connect — we stand behind every order.",
        },
        {
          title: "Simple",
          description:
            "Just chat. No forms, no menus to dig through — say what you want and we handle the rest.",
        },
        {
          title: "Local",
          description:
            "Built in your city, for your street. We actually know your neighbourhood.",
        },
      ]}
    />
  );
}