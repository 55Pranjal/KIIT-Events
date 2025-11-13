import Navbar from "./Navbar";

import MainSection from "./MainSection";
import Footer from "./Footer";

const LandingScreen = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col text-white">
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
