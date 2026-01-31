import React from "react";
import "./comment-modal-display.css";


// The comment modal on the right side, which shows the comments
export default function CommentModal(props) {
    const { showModal, setShowModal, author, content } = props;

    return (
        <div
            className={showModal ? "modal-dialog show" : "modal-dialog"}
            role="document"
        >
            <div className="modal-content">
                <div className="modal-header">
                    <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                        onClick={() => {
                            setShowModal(false);
                        }}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 className="modal-title" id="myModalLabel">
                        Comments
                    </h4>
                </div>
                <div className="modal-body">
                    <p>{author}</p>
                    <p>{content}</p>
                </div>
            </div>
        </div>
    );
}
