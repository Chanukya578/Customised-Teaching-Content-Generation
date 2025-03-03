import React from "react";
import { MenuOutlined } from "@ant-design/icons";
import { useState } from "react";

/**
 * Renders an action button component.
 * 
 * This component represents an action button that toggles the visibility of a dropdown menu.
 * It listens for window resize events to handle the dropdown menu behavior based on screen width.
 * 
 */
function ActionButton(props) {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Event listener to handle window resize events
  window.addEventListener("resize", () => {
    const curr_screen_width = window.innerWidth;
    if (curr_screen_width > 1250) {
      const isOpen = document
        .querySelector(".drop_down_menu")
        .classList.contains("open");
      if (isOpen) {
        document.querySelector(".drop_down_menu").classList.remove("open");
      }
    } else {
      const isOpen = document
        .querySelector(".drop_down_menu")
        .classList.contains("open");
      if (isOpen) {
        document.querySelector(".drop_down_menu").classList.remove("open");
      }
    }
    setScreenWidth(window.innerWidth);
  });

  // Function to handle action button click
  function handleActionButtonClick() {
    if (screenWidth > 1250) {
      const isOpen = document
        .querySelector(".drop_down_menu")
        .classList.contains("open");
      if (isOpen) {
        document.querySelector(".drop_down_menu").classList.remove("open");
        console.log("Dropdown menu is closed");
      }
    } else {
      const isOpen = document
        .querySelector(".drop_down_menu")
        .classList.contains("open");
      if (isOpen) {
        document.querySelector(".drop_down_menu").classList.remove("open");
        console.log("Dropdown menu is closed");
      } else {
        document.querySelector(".drop_down_menu").classList.add("open");
        console.log("Dropdown menu is opened");
      }
    }
  }
  
  return (
    <div
      className="action_button"
      style={{
        minWidth: Math.min(screen.height * 0.1,100) + "px",
        textAlign: "center",
        minHeight: Math.min(screen.height * 0.1,100) + "px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="action_button_wrapper"
        onClick={handleActionButtonClick}
        style={{
          width: "40px",
          textAlign: "center",
          height: "35px",
          marginTop: "3%",
        }}
      >
        <MenuOutlined
          style={{
            fontSize: "30px",
            margin: "auto",
            alignSelf: "center",
            justifySelf: "center",
            cursor: "pointer",
            color: "white",
            fontWeight: "bold",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}
  
export default ActionButton;
