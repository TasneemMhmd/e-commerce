import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import BackToTop from "../../components/BackToTop";
import Footer from "../../components/Footer";

const ClientLayout = () => {
  return (
    <>
    <BackToTop />
      <Navbar />
      <Outlet />
      {/* <Footer /> */}
    </>
  );
};

export default ClientLayout;
