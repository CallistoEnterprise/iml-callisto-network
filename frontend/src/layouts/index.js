import { useContext } from "react";
import { useCookies } from "react-cookie";
import PropTypes from "prop-types";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import CookieBar from "../components/CookieBar";
import ConnectModal from "../components/ConnectModal";
import { ModalContext } from "../contexts/ModalContextProvider";

const Layout = ({ children }) => {
  const [cookies] = useCookies(["accept"])
  const { openConnectModal } = useContext(ModalContext)
  return (
    <div className="flex flex-col min-h-full relative">
      <main className="flex flex-col flex-1">
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex flex-col items-start flex-1 py-5 lg:py-[33.19px] overflow-auto">
            <Header />
            {children}
            <Footer />
          </div>
        </div>
      </main>
      {openConnectModal && <ConnectModal />}
      {cookies.accept !== "true" && <CookieBar />}
      {/* <ClaimModal /> */}
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
