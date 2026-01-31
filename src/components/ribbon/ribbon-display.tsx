import React, { useState } from 'react';
import './ribbon-display.css';
import { ribbonButtonDisplay } from './ribbonButton/ribbonButton-display';
import { RibbonDropdownDisplay } from './ribbonButton/ribbonDropdown-display';
import MyModal from 'components/grid/comment-modal/comment-modal-display-modal';
import { SQLQueryModal } from 'components/grid/sql-query-modal/sql-query-modal-display';
import { SpreadsheetModel } from 'models/spreadsheet.model';
import CommentModal from 'components/grid/comment-modal/comment-modal-display-modal';
import ChartPopUp from 'components/chartPopup/pieChartPopup-display';
import PieChartPopUp from 'components/chartPopup/pieChartPopup-display';
import BarChartPopUp from 'components/chartPopup/barChartPopup-display';
import LineChartPopUp from 'components/chartPopup/lineChartPopup-display';

export function RibbonDisplay() {
    const [showSQLQueryModal, setShowSQLQueryModal] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleSQLQueryModalOpen = () => {
        setShowSQLQueryModal(true);
    }

    const [author, setAuthor] = useState("");
    const [commentText, setCommentText] = useState("");
    const [showCommentPopup, setShowCommentPopup] = useState(false);
    const [showPieChartPopup, setShowPieChartPopup] = useState(false);
    const [chartType, setChartType] = useState('');
    const [showBarChartPopup, setShowBarChartPopup] = useState(false);
    const [showLineChartPopup, setShowLineChartPopup] = useState(false);


    // Define the various event handler functions
    const handleFileUpload = () => {
        alert('File upload clicked!');
    };

    const handleFileDownload = () => {
        alert('File download clicked!');
    };

    const handleGenerateChart = () => {
        alert('Generate chart clicked!');
    };

    // Code for closing and showing the comment pop up
    const handleAddComment = () => {

        setShowCommentPopup(true);
    };

    const handleViewComments = () => {
        showContent();
        setShowModal(!showModal);
    }

    const showContent = () => {
        const comments = SpreadsheetModel.getInstance().getComments();
        if (comments.length === 0) {
            setCommentText("No comments yet!");
            return;
        }

        let authorText = "";
        let contentText = "";
        for (let i = 0; i < comments.length; i++) {
            const c = comments[i];
            authorText += `Author: ${c.getAuthor()}`;
            contentText += `Comment: ${c.getText()}`;
        }

        setAuthor(authorText.trim());
        setCommentText(contentText.trim());
    };

    const handleMenuClick = (e) => {
        switch (e.key) {
            case '1':
                handleSQLQueryModalOpen();
                break;
        };
    };

    const handleChartMenuClick = (e) => {
        console.log('Clicked menu item:', e.key);
        switch (e.key) {
            case "1":
              // Create Pie Chart
              console.log("Create Pie Chart")
              setChartType('Pie')
              setShowPieChartPopup(!showPieChartPopup)
              break;
            case "2":
              // Create Bar Chart
              console.log("Create Bar Chart")
              setChartType('Bar')
              setShowBarChartPopup(!showBarChartPopup)

              break;
            case "3":
              // Create Line Chart
              console.log("Create Line Chart")
              setChartType('Line')
              setShowLineChartPopup(!showBarChartPopup)


              break;
              default:
                console.log("Unknown action");
            }

    };

    const menuFile = {
        items: [
            { key: '1', label: 'Interpret SQL' },
        ],
        onClick: handleMenuClick,
    };

    const menuChart = {
        items: [
            { key: '1', label: 'Pie Chart' },
            { key: '2', label: 'Bar Chart' },
            { key: '3', label: 'Line Chart' },
        ],
        onClick: handleChartMenuClick,
    };

    return (
        <div className="background">
            <div className="ribbon-bar">
                <div className="button-group">
                    {RibbonDropdownDisplay({ menu: menuFile, name: 'From SQLite' })}
                    {RibbonDropdownDisplay({ menu: menuChart, name: 'Generate Chart' })}
                    {ribbonButtonDisplay({ name: 'View comments', onClick: handleViewComments })}
                    {/* View comments modal */}


                    {/* View SQL Query modal */}
                    <SQLQueryModal showModal={showSQLQueryModal} setShowModal={setShowSQLQueryModal} />

                    {/* View comments modal */}
                    <MyModal showModal={showModal} setShowModal={setShowModal} />
                    <CommentModal
                        showModal={showModal}
                        setShowModal={setShowModal}
                        author={author}
                        content={commentText}
                    /></div>
            </div>
                    
            {/* Show PieChartPopup only when required */}
            {showPieChartPopup && (
                <PieChartPopUp
                    chartType={chartType}
                    showChartPopup={showPieChartPopup}
                    setShowChartPopup={setShowPieChartPopup}
                />
            )}
            {/* Show BarChartPopup only when required */}
            {showBarChartPopup && (
                <BarChartPopUp
                    chartType={chartType}
                    showChartPopup={showBarChartPopup}
                    setShowChartPopup={setShowBarChartPopup}
                    onGenerateChart={handleGenerateChart}
                />
            )}
            {/* Show LineChartPopup only when required */}
            {showLineChartPopup && (
                <LineChartPopUp
                    chartType={chartType}
                    showChartPopup={showLineChartPopup}
                    setShowChartPopup={setShowLineChartPopup}
                />
            )}
            {/* {showCommentPopup && <CommentPopup
                handleSave={handleSave}
                closePopup={closePopup} />} */}
        </div>
    );
}
