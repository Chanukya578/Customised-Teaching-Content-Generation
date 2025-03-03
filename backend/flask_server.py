"""
This script defines a Flask application to handle the backend functionality of our project.
This file handles various tasks including generating prompts, handling uploads,
adding and retrieving entries from a MongoDB databse and performing search operations.

Functions: 
    - generate_prompt: Generates a prompt of string type based on provided parameters.
    - modify_response: Modifies the response received from the OpenAI API
    - generate_modified_prompt: Generates a prompt of list type based on provided parameters.
    - index: Renders the index page indicating the server is running.
    - chat: Handles chat functionality by interacting with the OpenAI API.
    - upload_file: Handles parsing functionality of the uploaded pdf in forms page.
    - add_entry: Adds an entry to the MongoDB database.
    - get_entries: Retrieves entries from the MongoDB database.
    - common_search: Performs a common search operation based on a provided search word.
    - advanced_search: Performs an advanced search operation based on provided search criteria.

Routes:
    - "/": GET request to render the index page.
    - "/output_generated/question": GET and POST requests to handle chat functionality.
    - "/output_generated/upload": POST request to handle file uploads.
    - "/output_generated/add_entry": POST request to add an entry to the database.
    - "/output_generated/get_entries": GET request to retrieve entries from the database.
    - "/output_generated/common_search": POST request to perform a common search operation.
    - "/output_generated/advanced_search": POST request to perform an advanced search operation.

Dependencies:
    - Flask: Web framework for creating web applications in Python.
    - PyPDF4: Library for reading PDF files in Python.
    - OpenAI: Python client for the OpenAI API.
    - pymongo: Python driver for MongoDB.
"""

from flask import Flask, jsonify, request
import os
import PyPDF4
# from openai import OpenAI
import google.generativeai as genai
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

"""
Mongo Part: 

The following section establishes a connection to a MongoDB database and initializes the necessary variables 
for accessing the 'StudyContentGen' database and the 'ContentRecord' collection within it.

Variables:
    - client: MongoClient instance representing the connection to the MongoDB server.
    - db: Reference to the 'StudyContentGen' database.
    - records: Reference to the 'ContentRecord' collection within the 'StudyContentGen' database.

Dependencies:
    - pymongo: Python driver for MongoDB.
"""

load_dotenv()

try:
    client = MongoClient(os.environ.get("MONGO_KEY"), server_api=ServerApi('1'))
    print("MongoDB Connected Successfully!")
    db = client.get_database("StudyContentGen")
    records = db.ContentRecord  
    print(records)
except Exception as e:                                                                                                                                                                                                                                                                                                                                                                      
    print("MongoDB Connection Error:", e)

app = Flask(__name__)

"""
This part initializes the OpenAI client, which was used to interact with the OpenAI API for various tasks.

(PREVIOUSLY USED)

Attributes:
    - client: OpenAI client instance configured with the provided API key.
    - api_key: API key used for authentication with the OpenAI API.
        - If the environment variable 'OPENAI_API_KEY' is set, it retrieves the API key from it.
        - Otherwise, it uses a default API key as a fallback.
                                                                                                                                                                                                                                                                     
Dependencies:
    - os: Provides a portable way of using operating system-dependent functionality, 
          such as accessing environment variables.
"""
# openai_client = OpenAI(api_key=os.environ.get("OPEN_AI_API_KEY"))

"""
This part initializes the Gemini client, which is used to interact with the Google Gemini API for various tasks.

(PREVIOUSLY USED)

Attributes:
    - client: Gemini client instance configured with the provided API key.
    - api_key: API key used for authentication with the Gemini API.
        - If the environment variable 'GEMINI_API_KEY' is set, it retrieves the API key from it.
        - Otherwise, it uses a default API key as a fallback.
    
Dependencies:
    - os: Provides a portable way of using operating system-dependent functionality, 
          such as accessing environment variables.
"""
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
gemini_client = genai.GenerativeModel("gemini-2.0-pro-exp")
# models = genai.list_models()
# for model in models: 
#     print(model)

def generate_prompt(topic, syllabus, subject,duration,standard, level, AddedValues, state, location,File_data) -> str:
    """
        Generates a prompt of string type for a tutor based on the provided parameters.
        Returns:
            str: The prompt that is later passed as a prompt to the OpenAI API to generate content. 
    """
    prompt = f"I want you to be an excellent {subject} tutor tailored to the syllabus of {syllabus}. I will provide you the topic at hand. When i do so, provide me the detailed list of key points to memorize including the definitions in topic. They have to be appropriate for a {duration}-minute lecture for class-{standard},{level}-levelled course"
    if AddedValues:
        prompt += f" which includes the following human values- {AddedValues}"
    prompt += f". Also provide me with some clarifications to help me avoid common mistakes or misunderstandings and examples relevant to students in "
    if state:
        prompt += f"{state}"
    else:
        prompt += f"Any indian"
    prompt += f" state, particularly those in {location} areas. The topic is {topic}"
    prompt += f"The content should be such that there is {2*duration//7} minutes of introduction ,folllowed by {5*duration//7} minutes of detailed explanation and {duration//7} minutes of conclusion."
    prompt += "Also ,provide elaboration of each point that you provide"
    if File_data!="":
        prompt+=f"Here is some content that you can use as a reference:\n {File_data}"
    return prompt

