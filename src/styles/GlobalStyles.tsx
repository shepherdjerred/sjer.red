import React from "react";
import { Global } from "@emotion/react";
import { css, GlobalStyles as BaseStyles } from "twin.macro";

const customStyles = css({});

const GlobalStyles = () => (
  <React.Fragment>
    <BaseStyles />
    <Global styles={customStyles} />
  </React.Fragment>
);

export default GlobalStyles;
