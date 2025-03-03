import React from "react";
import Logo from "../assets/Logo.png";
import { Link } from "react-router-dom";

/**
 * Renders a logo component with a link to the home page.
 * 
 * This component displays the logo image and wraps it with a link to the home page.
 * 
 * @returns {JSX.Element} The JSX element representing the logo loader.
*/
function LogoLoader() {
    return (
        <div className="logo_image" style={{
            minWidth: "300px",
        }}>
           <Link to="/">
           <img src={Logo} alt="Logo"/>
           </Link> 
        </div>
    )
}

export default LogoLoader;