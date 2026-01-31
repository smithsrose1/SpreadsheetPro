import React, { useEffect, useSyncExternalStore } from 'react';
import { useState } from 'react';
import { SpreadsheetModel } from 'models/spreadsheet.model';

// UI for each cell
export interface CellProps {
    row: number;
    column: number;
    //nClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CellUI(props: CellProps) {
    const [displayValue, setDisplayValue] = useState(
        showForEditing(SpreadsheetModel.getInstance().getCellContent(props.row, props.column))
    );
    const actualValue = useSyncExternalStore<string | number | null>(
        (observer: () => void) => {
            SpreadsheetModel.getInstance().attach(observer, props.row, props.column);
            return () => {
                SpreadsheetModel.getInstance().detach(observer, props.row, props.column)
            };
        },
        () => SpreadsheetModel.getInstance().getCellContent(props.row, props.column)
    );

    // Whenever the actual value changes, update the display value.
    useEffect(() => {
        console.log("Updating display value:", actualValue); // Debugging log

        setDisplayValue(format(actualValue));
    }, [actualValue]);

    /** 
     * Formats the given actualValue for display on the UI
     * in contexts where it is being edited.
     */
    function showForEditing(actualValue: string | number) {
        if (actualValue == null) {
            return "";
        } else if (/^[0-9]+$/g.test(String(actualValue))) {
            // if actualValue is a number or numerical string literal,
            // display its JSON string notation.
            return JSON.stringify(actualValue)
        } else {
            return String(actualValue);
        }
    }

    /**
     * Formats the given `actualValue` for assumption as the `displayValue` of the cell.
     */
    function format(value: string | number | null): string {
        if (value == null || value == '') {
            return "";
        } else {
            return JSON.stringify(value);
        }
    }

    /**
     * Updates
     */
    function update(): string | number | null {
        if (displayValue == "" || displayValue == null || displayValue == "null") {
            SpreadsheetModel.getInstance().clearCell(props.row, props.column);
        } else {
            if(String(SpreadsheetModel.getInstance().getCellContent(props.row, props.column)) !== String(displayValue)){
                console.log("Updating cell content from, to:", SpreadsheetModel.getInstance().getCellContent(props.row, props.column) , displayValue); // Debugging log
                SpreadsheetModel.getInstance().update(displayValue, props.row, props.column);
            }
        }
        return SpreadsheetModel.getInstance().getCellContent(props.row, props.column);
    }

    // When user hits Enter key, enter updates.
    function handleKeyUp(key: string, currentTarget: HTMLElement): void {
        if (key === 'Enter') {
            currentTarget.blur();   // delegates to blur event handler to enter updates
        }
    }

    // When user clicks away from the cell after it was focused on, enter updates.
    function handleBlur() {
        update();
    }

    // Continuously change the display value according to user input.
    function handleInput(expression: string): void {
        setDisplayValue(expression);
    }

    // When the user goes to edit the cell, show them the *real* cell content.
    function handleFocus() {
        setDisplayValue(showForEditing(actualValue));
    }

    /**
     * incomplete expression -> throw cell-level error
     */

    return (
        <input
            type='text'
            value={displayValue}
            onChange={event => { handleInput(event.target.value) }}
            onKeyUp={event => { handleKeyUp(event.key, event.currentTarget) }}
            onBlur={event => { handleBlur() }}
            onFocus={event => { handleFocus() }}
        />
    );
}