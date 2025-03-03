import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./App.css";
import form from "./form.png";
import button from './buttons.png'

function Homepage() {
  const handleFormOpener = () => {
    <NavLink to="/" className={({ isActive }) => `${isActive ? "active" : "not-active"}`}>
      Form
    </NavLink>
  }
  return (
    <div
      className="home-section"
      style={{
        paddingBottom: screen.height / 8,
      }}>
      <div className="aim-section">
        <u>
          <h1><b>Aim</b></h1>
        </u>
        <p>
          The aim of the project is to develop a comprehensive study content generation platform that facilitates educators in efficiently creating customized educational material tailored to specific curriculum requirements
        </p>
        <p>
          The users of our project are the <b>Teachers</b> of a School
        </p>
      </div>

      <div className="functionality-section">
        <u>
          <h1><b>Project Functionality Overview</b></h1>
        </u>
        <li>On clicking the forms button below (In the Instructions section), the teachers are redirected to the forms page</li>
        <li>Upon filling in the required fields and successfully submitting the form, teacher is redirected to the content page, where the content generated is displayed, as per the form submitted.</li>
      </div>

      <div className="instructions-section">
        <u>
          <h1><b>Instructions</b></h1>
        </u>
        <p>Teachers are kindly advised to follow the below instructions for getting the best content</p>
        <ul>
          <li>Teachers can navigate to the forms page by clicking the below button</li>
          <li>Fields in the form page are:</li>
          <ul>
            <li>Syllabus - The Educational Boards in India</li>
            <li>Subject - Subjects offered by the Educational board</li>
            <li>Topic - Topic the Teacher want to cover in the subject</li>
            <li>Class - Class or the standard of the students the teacher is explaining to</li>
            <li>Duration - Duration of the lecture</li>
            <li>
              Level - the complexity of the content that should be generated. The options are:
              <ul>
                <li>Easy</li>
                <li>Medium</li>
                <li>Complex</li>
              </ul>
            </li>
            <li>Add value - Intended to add Human values into the lecture, if possible.</li>
            <li>
              Upload pdf - Can upload <b>at most One pdf</b> with size less than or equal to 100KB
            </li>
            <li>Location, Region - Used for generating example</li>
          </ul>
          <li>
            <b>
              <u>Instructions for obtaining the best possible content</u>
            </b>
          </li>
          <ul>
            <li>Topic - Enter names of topic without any other information, in a comma-separated manner</li>
            <li>Add value - Add one word values</li>
            <li>Upload pdf - Better to contain exact keywords which describe how teachers want the explanation or subtopics needed</li>
          </ul>
        </ul>
        <li className="formlink">
          <NavLink to="/" className={({ isActive }) => `${isActive ? "active" : "not-active"}`}>
            Form page
          </NavLink>
        </li>
      </div>

      <div className="home_container">
        <li>
          <b>
            <u>An Example Form</u>
          </b>
        </li>
        <img src={form} alt="example form" />
      </div>

      <div className="content-page">
        <h1>
          <b>
            Content Page
          </b>
        </h1>
        <p>
          On submitting the Form in the form page, user is redirected to the content page, where the content is generated according to the entered form.
        </p>
        <ul>Prompt for the form is printed with the user given values; at the top of the page.</ul>
        <ul>Below the prompt, all the tags are displayed</ul>
        <ul>The tags are followed by the generated content</ul>
        <ul>Right side of the page is the summary of the generated content.</ul>
        Bottom of the page is options given to the user:
        <ul><b>EDIT button</b> - In the content page, user can edit the generated content.</ul>
        <ul><b>DOWNLOAD button</b> - In the content page, user can Download the generated content as a PDF or a DOCX</ul>
        <ul><b>SAVE button</b> - Once the user is done with editing, he can SAVE the generated content in the history page by clicking the SAVE button.</ul>
        Before leaving the content page, if the user does not save the generated content, an alert message is given to save it. 
        However, the user can skip that and the generated content will not be appended to the History page.
        Once the SAVE button is clicked, user will be redirected to the History page.
        <img src={button} alt = "buttons display"/>
      </div>

      <div className="history-page">
        <h1 className="page-title">
          <b>History Page</b>
        </h1>
        
        <div className="card">
          <p className="card-description">
            All the previously generated contents are displayed in the form of cards, with the fields syllabus, subject, topics, etc., as tags on the History page.
          </p>
          <ul className="card-buttons">
          <u>There are three buttons for each card:</u>
          <br></br>
            <li><button className="expand-button">Expand View</button> - Display a summary of the content in the card.</li>
            <li><button className="collapse-button">Collapse View</button> - Condense the card by removing the summary.</li>
            <li><button className="open-button">Open card</button> - Navigate to the Content page to view the entire content of the card.</li>
          </ul>
          <p>The History page also recommends cards related to the recently filled form.</p>
        </div>

        <br></br>
        <b>Pagination</b> - The cards are paginated. User has the privilege to choose one of the options: 5,10,15,20,50 or 100 cards per page.
        
        <div className="search-section">
          <h2 className="search-title"><u><b>Search Functionality:</b></u></h2>
          <p>The History page offers two types of searches: Common Search and Advanced Search. Enter the desired fields and click the "Search" button for results.</p>
          <ul className="search-types">
            <li><strong>Common Search:</strong> Search for an element across all the tags present in each card.</li>
            <li><strong>Advanced Search:</strong> Customize your search by selecting specific fields and entering corresponding inputs.
            <li>
              On clicking the Advanced Search button, the Common search field will be disabled. To again access the 
              Common search field but loose the entered fields in Advanced Search, refresh the page.</li>
            </li>
          </ul>
        </div>

        <div className="access-section">
          <h2 className="access-title"><u><b>Accessing History Page:</b></u></h2>
          <p>There are two ways to access the History page:</p>
          <ul className="access-methods">
            <li><strong>Through Content Page:</strong><br></br>On submitting a form and clicking on the SAVE button in the content page, the content generated is saved into the History page.
              The page also recommends cards according to the filled form.</li>
            <li><strong>Through Form / Home Page:</strong><br></br> On navigating to the History page from the Form page or the Home page, the recommending cards are the cards that contain most popular fields in it.
                  A field is said to be popular, if it is present in most of the cards.</li>
          </ul>
        </div>

      </div>


      <div className="features-section">
        <u>
          <h1>
            <b>Features
            </b>
          </h1>
        </u>
        <li>
          <u>
            <b>Customization Features</b>
          </u>
          <ul><b>Refresh</b> - On reloading or refreshing the page, the progress will be saved.</ul>
          <ul><b>Search Functionality</b> - For the fields Syllabus and Subjects, recommendations can be seen as we type in the field.</ul>
          <ul>The Subjects list changes according to the select Syllabus or the Board.</ul>
          <ul>Summary of the entire content generated is printed in the content page, at the right side.</ul>
          <ul><b>Upload PDF</b> - In the content page, we can upload a PDF and it reads the content in the pdf too.</ul>
          <ul><b>Edit</b> - Edit the content generated</ul>
          <ul><b>Download</b> - Download the generated content as a PDF or DOCX</ul>
          <ul><b>Common Search</b> - Search for an element across all the tags present in each card.</ul>
          <ul><b>Advanced Search</b> - Customize the search by selecting specific fields and entering corresponding inputs.</ul>
          <ul><b>Recommended algorithm</b> - Our website automatically recommends the best 3 cards according to the filled in form by the user.</ul>
          <ul><b>Pagination</b> - The cards are paginated. User has the privilege to choose one of the options: 5,10,15,20,50 or 100 cards per page.</ul>
        </li>
      </div>
      
    </div>
  );
}

export default Homepage;
