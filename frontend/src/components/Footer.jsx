import React from "react";
var current_year = new Date().getFullYear();

/**
 * Renders a footer component displaying copyright information.
 * 
 * This component displays a footer at the bottom of the page, fixed in position, 
 * containing copyright information with the current year.
 * 
 * @returns {JSX.Element} The JSX element representing the footer.
 */
function Footer() {
    return (
        <div style={{
            padding: "5px",
            textAlign: "center",
            bottom: "0",
            position: "fixed",
            width: "100%",
            backgroundColor: "rgba(34,38,66,255)",
            left: "0",
            color: "white",     
        }} >
            <b>Copyright © {current_year} - All Rights Reserved.</b>
        </div>
    )
}

export default Footer;