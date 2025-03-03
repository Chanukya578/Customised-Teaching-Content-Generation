import React, { useEffect, useState } from 'react';
import { Col, Row, Pagination, Input, Button, TreeSelect } from 'antd';
import { useLocation } from "react-router-dom";
import { MinusCircleOutlined } from '@ant-design/icons';
import { NavLink } from "react-router-dom";
import axios from 'axios';
import Cards from './cards';
import Recommended_card from './recommended_cards';
import './App.css';

const { TreeNode } = TreeSelect;

/**
 * Data for the fields used in advanced search.
 */
const fieldData = [
  { title: 'syllabus', value: 'syllabus' },
  { title: 'subject', value: 'subject' },
  { title: 'topic', value: 'topic' },
  { title: 'Class', value: 'Class' },
  { title: 'duration', value: 'duration' },
  { title: 'level', value: 'level' },
]

/**
 * Component for rendering the history page containing recommendation algorithm
 * for displaying top 3 recommended searches or top 3 rated searches and the search functionality
 * @returns {JSX.Element} - The JSX Element representing the history page. 
 */
function History_page() {
  // State variables
  const [fields, setFields] = useState([]);                                 // used in Advance search.
  const [advancedSearchClicked, setAdvancedSearchClicked] = useState(false);
  const [searchWord, setSearchWord] = useState('');
  const location = useLocation();
  const [input_recieved, setInput_recieved] = useState(location.state);     // This variable contains the fields the user has entered, if the History page is accessed by content page. 
  const [currentPage, setCurrentPage] = useState(1);                        // used in pagination
  const [pageSize, setPageSize] = useState(15);                             // Used in pagination
  const [dataArray, setDataArray] = useState([]);                           // Contains the information of the cards that are to be displayed.
  const [entriesArray, setentriesArray] = useState([]);
  const [recommendedCards, setRecommendedCards] = useState([])              // for storing the top 3 cards after algo is implemented
  let scores = [];                                                          // stores the scores of all the cards, when the recommendation algorithm is used.
  const cardHeight = Math.min(screen.height * 0.1,100);

  useEffect(() => { 
    /**
     * Fetches all the entries of MongoDb from backend
     */
    const fetchData = async () => { 
      try {
        const response = await axios.post("/output_generated/get_entries", {
          "okq": "get_entries"
        });
        setDataArray(response.data.entries);
        setentriesArray(response.data.entries);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  /**
   * Function to count occurences in the recommendation algorithm
   */
  function countOccurrences(value, countObject) {
    if (countObject[value]) {
      countObject[value] += 1;
    } else {
      countObject[value] = 1;
    }
  }

  useEffect(() => { 
    /**
     * Function to recommend cards based on input received or popular fields 
    */
    const cards_recommending_function = async () => {
      const arr_of_entries = entriesArray;
      {/*
      Recommendation algorithm starts here.
      Explanation: 
      There are two ways to access the History page, through content page and through Form page or Home page
      (i) Through content page, the input_recieved variable consists of the tags entered by user. 
      the algorithm matches these tags with the tags of the cards that are available. Scores will be given
      accordingly. The best three cards with highest scores will be displayed
      (ii) Through Form / History page. There is no input_received in this case, the algorithm now 
      computes the top 3 cards with most number of popular fields. A field is said to be popular, if it is present in most of the cards. 
    */ }
      if (input_recieved) { 
        /**
         * When the History page is accessed through the Content page
         */
        for (var i = 0; i < arr_of_entries.length; i++) {
          let curr_score = 0;
          const curr_entry = arr_of_entries[i];
          const curr_entry_tags = curr_entry["tags"];
          const Science_subjects = ["Physics", "Chemistry", "Biology", "Mathematics", "Science"];
          const Social_Science_subjects = ["History", "Geography", "Political Science", "Economics", "Social Science"];

          // Calculates scores based on matching tags
          if (curr_entry_tags["subject"] === input_recieved["subject"]) {
            curr_score += 10;
          }
          if (curr_entry_tags["subject"] != input_recieved["subject"]) {
            if (Science_subjects.includes(curr_entry_tags["subject"]) && Science_subjects.includes(input_recieved["subject"])) {
              curr_score += 9;
            }
            if (Social_Science_subjects.includes(curr_entry_tags["subject"]) && Social_Science_subjects.includes(input_recieved["subject"])) {
              curr_score += 9;
            }
          }
          if (curr_entry_tags["Class"] === input_recieved["Class"]) {
            curr_score += 8;
          }
          if (curr_entry_tags["topic"] === input_recieved["topic"]) {
            curr_score += 6;
          }
          if (curr_entry_tags["state"] == input_recieved["state"]) {
            curr_score += 5;
          }
          if (curr_entry_tags["location"] == input_recieved["location"]) {
            curr_score += 5;
          }
          if (curr_entry_tags["syllabus"] == input_recieved["syllabus"]) {
            curr_score += 5;
          }

          // Calculate scores based on additional values
          var tot_val = 0;
          if (curr_entry_tags["AddedValues"]) {
            for (var j = 0; j < curr_entry_tags["AddedValues"]; j++) {
              if (input_recieved["AddedValues"].includes(curr_entry_tags["AddedValues"][i])) {
                tot_val += 1;
              }
            }
            tot_val = tot_val / curr_entry_tags["AddedValues"].length;
            tot_val *= 3;
          }
          curr_score += tot_val;

          // Exclude cards with score as 42 or 39 from being displayed
          /**
           * Exclude cards with score as 42 or 39 from being displayed
           * 42 or 39 score implies the score of the current card we are checking with. 
          */ 
          if (curr_entry["AddedValues"]) {
            if (curr_score == 42) {
              curr_score = 0
            }
          } else {
            if (curr_score == 39) { 
              curr_score = 0
            }
          }
          scores.push(curr_score);
        }

        // Identifying the top three scored cards.
        let indices = topThreeScoredCards(scores)
        for (let i = 0; i < 3; i++) {
          recommendedCards.push(arr_of_entries[indices[i]])
        }
      }
      else {
        /**
         * History page accessed through either form page or home page
         * Count occurences of different fields for recommendation
         */
        let count_of_class = {}
        let count_of_subject = {};
        let count_of_topic = {};
        let count_of_state = {};
        let count_of_location = {};
        let count_of_syllabus = {};
        let count_of_addedvalues = {};
        for (var i = 0; i < arr_of_entries.length; i++) {
          const curr_entry = arr_of_entries[i];

          // Count Occurences of different fields.
          countOccurrences(curr_entry["tags"]["Class"],count_of_class);
          countOccurrences(curr_entry["tags"]["subject"],count_of_subject);
          countOccurrences(curr_entry["tags"]["topic"],count_of_topic);
          countOccurrences(curr_entry["tags"]["state"],count_of_state);
          countOccurrences(curr_entry["tags"]["location"],count_of_location);
          countOccurrences(curr_entry["tags"]["syllabus"],count_of_syllabus);

          if (curr_entry["tags"]["AddedValues"]) {
            for (var j = 0; j < curr_entry["tags"]["AddedValues"].length; j++) {
              countOccurrences(curr_entry["tags"]["AddedValues"][j],count_of_addedvalues);
            }
          }
        }

        // For storing all the popular tags
        let popular_class = []
        let popular_subject = []
        let popular_topic = []
        let popular_state = []
        let popular_location = []
        let popular_syllabus = []
        let popular_addedvalues = []
        let max_class = 0

        for (const [key, value] of Object.entries(count_of_class)) {
          if (value > max_class) {
            max_class = value
          }
        }
        for (const [key, value] of Object.entries(count_of_class)) {
          if (value == max_class) {
            popular_class.push(key)
          }
        }

        // extracting popular tags for all the fields and storing them
        let max_subject = 0
        for (const [key, value] of Object.entries(count_of_subject)) {
          if (value > max_subject) {
            max_subject = value
          }
        }
        for (const [key, value] of Object.entries(count_of_subject)) {
          if (value == max_subject) {
            popular_subject.push(key)
          }
        }
        let max_topic = 0
        for (const [key, value] of Object.entries(count_of_topic)) {
          if (value > max_topic) {
            max_topic = value
          }
        }
        for (const [key, value] of Object.entries(count_of_topic)) {
          if (value == max_topic) {
            popular_topic.push(key)
          }
        }
        let max_state = 0
        for (const [key, value] of Object.entries(count_of_state)) {
          if (value > max_state) {
            max_state = value
          }
        }
        for (const [key, value] of Object.entries(count_of_state)) {
          if (value == max_state) {
            popular_state.push(key)
          }
        }
        let max_location = 0
        for (const [key, value] of Object.entries(count_of_location)) {
          if (value > max_location) {
            max_location = value
          }
        }
        for (const [key, value] of Object.entries(count_of_location)) {
          if (value == max_location) {
            popular_location.push(key)
          }
        }
        let max_syllabus = 0
        for (const [key, value] of Object.entries(count_of_syllabus)) {
          if (value > max_syllabus) {
            max_syllabus = value
          }
        }
        for (const [key, value] of Object.entries(count_of_syllabus)) {
          if (value == max_syllabus) {
            popular_syllabus.push(key)
          }
        }
        let max_addedvalues = 0
        for (const [key, value] of Object.entries(count_of_addedvalues)) {
          if (value > max_addedvalues) {
            max_addedvalues = value
          }
        }
        for (const [key, value] of Object.entries(count_of_addedvalues)) {
          if (value == max_addedvalues) {
            popular_addedvalues.push(key)
          }
        }

        for (var i = 0; i < arr_of_entries.length; i++) {
          let curr_score = 0;
          const curr_entry = arr_of_entries[i];
          const curr_entry_tags = curr_entry["tags"];
          const Science_subjects = ["Physics", "Chemistry", "Biology", "Mathematics", "Science"];
          const Social_Science_subjects = ["History", "Geography", "Political Science", "Economics", "Social Science"];
          if (popular_subject.includes(curr_entry_tags["subject"])) {
            curr_score += 10;
          }
          if (!popular_subject.includes(curr_entry_tags["subject"])) {
            if (Science_subjects.includes(curr_entry_tags["subject"]) && Science_subjects.includes(popular_subject[0])) {
              curr_score += 9;
            }
            if (Social_Science_subjects.includes(curr_entry_tags["subject"]) && Social_Science_subjects.includes(popular_subject[0])) {
              curr_score += 9;
            }
          }

          if (popular_class.includes(curr_entry_tags["Class"])) {
            curr_score += 8;
          }
          if (popular_topic.includes(curr_entry_tags["topic"])) {
            curr_score += 6;
          }
          if (popular_state.includes(curr_entry_tags["state"])) {
            curr_score += 5;
          }
          if (popular_location.includes(curr_entry_tags["location"])) {
            curr_score += 5;
          }
          if (popular_syllabus.includes(curr_entry_tags["syllabus"])) {
            curr_score += 5;
          }
          var tot_val = 0;
          if (curr_entry_tags["AddedValues"]) {
            for (var j = 0; j < curr_entry_tags["AddedValues"].length; j++) {
              if (popular_addedvalues.includes(curr_entry_tags["AddedValues"][i])) {
                tot_val += 1;
              }
            }
            tot_val = tot_val / curr_entry_tags["AddedValues"].length;
            tot_val *= 3;
          }
          curr_score += tot_val;
          scores.push(curr_score);
        }
        let indices = topThreeScoredCards(scores)
        var temp_rec = []
        for (let i = 0; i < 3; i++) {
          temp_rec.push(arr_of_entries[indices[i]])
        }
        setRecommendedCards(temp_rec)
      }
    }
    cards_recommending_function();
  }, [entriesArray, input_recieved]);

  /**
   * Handles page change for pagination.
   * @param {number} page - The new page number.
   * @param {number} pageSize - The new page size.
  */
  const handlePageChange = (page, pageSize) => { 
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  /**
   * Handles click event for advanced search.
  */
  const handleAdvSearchClick = () => {
    setAdvancedSearchClicked(true);
    setFields([...fields, { fieldName: '', fieldValue: '' }])
  };

  /**
   * Handles change event for search input.
   * @param {Object} e - The event object.
  */
  const handleChange = (e) => {
    setSearchWord(e.target.value);
  };

  /**
   * Handles click event for common and advanced search.
  */
  const handleSearchClick = async () => { 
    if (advancedSearchClicked) {
      const requestData = {};
      fields.forEach(field => {
        if (field.fieldName && field.fieldValue) {
          requestData[field.fieldName] = field.fieldValue;
        }
      });
      const response = await axios.post("/output_generated/advanced_search", requestData);
      setDataArray(response.data.entries);
    } else {
      const response = await axios.post("/output_generated/common_search", {
        search_word: searchWord
      });
      setDataArray(response.data.entries);
    }
  };

  /**
   * Adds a new field to the advanced search.
  */
  const addField = () => {
    setFields([...fields, { fieldName: '', fieldValue: '' }]);
  };
  /**
   * Removes a field from the advanced search.
   * @param {number} indexToRemove - The index of the field to remove.
  */
  const removeField = (indexToRemove) => { 
    setFields((prevFields) => prevFields.filter((_, index) => index !== indexToRemove));
  };

  /**
   * Handles change event for field name in the advanced search.
   * @param {number} index - The index of the field.
   * @param {string} value - The new value of the field name.
  */
  const handleChangeFieldName = (index, value) => { 
    const newFields = [...fields];
    newFields[index].fieldName = value;
    setFields(newFields);
  };

  /**
   * Handles change event for field value in the advanced search.
   * @param {number} index - The index of the field.
   * @param {string} value - The new value of the field value.
  */
  const handleChangeFieldValue = (index, value) => {// used in Advanced search
    const newFields = [...fields];
    newFields[index].fieldValue = value;
    setFields(newFields);
  };

  /**
   * Returns the indices of the top three highest scored cards.
   * @param {Array} scores - Array of card scores.
   * @returns {Array} Array of indices of the top three scored cards.
  */
  const topThreeScoredCards = (scores) => { // returns the first 3 highest scores encountered.
    const scoreObjects = scores.map((score, index) => ({ score, index }));
    const sortedScoreObjects = scoreObjects.sort((a, b) => b.score - a.score);
    const topThreeScoreObjects = sortedScoreObjects.slice(0, 3);
    const best_3 = []
    for (var i = 0; i < 3; i++)
      best_3.push(topThreeScoreObjects[i].index)
    return best_3;
  }

  // For pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const visibleData = [...dataArray].reverse().slice(startIndex, endIndex);

  return (
    <div className='body-container'>
      <div className='recommended-container' style={{marginTop: cardHeight}}>
        {/* For displaying the recommended cards */}
        <h2 className='recommend'>Recommended Searches</h2>
        <Row gutter={20}>
          {recommendedCards.map((entry, index) => (
            index < 3 && (
              <Col span={8} key={index}>
                <Recommended_card
                  syllabus={entry["tags"]["syllabus"]}
                  subject={entry["tags"]["subject"]}
                  topic={entry["tags"]["topic"]}
                  standard={entry["tags"]["Class"]}
                  duration={entry["tags"]["duration"]}
                  level={entry["tags"]["level"]}
                  summary={entry["summary"]}
                  entryvalue={entry}
                />
              </Col>
            )))};
        </Row>
      </div>
      {/* For displaying and handling the search funtcionality of the website */}
      <div className='search-container'>
        <Input
          type="text"
          placeholder="Enter your search word..."
          style={{ width: '25%', padding: '10px', marginRight: '3%' }}
          onChange={handleChange}
          disabled={advancedSearchClicked}
        />
        <Button className="search-button" onClick={handleSearchClick}>Search</Button>
        <Button
          className="advanced-search-button"
          onClick={handleAdvSearchClick}
        >
          Advanced Search
        </Button>
        {/* For displaying various fields of the advanced search */}
        {fields.map((field, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <TreeSelect
              placeholder="Select the field name"
              style={{ marginRight: '10px', width: '15%', marginLeft: '28.3%', textAlign: "left" }}
              value={field.fieldName}
              onChange={(value) => handleChangeFieldName(index, value)}
            >
              {fieldData.map(node => (
                <TreeNode value={node.value} title={node.title} key={node.value} />
              ))}
            </TreeSelect>
            <Input
              placeholder="Enter the field value"
              value={field.fieldValue}
              style={{ marginRight: '10px', width: '15%' }}
              onChange={(e) => handleChangeFieldValue(index, e.target.value)}
            />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {index === fields.length - 1 && (
                <Button onClick={addField} style={{ marginRight: '10px' }}>
                  + Add field
                </Button>
              )}
              {index !== fields.length - 1 && (
                <MinusCircleOutlined
                  className="dynamic-delete-button"
                  onClick={() => removeField(index)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      {/* For displaying entries of the database filtered by search in the form of cards in pagination. */}
      <div className='cards-container'>
        <Pagination className='pagination'
          total={dataArray.length}
          showQuickJumper
          showTotal={(total, range) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {`${range[0]}-${range[1]} of ${total} items`}
            </div>
          )}
          showSizeChanger
          pageSizeOptions={[5, 10, 15, 20, 50, 100]}
          defaultPageSize={15}
          style={{ display: 'flex', alignItems: 'center', marginTop: '2%' }}
          current={currentPage}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
        <h2 className='recommend'>Content History</h2>
        {visibleData.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            Your search parameters do not match with any of the search history.
            Click &nbsp;
            <NavLink to="/" className={({ isActive }) => `${isActive ? "active" : "not-active"}`}>
              Here
            </NavLink>
            &nbsp; to navigate to the forms page to generate content for new parameters
          </div>
        ) : (
          [...visibleData].map((entry, index) => (
            <Cards
              key={index}
              syllabus={entry.tags.syllabus}
              subject={entry.tags.subject}
              topic={entry.tags.topic}
              standard={entry.tags.Class}
              duration={entry.tags.duration}
              level={entry.tags.level}
              summary={entry.summary}
              entryvalue={entry}
            />
          ))
        )}
      </div>

    </div>
  );
};

export default History_page;