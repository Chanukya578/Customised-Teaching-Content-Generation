import React from "react";
import HandleAPIResponse from "./HandleAPIResponse"

/**
 * Renders the main content area of the application.
 * 
 * This component represents the main content area of the content page of the website where the API response is displayed.
 * 
 * @returns {JSX.Element} The JSX element representing the main content.
*/
function MainContent() {
    return (
        <div style={{
            width: "100%",
            height: "100%x",
            position: "fixed",
            left: "0",
            top: "100px",
            bottom: "135px",
            textAlign: "center",
            flexDirection: "column",
            display: 'flex',
        }}>
            <HandleAPIResponse />
        </div>
    )
};

export default MainContent;