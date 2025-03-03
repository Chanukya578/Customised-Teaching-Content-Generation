import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { notification } from "antd";
import UserOptions1 from "../UserOptions";
import Tags from "../Tags";
import LoadingIcon from "../LoadingIcon";
import "./App.css";

/**
 * Component for displaying the output page.
 * @returns {JSX.Element} Output page component.
*/
function Output_Page() {
  const location = useLocation();
  const navigate = useNavigate();
  const [input_recieved, setInput_recieved] = useState(location.state);
  const const_input = useState(location.state);

  // Check if input is received, otherwise redirect to home page
  useEffect(() => {
    if (!input_recieved) {
      navigate("/");
      notification.warning({
        message: "Input not received",
        description: "Please go back to the input page to provide input.",
      });
    }
  }, []);

  /**
   * Concatenating the modified_prompt received from the backend flask server
   * and making the user input values in the prompt bold.
   * @param {string[]} strings - Array of strings to concatenate.
   * @returns {JSX.Element} Concatenated string component.
  */
  const ConcatenatedString = ({ strings }) => {
    const concatenatedString = strings.map((str, index) => {
      if ([1, 3, 5, 7, 9, 12, 14, 16, 18].includes(index)) {
        return <strong key={index}>{str}</strong>;
      } else {
        return str + " ";
      }
    });
    return <div>{concatenatedString}</div>;
  };

  /**
   * Retrieves data from local storage and updates the component state if available.
   * Converts the response data array into a formatted string array with newline characters.
   * Updates the input_received state with the retrieved response, prompt, summary, and modified prompt data.
  */
  useEffect(() => {
    // Retrieve response data from local storage
    const responseData = localStorage.getItem("responseData");
    if (!responseData) {
      return;
    }

    // convert it back to an array
    const responseDataArray = JSON.parse(responseData);

    // Add newline character between each index in the array
    const responseDataArray2 = responseDataArray.map((item) => item + "\n");

    // Retrieve prompt and summary from local storage
    const prompt = localStorage.getItem("prompt");
    const summary = localStorage.getItem("summary");
    
    // Parse the summary and remove the beginning and ending quotes
    const summary2 = JSON.parse(summary);
    const summary3=summary2.substring(0,summary2.length-1);

    // Retrieve modified prompt from local storage
    const modifiedprompt = JSON.parse(localStorage.getItem("modifiedprompt"));

    // Update input_received state with retrieved data
    if (responseData) {
      setInput_recieved({
        response_data: {
          response: responseDataArray2,
          prompt: prompt,
          summary: summary3,
          modifiedprompt: modifiedprompt,
        },
        form_data: input_recieved.form_data,
      });
    }
  }, []);

  return (
    <>
      {/* Displaying output only if input received */}
      {input_recieved ? (
        <div className="output-page-wrapper" style={{
          width: "100%",
          position: "fixed",
          left: "0",
          top: Math.min(screen.height * 0.1,100) + "px",
          bottom: "35px",
          flexDirection: "column",
          display: "flex",
          overflowY: "auto",
          height: "100%",
        }}>
          {/* Wrapper for displaying summary in the top for mobile version */}
          <div className="top-summary-wrapper" style={{
            marginTop: "2%",
            color: "black",
            borderRadius: "10px",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(34,38,66,0.1)",
            flexDirection: "column",
            height: "100%",
            marginLeft: "3%",
            width: "94%",
            marginBottom: "2%",
            boxShadow: "10px 5px 10px 5px rgba(0,0,0,0.2)",
          }}>
            {/* Displaying summary title */}
            <div className="summary-title" style={{
              fontSize: "35px",
              marginTop: "20px",
            }}>
              Summary
            </div>
            <div className="summary-content" style={{
                textAlign: "left",
                padding: "30px",
                height: "100%",
            }}>
              {/* Displaying the Summary content received from backend */}
              {input_recieved.response_data.summary}
            </div>
          </div>

          {/* Displays the modified prompt, tags and generated content */}
          <div className="main-page-content-wrapper" style={{
              width: "100%",
              height: "100%",
              left: "0",
              display: "flex",
          }}>
            <div style={{
                width: "100%",
                height: "100%",
                left: "0",
                flexDirection: "column",
                display: "flex",
            }}>
              <div className="api-response-wrapper">
                <div className="question" style={{
                    width: "94%",
                    marginLeft: "3%",
                    borderRadius: "10px",
                    marginTop: "2%",
                    minHeight: "10vh",
                    textAlign: "left",
                    alignItems: "center",
                    display: "flex",
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(34,38,66,0.1)",
                    color: "black",
                    overflowY: "auto",
                    padding: "30px",
                    boxShadow: "10px 5px 10px 5px rgba(0,0,0,0.2)",
                }}>
                  {/* Displays the modified prompt if it is present in input_received and printing the prompt if it is absent. */}
                  {input_recieved.response_data.modifiedprompt && input_recieved.response_data.modifiedprompt.length > 0 ? (
                    <div>
                      <ConcatenatedString strings={input_recieved.response_data.modifiedprompt} />
                    </div>
                  ) : (
                    input_recieved.response_data.prompt
                  )}
                </div>

                {/* Displays the tags received from input page */}
                <Tags elements={input_recieved.form_data} />
                <div className="response" style={{
                    minHeight: "60vh",
                    width: "94%",
                    marginLeft: "3%",
                    borderRadius: "10px",
                    marginTop: "1%",
                    textAlign: "left",
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(34,38,66,0.1)",
                    color: "black",
                    overflowY: "auto",
                    padding: "30px",
                    marginBottom: "1%",
                    boxShadow: "10px 5px 10px 5px rgba(0,0,0,0.2)",
                }}>
                  <div className="response-content" 
                    contentEditable="false" 
                    style={{ whiteSpace: "pre-wrap" }}
                    /**
                     * Updates local storage with the modified response data, prompt, summary, and modified prompt.
                     * Updates the component state with the modified response data.
                     * 
                     * @param {Object} e - The input event object.
                    */
                    onInput={(e) => {
                      const responseData = e.target.innerText
                        .split("\n")
                        .filter((item) => item.trim() !== "");
                      localStorage.setItem(
                        "responseData",
                        JSON.stringify(responseData)
                      );
                      localStorage.setItem(
                        "prompt",
                        JSON.stringify(input_recieved.response_data.prompt)
                      );
                      localStorage.setItem(
                        "summary",
                        JSON.stringify(input_recieved.response_data.summary)
                      );
                      localStorage.setItem(
                        "modifiedprompt",
                        JSON.stringify(
                          input_recieved.response_data.modifiedprompt
                        )
                      );
                      setInput_recieved({
                        response_data: {
                          response: e.target.innerText,
                          prompt: const_input.response_data.prompt,
                          summary: const_input.response_data.summary,
                          modifiedprompt:
                            const_input.response_data.modifiedprompt,
                        },
                      });
                    }}
                  >
                    {input_recieved.response_data.response.map((key, value) => {
                      {
                        return key;
                      }
                    })}
                  </div>
                </div>

                {/* Displays the user options edit, download, save */}
                <UserOptions1 
                  elements={input_recieved.form_data} 
                  prompt_data_recieved={input_recieved.response_data.prompt} 
                  summary={input_recieved.response_data.summary} 
                  modifiedprompt={input_recieved.response_data.modifiedprompt}
                />
              </div>
            </div>

            {/* Wrapper for displaying summary on the side of tags and content in the desktop version */}
            <div className="summary-wrapper" style={{
                color: "black",
                borderRadius: "10px",
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(34,38,66,0.1)",
                marginTop: "2%",
                marginRight: "2%",
                flexDirection: "column",
                minHeight: "60vh",
                width: "25%",
                marginTop: "2%",
                overflowY: "auto",
                marginBottom: "5%",
                boxShadow: "10px 5px 10px 5px rgba(0,0,0,0.2)",
            }}>
              <div className="summary-title" style={{
                  fontSize: "50px",
                  marginTop: "30px",
              }}>
                Summary
              </div>
              <div className="summary-content" style={{
                  textAlign: "left",
                  padding: "30px",
              }}>
                {/* Displaying the summary obtained from the backend */}
                {input_recieved.response_data.summary}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Displaying loading icon if input is not received.
        <div
          style={{
            color: "black",
            fontSize: "50px",
          }}
        >
          <LoadingIcon />
        </div>
      )}
    </>
  );
}

export default Output_Page;
