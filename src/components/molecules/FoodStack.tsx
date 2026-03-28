"use client";
import Image from "next/image";
import { motion, TargetAndTransition } from "framer-motion";

const FoodStack = () => {
  // Animation variants for the container and children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delay between each image popping up
      },
    },
  };

  const imageVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12, // Lower damping = more bounce
      },
    },
  } as const;

  const floatingAnimation: TargetAndTransition = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

  return (
    <div className="w-full h-80 flex items-center justify-center overflow-hidden">

        <Image src="/svg/l-food-exp.svg" width={50} height={50} alt="" className="translate-x-10 -translate-y-32"/>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }} // Triggers when 50% visible
        className="flex flex-row items-center justify-center"
      >
        {/* Left Image */}
        <motion.div variants={imageVariants} className="-mr-12 z-10">
          <motion.div animate={floatingAnimation}>
            <Image
              alt="food left"
              src="/foodLeft.png"
              width={200}
              height={200}
              className="drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>

        {/* Middle Image (Highest Z-Index) */}
        <motion.div variants={imageVariants} className="z-30 scale-110">
          <motion.div animate={floatingAnimation} transition={{ delay: 0.5 }}>
            <Image
              alt="food middle"
              src="/foodMid.png"
              width={220} // Slightly larger for emphasis
              height={220}
              className="drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>

        {/* Right Image */}
        <motion.div variants={imageVariants} className="-ml-12 z-10">
          <motion.div animate={floatingAnimation} transition={{ delay: 0.2 }}>
            <Image
              alt="food right"
              src="/foodRight.png"
              width={200}
              height={200}
              className="drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </motion.div>

        <Image src="/svg/r-food-exp.svg" width={40} height={40} alt=""  className="translate-x-0 translate-y-20" />
    </div>
  );
};

export default FoodStack;