import React from "react";
import { NavLink } from "react-router-dom";

/**
 * Closes the dropdown menu by removing the 'open' class from the dropdown menu element.
 */
function closeDropDown(event) {
  handlle_link(event);
  const isOpen = document.querySelector(".drop_down_menu").classList.contains("open");
  if (isOpen) {
    document.querySelector(".drop_down_menu").classList.remove("open");
  }
}

/**
 * Handles the link click event to prompt the user if they want to leave the page without saving changes.
 * If the user chooses to stay, prevents the default action. Otherwise, clears the local storage.
 * @param {Event} event - The click event object.
 */
const handlle_link = (event) => {
  if (location.pathname === "/output") {
    // Used in raising an alert when attempting to leave the content page after content is generated without saving the changes.
    const confirmResult = window.confirm("Your Changes may not be saved. Are you sure you want to leave?");
    if (!confirmResult) {
      event.preventDefault();
    } else {
      localStorage.clear();
    }
  }
};

/**
 * Renders a dropdown menu component.
 *
 * This component represents a dropdown menu containing navigation links.
 * It provides links to various pages such as Home, Form, Content, and History.
 * The links close the dropdown menu when clicked.
 *
 * @returns {JSX.Element} The JSX element representing the dropdown menu.
 */
function DropDownMenu(props) {
  return (
    <div className="drop_down_menu">
      <ul className="links">
        <li>
          <NavLink to="/home" className={({ isActive }) => `${isActive ? "active" : "not-active"}`} onClick={closeDropDown}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/" className={({ isActive }) => `${isActive ? "active" : "not-active"}`} onClick={closeDropDown}>
            Form
          </NavLink>
        </li>
        <li>
          <NavLink to="/output" className={({ isActive }) => `${isActive ? "active" : "not-active"}`} onClick={closeDropDown}>
            Content
          </NavLink>
        </li>
        <li>
          <NavLink to="/history" className={({ isActive }) => `${isActive ? "active" : "not-active"}`} onClick={closeDropDown}>
            History
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default DropDownMenu;
