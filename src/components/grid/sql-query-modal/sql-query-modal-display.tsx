import React, { useState } from "react";
import "./sql-query-modal-display.css";
import { SpreadsheetModel } from "../../../models/spreadsheet.model";
const nearley = require('nearley');
const grammar = require('./sql-grammar.js');

interface SQLQueryModalProps {
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
}

export function SQLQueryModal(props) {
    const { showModal, setShowModal } = props;
    const [displayValue, setDisplayValue] = useState<string>("");

    function handleSubmit(event) {
        event.preventDefault();
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        parser.feed(displayValue);
        const results = parser.results[0];
        console.log(results);
        SpreadsheetModel.getInstance().update(results['header']['primaryKey']['name'], 0, 0);
        for (let col = 0; col < results['header']['columns'].length; col++) {
            SpreadsheetModel.getInstance().update(
                results['header']['columns'][col]['name'],
                0,
                col + 1
            );
        }
        for (let col = 0; col < results['values'][0].length; col++) {
            for (let row = 0; row < results['values'].length; row++) {
                SpreadsheetModel.getInstance().update(
                    results['values'][row][col],
                    row + 1,
                    col
                );
            }
        }
    }

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
                        Interpret SQLite DDL
                    </h4>
                </div>
                <div className="modal-body">
                    <form
                        onSubmit={event => { handleSubmit(event); }}
                    >
                        <textarea
                            value={displayValue}
                            className="form-control"
                            placeholder="Define a table."
                            onChange={event => { setDisplayValue(event.target.value) }}
                        />
                        <input
                            type='submit'
                            value='Interpret'
                        />
                    </form>
                </div>
            </div>
        </div >
    );
}
