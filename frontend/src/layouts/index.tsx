import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import styled from "@mui/styled-engine-sc";

// import Topbar from "./Topbar";
// import Footer from "./Footer";

interface Props {
  children?: any;
}

const Layout: React.FC<Props> = ({ children }: any) => {
  return (
    <StyledContainer>
      {/* <Topbar /> */}
      <Body component="main">{children}</Body>
      {/* <Footer /> */}
    </StyledContainer>
  );
};

const StyledContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  position: relative;
`;

const Body = styled(Box)`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
