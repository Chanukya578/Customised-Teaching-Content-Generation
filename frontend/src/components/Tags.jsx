import React from "react";

/**
 * Renders a list of tags based on the provided elements.
 * 
 * This component takes a JSON object containing key-value pairs 
 * and renders each key-value pair as a tag.
 * 
 * Used in printing the tags of user input elements in content page 
 * 
 * @param {object} props - The props passed to the component.
 * @param {object} props.elements - The JSON object containing key-value pairs for the tags.
 * @returns {JSX.Element} The JSX element representing the list of tags.
 */
function Tags(props) {
  // Convert JSON object to an array of key-value pairs
  const elementsArray = Object.entries(props.elements);

  return (
    <div className="tags">
      {elementsArray.map(([key, value], index) => (
        <span key={index} className="tag">
          {`${key}: ${value}`}
        </span>
      ))}
    </div>
  );
}

export default Tags;
