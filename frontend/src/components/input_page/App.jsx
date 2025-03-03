import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import React, {useState, useEffect} from "react";
import './App.css';
import 'antd/dist/reset.css';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Button, Input, Select, InputNumber, Radio, TreeSelect, Row, Col, Upload, notification, message, Space } from 'antd';
import { 
    boardsData, CBSEdata, ICSEdata, Andhradata, Assamdata, Chattisgarhdata, GujaratData,
    HaryanaData, HimachalData, JharkhandData, KarnatakaData, KeralaData, MPData, MaharashtraData,
    ManipurData, MeghalayaData, MizoramData, NagalandData, OdishaData, PunjabData, RajasthanData,
    TelanganaData, TNData, UPData, WBData, StateData
} from './subject_data';
import LoadingIcon from "../LoadingIcon";

const { Option } = Select
const {TreeNode} = TreeSelect;

// Initial values for form fields
let defaultValues = {'level': "medium", 'location': "Rural"};
let initialValuesGlobal = {};
let listItems = localStorage.getItem('form_item_names');

/**
 * Populates initial form values from local storage.
 * This helps restore the progress in filling the form when the webpage is refreshed.
*/
const populateInitialValues = async () => { 
    if(listItems) {
        listItems = listItems.split(',');
        for(let i = 0; i < listItems.length; i++) initialValuesGlobal[listItems[i]] = localStorage.getItem(listItems[i]);
    }
    if(initialValuesGlobal['AddedValues']) initialValuesGlobal['AddedValues'] = initialValuesGlobal['AddedValues'].split(',');
    if(initialValuesGlobal['subjectData']) {
        let tempLst = initialValuesGlobal['subjectData'].split(',');
        initialValuesGlobal['subjectData'] = []
        for(let i = 0; i < tempLst.length; i++) initialValuesGlobal['subjectData'].push({title: tempLst[i], value: tempLst[i]});
    }
    else initialValuesGlobal['subjectData'] = [];
};

/**
 * Check if the page is reloaded and restore progress from local storage if available.
*/
if (window.PerformanceNavigationTiming) {
    const perfEntries = performance.getEntriesByType("navigation");
    if (perfEntries.length > 0) {
      const navigationType = perfEntries[0].type;
      if (navigationType === "reload") {
        if (localStorage.length > 1) {
            notification.success({
                    message: "Your progress has been restored"
            })
        }
      }
    }
}

// Call function to populate initial form values
await populateInitialValues();

// Initialize default values if not already set
for(const [key, value] of Object.entries(defaultValues)) {
    if(!initialValuesGlobal[key]) initialValuesGlobal[key] = value;
}

/**
 * Component for the input page.
 */