def modify_response(response: str) -> str:
    """
        Modifies a response string by adding a newline character to the end of each line. 
    """
    response = response.split("\n")
    for i in range(len(response)):
        response[i] = response[i] + "\n"
    return response

def generate_modified_prompt(topic, syllabus, subject,duration,standard, level, AddedValues, state, location):
    '''
        Generates a modified prompt to be displayed in the content page.

        Returns:
            list: A list containing the components of the modified prompt.
    '''
    prompt = []
    prompt.append("I want you to be an excellent ")
    prompt.append('"' + subject + '"')
    prompt.append(" tutor tailored to the syllabus of ")
    prompt.append('"' + syllabus + '"')
    prompt.append(". I will provide you the topic at hand. When i do so, provide me the detailed list of key points to memorize including the definitions in topic. They have to be appropriate for a ")
    prompt.append('"' + str(duration) + '"')
    prompt.append("-minute lecture for class-")
    prompt.append('"' + str(standard) + '"')
    prompt.append(",")
    prompt.append('"' + level + '"')
    prompt.append("-levelled course")
    if AddedValues:
        prompt.append(" which includes the following human values- ")
        prompt.append('"' + AddedValues + '"')
    else:
        prompt.append("")
        prompt.append("")
    prompt.append(". Also provide me with some clarifications to help me avoid common mistakes or misunderstandings and examples relevant to students in ")
    if state:
        prompt.append('"' + state + '"')
    else:
        prompt.append('"any Indian"')
    prompt.append(" state, particularly those in ")
    prompt.append('"' + location + '"')
    prompt.append(" areas. The topic is ")
    prompt.append('"' + topic + '"')
    prompt.append(". The content should be such that there is ")
    prompt.append(str(2*duration//7))
    prompt.append(" minutes of introduction, followed by ")
    prompt.append(str(5*duration//7))
    prompt.append(" minutes of detailed explanation and ")
    prompt.append(str(duration//7))
    prompt.append(" minutes of conclusion.")
    prompt.append("Also, provide elaboration of each point that you provide.")
    return prompt

@app.route("/")
def index():
    return "<h1>Server is running</h1>"

@app.route("/output_generated/question", methods=["GET", "POST"])
def chat():
    """
        Handles chat functionality for the Flask application.
        This function receives JSON data from the request, extracts necessary parameters from the JSON data.
        It then generates a prompt using the 'generate_prompt' function, sends the prompt to the OpenAI API for completion, and receives a response.
        The response is modified using the 'modify_response' function and used to generate a summary.
        Finally, a modified prompt is generated using the 'generate_modified_prompt' function,
        And a JSON response containing the original prompt, modified prompt, response, and summary is returned.
    """
    request_data = request.get_json()
    Syllabus = request_data["Syllabus"]
    Subject = request_data["Subject"]
    Topic = request_data["Topic"]
    standard = request_data["standard"]
    Duration = request_data["Duration"]
    Level = request_data["Level"]
    Location = request_data["Location"]
    if request_data["File_data"] == "Null":
        File_data = ""
    else:
        File_data = request_data["File_data"]
    if request_data["Values"] == ["Null"]:
        AddedValues = ""
    else:
        orig_values = request_data["Values"]
        values = []
        for i in range(len(orig_values)):
            if orig_values[i]:
                values.append(orig_values[i])
        AddedValues = ""
        for i in range(len(values)):
            if values[i]:
                AddedValues += values[i]
                if i!=(len(values)-1):
                    AddedValues += " , "
    if request_data["State"] == "Empty":
        State = ""
    else:
        State = request_data["State"]
    prompt_to_send = generate_prompt(Topic,Syllabus,Subject,Duration,standard,Level,AddedValues,State,Location,File_data)
    response = gemini_client.generate_content(prompt_to_send)
    if hasattr(response, "text"):  # Ensure response is an object with .text
        final_response = response.text
    final_response = modify_response(final_response)

    summary_prompt = f"Give me a short summary of about 70 to 100 words of the following content.\n {response}"
    summary = gemini_client.generate_content(summary_prompt)
    if hasattr(summary, "text"):  # Ensure response is an object with .text
        final_summary = summary.text
    
    # chat_completion = openai_client.chat.completions.create(
    #     messages=[
    #         {
    #             "role": "user",
    #             "content": prompt_to_send,
    #         }
    #     ],
    #     model="gpt-3.5-turbo",
    #     temperature=0.7,
    #     max_tokens=4095,
    # )
    # response = chat_completion.choices[0].message.content
    # response = modify_response(response)

    # summary_completion = openai_client.chat.completions.create(
    #     messages=[
    #         {
    #             "role": "user",
    #             "content": f"Give me a short summary of about  70 to 100 words of the following content.\n {response}",
    #         }
    #     ],
    #     model="gpt-3.5-turbo",
    #     temperature=0.7,
    #     max_tokens=4095,
    # )
    # summary=summary_completion.choices[0].message.content
    modified_prompt = generate_modified_prompt(Topic,Syllabus,Subject,Duration,standard,Level,AddedValues,State,Location)
    return (
        jsonify(
            {
                "response": final_response,
                "prompt": prompt_to_send,
                "modifiedprompt": modified_prompt,
                "summary": final_summary,
            }),
        200,
    )

@app.route("/output_generated/upload", methods=["POST"])
def upload_file():
    """
        Handles parsing the uploaded pdf file in forms page. 

        This function reads the PDF file using PyPDF4, extracts text from each page and returns the JSON response containing the extracted text.
    """
    if "file" not in request.files:
        return jsonify({"error": "No file part"})
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"})
    if file:
        pdf_reader = PyPDF4.PdfFileReader(file)
        text = ""
        for page_num in range(pdf_reader.numPages):
            page = pdf_reader.getPage(page_num)
            text += page.extractText()
        return jsonify({"text": text})
    else:
        return jsonify({"error": "Failed to read the PDF file"})

@app.route("/output_generated/add_entry", methods=["POST"])
def add_entry():
    """
        Handles adding an entry to the MongoDB database for the Flask application.

        This function receives a POST request containing JSON data representing the entry to be added to the database. 
        It attempts to insert the provided data into the 'ContentRecord' collection of the 'StudyContentGen' database. 
        If successful, it returns a JSON response indicating success, otherwise, it returns a JSON response indicating failure.

        Returns:
            dict: A JSON response indicating the status of the database operation (success or failure).
    """
    global records
    data = request.get_json()
    print(data)
    print(records.count_documents({}))
    try:
        result = records.insert_one(data)
        print("Inserted ID:", result.inserted_id)
        print("Status: Success")
        return jsonify({"status": "success"})
    except Exception as e:
        print("Status: Failure", e)
        return jsonify({"status": "failed"})

@app.route("/output_generated/get_entries", methods=["POST", "GET"])
def get_entries():
    """
        Retrieves entries from the MongoDB database for the Flask application.

        This function handles both POST and GET requests to retrieve entries from the 'ContentRecord' collection 
        of the 'StudyContentGen' database. It queries the database to retrieve all entries. 

        Returns:
            dict: A JSON response containing the list of entries retrieved from the database.
    """
    global records
    entries = records.find({}, {"_id":0})
    final_entries = list(entries)
    print(f"Entries are: {entries}")
    return jsonify({"entries": final_entries})

@app.route("/output_generated/common_search", methods=["POST", "GET"])
def common_search():
    """
        Handles a common search operation for entries in the MongoDB database for the Flask application.

        This function receives JSON data with a search word in the 'search_word' field.
        It performs a case-insensitive search for the provided search word in the 'tags' field of each entry in the 'ContentRecord' collection.
        If a match is found, the corresponding entry is added to the list of matched entries.
        
        Returns:
            dict: A JSON response containing the entries matching the search criteria.
    """
    global records
    data = request.get_json()
    search_word = str(data.get("search_word", "")).lower().lstrip().rstrip()
    entries = records.find({},{"_id":0})
    matched_entries = []
    for entry in entries:
        tags = entry.get("tags", {})
        if any(search_word in str(value).lower() for value in tags.values()):
            matched_entries.append(entry)
    return jsonify({"entries": matched_entries})

@app.route("/output_generated/advanced_search", methods=["POST", "GET"])
def advanced_search():
    """
        Handles advanced search functionality for the Flask application

        This function performs an advanced search operation on entries in the 'ContentRecord' collection of the 'StudyContentGen' database. 
        It receives JSON data representing search criteria and retrieves entries from the database. 
        It iterates over the retrieved entries, checking if each entry matches the provided search criteria. 
        If a match is found, the entry is added to the list of matched entries.

        Returns:
            dict: A JSON response containing the matched entries based on the provided search criteria.
 
    """
    global records
    data = request.get_json()
    entries = records.find({},{"_id":0})
    matched_entries = []
    if data:
        for entry in entries:
            tags = entry.get("tags",{})
            isMatched = True
            for key, value in data.items():
                if key in tags and value.lower().lstrip().rstrip() not in str(tags[key]).lower().lstrip().rstrip():
                    isMatched = False
                    break
            if isMatched:
                matched_entries.append(entry)
    return jsonify({"entries": matched_entries})

if __name__ == "__main__":
    app.run(debug=True, port=8098)
