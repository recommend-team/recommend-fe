import { Text } from "@/components/atoms/Text";
import ContactForm from "@/components/organisms/ContactForm";
import { BackgroundOne } from "@/components/templates/BackgroundOne";
import { SlidingLocations } from "@/components/templates/SlidingLocations";
import React from "react";

const Contact = () => {
  return (
    <BackgroundOne>
      <main className="flex flex-col p-5 md:p-10 pt-56 md:pt-64 gap-10 justify-center items-center">
        <Text variant="hero-heading" color="orange">
          Get In Touch With Our Team
        </Text>
        <div className="flex-row justify-center gap-10">
          <div>
            <Text variant="ticker" className="text-[40px]" >SEND US A MESSAGE.</Text>
          </div>
          <ContactForm />
        </div>
        <SlidingLocations />
      </main>
    </BackgroundOne>
  );
};

export default Contact;