function Input_page() {
    // State variables
    var [loadingtocall,setLoadingtocall]=useState(1)
    const navigation=useNavigate();
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [pdfUploaded, setPdfUploaded] = useState(false);
    const [selectedSyllabus, setSelectedSyllabus] = useState(null);
    const [subjectData, setSubjectData] = useState(initialValuesGlobal['subjectData']);
    const [initialValues, setInitialValues] = useState(initialValuesGlobal);
    const [pdfText, setPdfText] = useState('');
    const [curr_number, setCurrNumber] = useState(0);

    // Reset form fields and set initial values on component mount whenever User navigates to form page.
    useEffect(() => {
        form.resetFields()
        form.setFieldValue(initialValues);
    }, [form, initialValues])

    // Update local storage with subject data when it changes
    useEffect(() => {
        let listOfSubjects = []
        for(let i = 0; i < subjectData.length; i++) listOfSubjects.push(subjectData[i].title);
        localStorage.setItem("subjectData", listOfSubjects);
    }, [subjectData]);
    
    /**
     * Reset form fields and clear local storage.
    */
    const onReset = () => {
        setInitialValues({...defaultValues});
        setSubjectData([]);
        localStorage.clear();
        form.resetFields();  
    };
    
    /**
     * Handler function triggered when the form is successfully submitted.
     * @param {Object} values - Form values submitted by the user.
    */
    const onFinish = async(values)  =>{
        // On submitting the form, Reset the form fields and clear the local storage.
        setInitialValues({...defaultValues});
        setSubjectData([]);
        localStorage.clear();
        form.resetFields(); 
        
        // Display the success notification and disable loading state
        notification.success({
            message: "Form submitted successfully!"
        })
        setLoadingtocall(0)

        try {
            // Explanation: 
            // These default values for AddedValues are set because 
            // python code in the backend is not able to identify the presence of Addedvalues and state key in the json 
            // since their values are NULL and hence raising a key error halting the content generation process.

            let temp_var1 = values.AddedValues ? values.AddedValues : ["Null"];
            let temp_var2 = values.State ? values.State : "Empty";

            // send request to server.
            const response= await axios.post('/output_generated/question',{
                Topic: values.topic,
                Syllabus: values.syllabus,
                Subject: values.subject,
                standard: values.Class,
                Duration: values.duration,
                Level: values.level,
                Values: temp_var1,
                State: temp_var2,
                Location: values.location,
                File_data: pdfText,
            });

            // Explanation: 
            // Using the below code, Empty fields of form values are deleted 
            // to remove them from appending into the cards on the content page.
            // Instead of printing AddedValues=Null in the cards, It is getting deleted in the cards. 
            // Same for file and state too since they are not required fields in the form.

            // Updating the file value in form values
            if (values.file) {
                values.file = fileList[0].name;
            } else {
                delete values.file;
            }

            // Removing the undefined values from AddedValues
            if (values.AddedValues) {
                values.AddedValues = values.AddedValues.filter(value => value !== undefined);
            } else {
                delete values.AddedValues;
            }

            // Removing undefined value of state
            if (!values.State) {
                delete values.State;
            }

            // Combine response data and form data and navigating to output page.
            var response_and_form_data={"response_data":response.data,"form_data":values}
            navigation('/output',{state:response_and_form_data});
        }
        catch(err) {
            console.log(err);
        }
    }

    // Handler to validate number input used for class and duration
    const validateNumber = (rule, value, callback) => {
        if (isNaN(value) || value<=0) {
            callback('Please enter a valid number');
        } else {
            callback();
        }
    };

    // Handler to update form data in local storage
    const formDataCookie = (props, fields) => {
        let currItems = ["subjectData"];
        for(let i = 0; i < fields.length; i++){
            currItems.push(fields[i].name[0]);
            localStorage.setItem('form_item_names', currItems);
            if(fields[i].touched){
                if(fields[i].name.length === 1) localStorage.setItem(fields[i].name[0], fields[i].value);
            }
        }
    };

    // Handler to handle syllabus change since the subjects are in correspondance with the syllabus.
    const handleSyllabusChange = (value) => {
        setSelectedSyllabus(value);
        switch(value) {
            // set subject data based on selected syllabus.
            case 'Central Board of Secondary Education (CBSE)':
                setSubjectData(CBSEdata);
                form.setFieldsValue({'subject': undefined});
                break;
            case 'Indian Certificate of Secondary Education (ICSE)':
                setSubjectData(ICSEdata);
                form.setFieldsValue({'subject': undefined});
                break;
            case 'Andhra Pradesh Board of Secondary Education (BSEAP)':
                setSubjectData(Andhradata);
                form.setFieldsValue({'subject': undefined});
                break;
            case 'Assam Board of Secondary Education (SEBA)':
                setSubjectData(Assamdata);
                form.setFieldsValue({'subject': undefined});
                break;
            case 'Chattisgarh Board of Secondary Education (CGBSE)':
                setSubjectData(Chattisgarhdata);
                form.setFieldsValue({'subject': undefined});
                break;
            case 'Gujarat Secondary and Higher Secondary Education Board (GSEB)':
                setSubjectData(GujaratData);
                form.setFieldsValue({'subject': undefined});
                break;
            case 'Haryana Board of School Education (HBSE)':
                setSubjectData(HaryanaData);
                form.setFieldsValue({'subject': undefined});
                break;
            case 'Himachal Pradesh Board of School Education (HPBOSE)':
                setSubjectData(HimachalData);
                form.setFieldsValue({'subject': undefined});
                break;
            case 'Jharkhand Academic Council (JAC)':
                setSubjectData(JharkhandData);
                form.setFieldsValue({'subject': undefined});
                break;
            case 'Karnataka Secondary Education Examination Board (KSEEB)':
                setSubjectData(KarnatakaData);
                form.setFieldsValue({'subject': undefined});
                break;
            case 'Kerala State Education Board (KBPE)':
                setSubjectData(KeralaData);
                form.setFieldsValue({'subject': undefined});
                break;
            case 'Madhya Pradesh Board of Secondary Education (MPBSE)':
                setSubjectData(MPData);
                form.setFieldsValue({'subject': undefined});
                break;
            case 'Maharashtra State Board of Secondary and Higher Secondary Education (MSBSHSE)':
                setSubjectData(MaharashtraData);
                form.setFieldsValue({'subject': undefined});
                break;
            case 'Manipur Board of Secondary Education (BSEM)':
                setSubjectData(ManipurData);
                form.setFieldsValue({'subject': undefined});
                break;
            case 'Meghalaya Board of School Education (MBOSE)':
                setSubjectData(MeghalayaData);
                form.setFieldsValue({'subject': undefined});
                break;
            case 'Mizoram Board of School Education (MBSE)':
                setSubjectData(MizoramData);
                form.setFieldsValue({'subject': undefined});
                break;
            case 'Nagaland Board of School Education (NBSE)':
                setSubjectData(NagalandData);
                form.setFieldsValue({'subject': undefined});
                break;
            case 'Odisha Board of Secondary Education (BSE Odisha)':
                setSubjectData(OdishaData);
                form.setFieldsValue({'subject': undefined});
                break;
            case 'Punjab School Education Board (PSEB)':
                setSubjectData(PunjabData);
                form.setFieldsValue({'subject': undefined});
                break;
            case 'Rajasthan Board of Secondary Education (RBSE)':
                setSubjectData(RajasthanData);
                form.setFieldsValue({'subject': undefined});
                break;
            case 'Telangana State Board of Secondary Education (BSETS)':
                setSubjectData(TelanganaData);
                form.setFieldsValue({'subject': undefined});
                break;
            case 'Tamil Nadu Board of Secondary Education (TNBSE)':
                setSubjectData(TNData);
                form.setFieldsValue({'subject': undefined});
                break;
            case 'Uttar Pradesh Madhyamik Shiksha Parishad (UPMSP)':
                setSubjectData(UPData);
                form.setFieldsValue({'subject': undefined});
                break;
            case 'West Bengal Board of Secondary Education (WBBSE)':
                setSubjectData(WBData);
                form.setFieldsValue({'subject': undefined});
                break;
            default:
                setSubjectData([]);
                break;
        }
    };

    // returning the JSX elements for input form.
    return (
        <div style={{
                width: "100%",
                height: "100%",
                position: "fixed",
                left: "0",
                top: screen.height / 12,
                bottom: screen.height / 12,
                flexDirection: "column",
                display: "flex",
                overflowY: "auto",
                alignItems: "center"
        }}>
            {loadingtocall?
            <div style={{ width: "480px", padding: "30px", marginTop: "20px", paddingBottom: screen.width / 12 }}>
            <Form
                form = {form}
                name="form"
                onFinish={onFinish}
                initialValues={initialValues}
                onFieldsChange={formDataCookie}
            >
                {/* Syllabus Selection */}
                <Form.Item
                    label="Syllabus:"
                    name="syllabus"
                    labelCol={{span: 4}}
                    wrapperCol={{span: 20}}
                    rules={[{ required: true, message: 'Syllabus is a required field'}]}
                >
                    <TreeSelect
                        style={{width: '340px',textAlign: "left"}}
                        showSearch
                        filterOption={(input, option) =>
                            option.title.toLowerCase().startsWith(input.toLowerCase())
                        }
                        treeDefaultExpandAll
                        placeholder="Please Select the Board"
                        onChange={handleSyllabusChange}
                    >
                        {boardsData.map(node => (
                            <TreeNode value={node.value} title={node.title} key={node.value} />
                        ))}
                    </TreeSelect>
                </Form.Item>

                {/* Subject Selection */}
                <Form.Item
                    label="Subject"
                    name="subject"
                    rules={[{ required: true, message: 'Subject is a required field'}]}
                    labelCol={{span: 4}}
                    wrapperCol={{span: 20}}
                >
                    <TreeSelect 
                        style={{width: '340px',textAlign: "left"}}
                        showSearch
                        filterOption = {(input, option) =>
                            option.title.toLowerCase().startsWith(input.toLowerCase())
                        }
                        treeDefaultExpandAll
                        placeholder="Please select the Syllabus First"
                    >
                        {/* Mapping corresponding subject data as per the syllabus selected */}
                        {subjectData.map(node => (
                            <TreeNode value={node.value} title={node.title} key={node.value} />
                        ))}
                    </TreeSelect>
                </Form.Item>

                {/* Topic Input */}
                <Form.Item 
                    label="Topic"
                    name="topic" 
                    rules={[{ required: true, message: 'Topic is a required field'}]}
                    labelCol={{span: 4}}
                    wrapperCol={{span: 20}}
                >
                    <Input 
                        placeholder="Please give an input" 
                        type="text" 
                        style={{width: '340px'}}
                    />
                </Form.Item>

                {/* Class Selection */}
                <Form.Item
                    label="Class"
                    name="Class"
                    rules={[{ required: true, message: 'Class is a required field', validator: validateNumber}]}
                    labelCol={{span: 4}}
                    wrapperCol={{ span: 18}}
                >
                    <Radio.Group
                        style={{width: '300px',textAlign: "left"}}
                    >
                        <Radio style={{ fontSize: '18px' }} value="1"> 1 </Radio>
                        <Radio style={{ fontSize: '18px' }} value="2"> 2 </Radio>
                        <Radio style={{ fontSize: '18px' }} value="3"> 3 </Radio>
                        <Radio style={{ fontSize: '18px' }} value="4"> 4 </Radio>
                        <Radio style={{ fontSize: '18px' }} value="5"> 5 </Radio>
                        <Radio style={{ fontSize: '18px' }} value="6"> 6 </Radio>
                        <Radio style={{ fontSize: '18px' }} value="7"> 7 </Radio>
                        <Radio style={{ fontSize: '18px' }} value="8"> 8 </Radio>
                        <Radio style={{ fontSize: '18px' }} value="9"> 9 </Radio>
                        <Radio style={{ fontSize: '18px' }} value="10"> 10 </Radio>
                    </Radio.Group>
                </Form.Item>

                {/* Duration Input */}
                <Form.Item
                    label = "Duration"
                    name = "duration"
                    rules={[{ required: true, message: 'Duration is a required field',validator: validateNumber}]}
                    labelCol={{span: 4}}
                    wrapperCol={{ span: 7}}
                >
                    <InputNumber 
                        min={1} 
                        type="number" 
                        style={{width: '120px', fontSize:'15px'}}
                        suffix="minutes"
                    />
                </Form.Item>

                {/* Level Selection */}
                <Form.Item 
                    label="Level"
                    name="level"
                    initialValue="medium"
                    labelCol={{span: 4}}
                    wrapperCol={{ span: 15}}
                >
                    <Radio.Group>
                        <Radio value="easy"> Easy </Radio>
                        <Radio value="medium"> Medium </Radio>
                        <Radio value="Complex">Complex</Radio>
                    </Radio.Group>
                </Form.Item>

                {/* Dynamic list of values */}
                <Form.List name="AddedValues">
                    {(fields, { add, remove }, { errors }) => (
                    <>
                        {fields.map((field, index) => (
                        <Form.Item
                            label="Values:"
                            key={field.key}
                            labelCol={{span: 4}}
                            wrapperCol={{span: 18}}
                        >
                            <Form.Item
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                noStyle
                            >
                                <Input placeholder="Please enter a value" style={{width: '85%',}}/>
                            </Form.Item>

                            {/* Dynamic addition / removal of values */}
                            {fields.length > 0 ? (
                                <MinusCircleOutlined
                                    className="dynamic-delete-button"
                                    onClick={() => remove(field.name)}
                                />
                            ) : null}
                        </Form.Item>
                        ))}

                        {/* Button to add new value */}
                        <Form.Item
                            labelCol={{span: 4}}
                            wrapperCol={{span: 20}}
                        >
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                style={{
                                    width: '60%',
                                }}
                                icon={<PlusOutlined />}
                            >
                                Add Value
                            </Button>

                            {/* display error list if any */}
                            <Form.ErrorList errors={errors} />
                        </Form.Item>
                    </>
                    )}
                </Form.List>

                {/* File upload section */}
                <Form.Item
                    label="Upload:" 
                    name="file"
                    labelCol={{span: 4}}
                    wrapperCol={{ span: 4}}
                >
                    <Upload
                        name="file"
                        action="/output_generated/upload"
                        headers={{ authorization: "authorization-text" }}
                        listType="picture-card"
                        fileList={fileList}
                        showUploadList={{ showRemoveIcon: true }}
                        type="file"
                        accept=".pdf"
                        // Function to validate file before upload
                        beforeUpload={(file) => {
                            if (file.type !== "application/pdf") {
                                notification.error({
                                    message: "You can only upload PDF files!",
                                });
                                return false;
                            }
                            if (file.size / 1024 > 100) {
                                notification.error({
                                    message: "File size exceeds the limit of 100KB",
                                });
                                return false;
                            }
                            // set the file list and allow upload
                            setFileList([file]);
                            return true
                        }}
                        // Function to handle file removal
                        onRemove={() => {
                            setFileList([]);
                            setCurrNumber(0);
                        }}
                        // Function to handle changes in file upload
                        onChange={(info) => {
                            if (info.file.status === "done") {
                                notification.success({
                                    message: 'File Upload Successful',
                                    description: `${info.file.name} file uploaded successfully`,
                                });
                                if (info.file.response) {
                                    // set pdf text and update states
                                    setPdfText(info.file.response.text);
                                    setFileList([info.fileList[0]]);
                                    setCurrNumber(1);
                                    setPdfUploaded(true);
                                }
                            } else if (info.file.status === "error") {
                                // handle file upload error
                                message.error(`${info.file.name} file upload failed hai.`);
                                setFileList([]);
                                setCurrNumber(0);
                            }
                        }}
                    >
                        {/* Button to initiate file upload */}
                        {curr_number === 0 && (
                            <Button style={{ border: 0 }} type="button">
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload PDF</div>
                            </Button>
                        )}
                    </Upload>
                </Form.Item>

                {/* Location Selection */}
                <Form.Item label="Location">
                    <Row gutter={8}>
                        <Col span={12}>
                            <Form.Item name="State" noStyle>
                                <TreeSelect
                                    style={{textAlign: "left"}}
                                    placeholder="Select the state"
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.title.toLowerCase().startsWith(input.toLowerCase())
                                    }
                                    treeDefaultExpandAll
                                >
                                    {/* Mapping state data for selection */}
                                    {StateData.map(node => (
                                        <TreeNode value={node.value} title={node.title} key={node.value} />
                                    ))}
                                </TreeSelect>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="location" initialValue="Rural" noStyle>
                                <Select placeholder="Select Area">
                                    {/* Options for area selection */}
                                    <Option value="Rural">Rural</Option>
                                    <Option value="Urban">Urban</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form.Item>

                {/* Form submission and reset buttons */}
                <Form.Item style={{ padding: '10px'}}>
                    <span style={{margin: '0 30px'}}></span>
                    <Button type="primary" htmlType='submit'>Submit</Button> 
                    <span style={{margin: '0 20px'}}></span>
                    <Button htmlType="button" onClick={onReset}>Reset</Button>
                </Form.Item>
            </Form>
            </div>
            :
            // Loading icon when form is being submitted.
            <div style={{
              color: "black",
              fontSize: "50px",
            }}>
              <LoadingIcon />
            </div>
            }
        </div>
    );
}

export default Input_page;
