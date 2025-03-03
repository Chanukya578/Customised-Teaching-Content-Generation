/**
 * Renders the main application component.
 * 
 * This file imports necessary dependencies, including React, ReactDOM, react-router-dom, and application components.
 * It defines the application routing structure using createBrowserRouter from react-router-dom.
 * The routing structure includes paths for input, output, history, and home pages.
 * Finally, it renders the main application component within a RouterProvider.
 * 
*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Input_page from './components/input_page/App';
import Output_Page from './components/output_page/App';
import History_page from './components/history_page/App';
import Homepage from './components/home_page/App';
import Layout_page from './components/layout/layout_page';


// Define application routing structure
const router= createBrowserRouter([
    {
      path: '/',
      element: <Layout_page  />,
      children: [
        { path: '', element: <Input_page /> },
        { path: 'output', element: <Output_Page /> },
        { path: 'history', element: <History_page />},
        { path: 'home', element: <Homepage /> }
      ]
    }
])

// Render the main application component
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)