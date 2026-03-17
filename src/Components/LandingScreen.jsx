import Navbar from "./Navbar";

import MainSection from "./MainSection";
import Footer from "./Footer";

const LandingScreen = () => {
  return (
    <>
      <div className="flex flex-col text-white min-h-screen">
        <Navbar />
        <div className="flex-1">
          <MainSection />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default LandingScreen;
