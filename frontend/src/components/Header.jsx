import React from "react";
import LogoLoader from "./LogoLoader";
import NavBar from "./NavBar";
import ActionButton from "./ActionButton";
import DropDownMenu from "./DropDownMenu";

const headerHeight = Math.min(screen.height * 0.1,100);

/**
 * Renders a header component for the application.
 * 
 * This component represents the header section of the application, 
 * which typically contains the logo, navigation bar, action button, and dropdown menu.
 * It provides styling and layout for these elements.
 * 
 * @returns {JSX.Element} The JSX element representing the header.
*/
function Header() {
  return (
    <div
      className="header"
      style={{
        textAlign: "center",
        top: "0",
        position: "fixed",
        width: "100%",
        backgroundColor: "rgba(34,38,66,255)",
        left: "0",
        textAlign: "left",
        display: "flex",
        height: headerHeight,
        zIndex: 1000,
      }}
    >
      <LogoLoader />
      <NavBar height={headerHeight} />
      <ActionButton />
      <DropDownMenu />
    </div>
  );
}

export default Header;
