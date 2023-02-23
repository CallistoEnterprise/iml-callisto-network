import React from "react";
import PropTypes from "prop-types";
import ClaimModal from "../components/ClaimModal";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-full relative">
      <main className="flex flex-col flex-1">{children}</main>
      <ClaimModal />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
