import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import './App.css';

/**
 * Functional component for displaying cards.
 * @param {Object} props - Props containing card details.
 * @param {string} props.syllabus - Syllabus of the card.
 * @param {string} props.subject - Subject of the card.
 * @param {string} props.topic - Topic of the card.
 * @param {string} props.standard - Standard of the card.
 * @param {string} props.duration - Duration of the card.
 * @param {string} props.level - Level of the card.
 * @param {string} props.summary - Summary of the card.
 * @param {boolean} props.breadth - Flag indicating whether to show expanded view or not.
 * @returns {JSX.Element} - Card component.
 */
function Recommended_card({syllabus, subject, topic, standard, duration, level, summary, entryvalue}) {
    const [expanded, setexpanded] = useState(false);
    const navigation=useNavigate();
    /**
     * Function to handle card expansion
     */
    const handleExpand = () => {
        setexpanded(!expanded);
    }

    return (
        <div className="card1">
            <h1 className='card-title'>Topic: {topic}</h1>
            <p>Syllabus: {syllabus}</p>
            <p>Subject: {subject}</p>
            <p>Class: {standard}</p>
            <p>Duration: {duration}-minute</p>
            <p>Level: {level}</p>
            {/* Display summary on clicking the expand view button */}
            {expanded && <p style={{fontSize: '15px'}}>Summary: {summary}</p>}
            <div className="button-container">
                <Button onClick={handleExpand} className="expand-button">{expanded ? "Collapse view" : "Expand view"}</Button>
                <Button 
                    className="open-content-button" 
                    onClick={() => {
                        // Function to handle opening card values in the content page to review them
                        console.log(entryvalue);
                        let other_data = {
                          response: entryvalue.content,
                          prompt: entryvalue.prompt,
                          modifiedprompt: entryvalue.modifiedprompt,
                          summary: entryvalue.summary,
                        };
                        let to_send = {
                          response_data: other_data,
                          form_data: entryvalue.tags,
                        };
                        navigation("/output", { state: to_send });
                    }}
                >
                    Open Card
                </Button>
            </div>
        </div>
    );
}

export default Recommended_card;