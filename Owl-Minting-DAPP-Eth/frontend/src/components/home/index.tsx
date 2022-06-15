import React from "react";
import { Navbar } from "components";
import HeroSection from "./heroSection";
import InfoSection from "./infoSection";
const HomeCom = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <InfoSection/>
    </div>
  );
};

export default HomeCom;
