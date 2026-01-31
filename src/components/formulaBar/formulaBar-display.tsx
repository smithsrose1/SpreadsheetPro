import React from 'react';
import './formulaBar-display.css';

// Code for the formula bar, which shows the equation or content of a selected cell
interface FormulaBarProps {
    selectedCell: string;
    cellContent: string | number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormulaBarDisplay({ selectedCell, cellContent, onChange }: FormulaBarProps) {

    return (
        <div className="formula-bar-container">
            <div className="formula-bar">
                <span className="cell-label">{selectedCell}:</span>
                <input
                    type="text"
                    value={cellContent}
                    onChange={onChange}
                />
            </div>
        </div>
    );
}