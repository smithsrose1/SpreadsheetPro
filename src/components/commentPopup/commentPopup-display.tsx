import React, { useState } from 'react';
import './commentPopup-display.css';
import { SpreadsheetModel } from 'models/spreadsheet.model';

// Comment Popup component, where you enter a comment & an author
interface CommentPopupProps {
    row: number;
    col: number;
    closePopup: () => void;
    setCommentText: (text: string) => void;
}

export function CommentPopup(props: CommentPopupProps) {
    const [spreadsheet, setSpreadsheet] = useState(SpreadsheetModel.getInstance())
    const [comment, setComment] = useState('');
    const [author, setAuthor] = useState('');

    // Handling the changing of the comment
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(event.target.value);
    };

    // Handling for the save button
    const handleSave = () => {
        if (comment.trim() && author.trim()) {
            const formattedText = `Author: (${author})\nComment: (${comment})`;
            props.setCommentText(formattedText);
            spreadsheet.createComment(comment, author);
            console.log('Comment saved:', comment, author);
            props.closePopup();
        } else {
            // Some error handling
            alert("Both author and comment must be filled out.");
        }
    };

    return (
        <div className="comment-popup">
            <div className="popup-container">
                <div className="popup-header">
                    <h3>Add a Comment</h3>
                    <button className="close-button" onClick={props.closePopup}>X</button>
                </div>
                <div className="author-container">
                    <label htmlFor="author" className="author-label">Author:</label>
                    <input
                        id="author"
                        className="name-input"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Name"
                    />
                </div>
                <textarea
                    className="text-input"
                    value={comment}
                    onChange={handleChange}
                    placeholder="Enter your comment"
                />
                <div className="popup-footer">
                    <button onClick={handleSave}>Save</button>
                    <button onClick={props.closePopup}>Cancel</button>
                </div>
            </div>
        </div>
    );

}

