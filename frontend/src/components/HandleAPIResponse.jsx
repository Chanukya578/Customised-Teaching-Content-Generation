import React from "react";

/**
 * Renders a component to handle API responses.
 * 
 * This component displays a wrapper containing a question and its corresponding response.
 * It provides styling to present the question and answer in a visually appealing format.
 * 
 * @returns {JSX.Element} The JSX element representing the component.
 */
function HandleAPIResponse() {
    return (
        <div className="api-response-wrapper">
            <div className="question" style={{
                width: "90%",
                marginLeft: "5%",
                borderRadius: "10px",
                marginTop: "2%",
                minHeight: "10vh",
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(34,38,66,0.4)",
                color: "black",
            }}>
                Question Goes Here.
            </div>
            <div className="response" style={{
                minHeight: "60vh",
                width: "90%",
                marginLeft: "5%",
                borderRadius: "10px",
                marginTop: "2%",
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(34,38,66,0.4)",
                color: "black",
            }}>
                Answer to the asked Question.
            </div>
        </div>
        
    )
};

export default HandleAPIResponse;