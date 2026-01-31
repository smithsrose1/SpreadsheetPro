import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SpreadsheetUI from './Spreadsheet';
import { SpreadsheetModel } from './models/spreadsheet.model';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Create a spreadsheet
SpreadsheetModel.getInstance()

root.render(
  <React.StrictMode>
    <SpreadsheetUI />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
