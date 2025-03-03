import React, { useState } from "react";
import { notification, Button, Modal } from "antd";
import jsPDF from "jspdf";
import axios from "axios";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun, PageBreak } from "docx";
import { useNavigate } from "react-router-dom";

/**
 * Renders user options for editing, saving, and downloading content in the content page of the website.
 *
 * This component provides buttons for editing, saving, and downloading content.
 * It also includes a modal for selecting the file format to download in either pdf or docx.
 *
 * @param {object} props - The props passed to the component.
 * @param {object} props.prompt_data_recieved - The data received as the prompt.
 * @param {object} props.elements - The elements associated with the content.
 * @param {string} props.summary - The summary of the content.
 * @returns {JSX.Element} The JSX element representing the user options.
 */
const UserOptions1 = (props) => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigate();

  /**
   * This function is the on-click handler of the save button and saves the content to the MongoDB.
   */
  const handleSaveClick = async () => {
    localStorage.clear()
    const { prompt_data_recieved, elements, summary, modifiedprompt } = props;
    const editableDivs = document.querySelectorAll(".response-content");
    var arr_of_content = [];
    editableDivs.forEach(function (div) {
      div.contentEditable = false;
      arr_of_content.push(div.innerText);
    });
    const response = await axios.post("/output_generated/add_entry", {
      prompt: prompt_data_recieved,
      content: arr_of_content,
      tags: elements,
      summary: summary,
      modifiedprompt: modifiedprompt,
    });
    notification.success({
      message: "Data saved successfully!",
    });
    const tags = props.elements;
    navigation("/history", { state: tags });
  };

  /**
   * Handles the click event for downloading the content in PDF format.
   * This function generates a PDF file containing the content, tags, and summary provided as props.
   * The file is saved with a filename containing the current date and time.
   *
   * @param {Event} e - The event object
   */
  const downloadPDF = (e) => {
    // Extracting content elements
    const elementsArray = document.querySelectorAll(".response-content");

    // Getting current date and time for filename
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString();
    const timeString = currentDate.toLocaleTimeString();
    const summary_content = props.summary;
    const fileName = `class_content_${dateString}_${timeString}.pdf`;

    // Initializing jsPDF
    const pdf = new jsPDF();

    // Setting initial height for content
    let introHeight = 10;

    // Adding "Class Content" heading
    const tags = props.elements;
    pdf.setFontSize(20);
    pdf.text("Class Content", 10, introHeight);
    introHeight += 10;

    // Adding "Tags" section
    pdf.setFontSize(10);
    pdf.text("Tags: ", 10, introHeight);
    introHeight += 10;
    pdf.setFontSize(8);

    // Adding tags content
    const list_tags = Object.entries(tags);
    list_tags.forEach((tag, index) => {
      const value = tag[0] + ": " + tag[1];
      const lines = pdf.splitTextToSize(value, 180);
      lines.forEach((line, lineNumber) => {
        if (introHeight + 10 > pdf.internal.pageSize.getHeight()) {
          pdf.addPage();
          introHeight = 10;
        }
        pdf.text(line, 10, introHeight);
        introHeight += 10;
      });
    });

    // Adding "Summary" section
    introHeight += 10;
    pdf.setFontSize(12);
    pdf.text("Summary: ", 10, introHeight);
    pdf.setFontSize(10);
    introHeight += 10;

    // Adding summary content
    const sumary_lines = pdf.splitTextToSize(summary_content, 180);
    sumary_lines.forEach((line, lineNumber) => {
      if (introHeight + 10 > pdf.internal.pageSize.getHeight()) {
        pdf.addPage();
        introHeight = 10;
      }
      pdf.text(line, 10, introHeight);
      introHeight += 10;
    });

    // Adding "Content" section
    introHeight += 10;
    pdf.setFontSize(12);
    pdf.text("Content: ", 10, introHeight);
    introHeight += 10;
    pdf.setFontSize(10);

    // Adding content elements
    elementsArray.forEach((element, index) => {
      const value = element.innerText;
      const lines = pdf.splitTextToSize(value, 180);
      lines.forEach((line, lineNumber) => {
        if (introHeight + 10 > pdf.internal.pageSize.getHeight()) {
          pdf.addPage();
          introHeight = 10;
        }
        pdf.text(line, 10, introHeight);
        introHeight += 10;
      });
    });

    // Saving the PDF file and Hiding the modal.
    pdf.save(fileName);
    setVisible(false);
  };

  /**
   * Shows the modal for selecting the file format to download.
   */
  const showModal = () => {
    setVisible(true);
  };

  /**
   * Handles the on-click event for cancelling the modal.
   */
  const handleCancel = () => {
    setVisible(false);
  };

  /**
   * Handles the on-click event for enabling content editing.
   */
  function handleEditClick() {
    const editableDivs = document.querySelectorAll(".response-content");
    editableDivs.forEach(function (div) {
      div.contentEditable = true;
    });
  }

  /**
   * Downloads the content in docx format.
   */
  const downloadDOCX = () => {
    // Extracting tags and content elements
    const tags_arr = Object.entries(props.elements);
    const elementsArray = Object.entries(document.querySelectorAll(".response-content"));

    // Generating filename with current date and time
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString();
    const timeString = currentDate.toLocaleTimeString();
    const fileName = `class_content_${dateString}_${timeString}.docx`;

    // Creating a new DOCX document
    const doc = new Document({
      sections: [
        {
          children: [
            // Adding "Class Content" heading
            new Paragraph({
              text: "Class Content",
            }),
            // Adding tags
            new Paragraph({
              text: "Tags: ",
            }),
            // Adding tags content
            ...tags_arr.map(
              ([key, value]) =>
                new Paragraph({
                  children: [new TextRun({ text: `${key}: ${value}` })],
                })
            ),
            new Paragraph({
              text: "",
            }),
            // Adding summary heading
            new Paragraph({
              text: "Summary: ",
            }),
            // Adding summary content
            new Paragraph({
              children: [new TextRun({ text: props.summary })],
            }),
            new Paragraph({
              text: "",
            }),
            // Adding content heading
            new Paragraph({
              text: "Content: ",
            }),
            // Adding content elements
            ...elementsArray[0][1].innerText.split("\n").map((element) => {
              return new Paragraph({
                children: [new TextRun({ text: element + "\n" })],
              });
            }),
          ],
        },
      ],
    });

    // Converting the document to blob and saving as DOCX file and Hiding the modal.
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, fileName);
    });
    setVisible(false);
  };

  return (
    <div
      className="userOptions"
      style={{
        color: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "120px",
        marginTop: "50px",
        paddingBottom: "50px",
      }}
    >
      <Button
        onClick={handleEditClick}
        style={{
          backgroundColor: "lightBlue",
        }}
      >
        EDIT
      </Button>
      <Button
        onClick={showModal}
        style={{
          backgroundColor: "lightBlue",
          margin: "0 20px",
        }}
      >
        DOWNLOAD
      </Button>
      <Button
        onClick={handleSaveClick}
        style={{
          backgroundColor: "lightBlue",
        }}
      >
        SAVE
      </Button>

      <Modal title="SELECT FILE FORMAT TO DOWNLOAD" visible={visible} onCancel={handleCancel} footer={null}>
        <Button
          onClick={downloadPDF}
          style={{
            backgroundColor: "lightBlue",
            margin: "0 20px",
          }}
        >
          DownLoadPDF
        </Button>
        <Button
          onClick={downloadDOCX}
          style={{
            backgroundColor: "lightBlue",
            margin: "0 20px",
          }}
        >
          DownLoadDOCX
        </Button>
      </Modal>
    </div>
  );
};

export default UserOptions1;
