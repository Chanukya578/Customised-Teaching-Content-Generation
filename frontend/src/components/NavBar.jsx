import React from "react";
import { NavLink, useLocation } from "react-router-dom";

/**
 * Renders the navigation bar of the application.
 * 
 * This component represents the navigation bar of the website.
 * It contains navigation links to different pages of the website.
 * 
 * @param {object} props - The props passed to the component.
 * @param {number} props.height - The height of the navigation bar.
 * @returns {JSX.Element} The JSX element representing the navigation bar.
 */
function NavBar(props) {
  const current_location = useLocation();

  /**
   * Handles the link click event to prompt the user if they want to leave the page without saving changes.
   * If the user chooses to stay, prevents the default action. Otherwise, clears the local storage.
   * @param {Event} event - The click event object.
  */
  const handlle_link = (event) => {
    if (location.pathname === "/output") {
      // Used in raising an alert when attempting to leave the content page after content is generated without saving the changes.
      const confirmResult = window.confirm(
        "Your Changes may not be saved. Are you sure you want to leave?"
      );
      if (!confirmResult) {
        event.preventDefault(); 
      } else {
        localStorage.clear();
      }
    }
  };
  return (
    <div
      className="nav_bar"
      style={{
        width: "100%",
        height: props.height * 1.25,
        padding: "0px 0px 0px 20px",
      }}
    >
      <ul className="links">
        <li>
          <NavLink to="/home" onClick={handlle_link} className={({ isActive }) => `${isActive ? "active" : "not-active"}`}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/" onClick={handlle_link} className={({ isActive }) => `${isActive ? "active" : "not-active"}`}>
            Form
          </NavLink>
        </li>
        <li>
          <NavLink to="/output" onClick={handlle_link} className={({ isActive }) => `${isActive ? "active" : "not-active"}`}>
            Content
          </NavLink>
        </li>
        <li>
          <NavLink to="/history" onClick={handlle_link} className={({ isActive }) => `${isActive ? "active" : "not-active"}`}>
            History
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;
