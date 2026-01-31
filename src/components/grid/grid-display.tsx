import React, { useEffect, useState } from 'react';
import './grid-display.css';
import { DropdownMenu } from './dropdownmenu/dropdown-menu';
import { FormulaBarDisplay } from 'components/formulaBar/formulaBar-display';
import { CommentPopup } from 'components/commentPopup/commentPopup-display';
import { CellUI } from './cell/cell-display';
import { SpreadsheetModel } from 'models/spreadsheet.model';
import { flushSync } from 'react-dom';

interface GridProps {
  rows: number;
  columns: number;
}

// The grid of the spreadsheet!
export function Grid(props: GridProps): React.ReactElement {
  const [gridData, setGridData] = useState<string[][]>(
    Array.from({ length: props.rows }, () =>
      Array.from({ length: props.columns }, () => '')
    )
  );

  const [visible, setVisible] = useState(false);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [selectedCell, setSelectedCell] = useState<string>('A1');
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [contextRowIndex, setContextRowIndex] = useState<number>();
  const [contextColIndex, setContextColIndex] = useState<number>();
  const [formulaContent, setFormulaContent] = useState<string | number>();


  // Close comment popup
  const closeCommentPopup = () => {
    setShowCommentPopup(false);
  };

  // const hasComments = (row: number, col: number) => {
  //   if (SpreadsheetModel.getInstance().getCellComments(row, col).length > 0) {
  //     return SpreadsheetModel.getInstance().getCellComments(row, col);
  //   }
  // }

  // Update labels for columns
  const updateLabels = (row: number, column: number) => {
    const columnHeader = getColumnHeader(column + 1);
    setSelectedCell(`${columnHeader}${row + 1}`);
  };

  // Generates the header for a column
  const getColumnHeader = (index: number): string => {
    let columnHeader = '';
    if (index === 0) {
      return '-';
    }
    while (index > 0) {
      columnHeader = String.fromCharCode(64 + (index % 26)) + columnHeader;
      index = Math.floor(index / 26) - 1;
    }
    return columnHeader;
  };

  // Render a row and a column
  const renderRow = (rowIndex: number, rowData: string[]) => {
    return (
      <tr key={rowIndex}>
        <td onContextMenu={(event) => onRowDropdownMenu(event, rowIndex)}>
          {rowIndex + 1}
        </td>
        {rowData.map((cell, colIndex) => (
          <td
            key={colIndex}
            onClick={() => {
              updateLabels(rowIndex, colIndex);
              setFormulaBarContent(rowIndex, colIndex);
            }}
            onContextMenu={(event) => {
              setContextColIndex(colIndex);
              onRowDropdownMenu(event, rowIndex);
            }}
          >
            <CellUI
              row={rowIndex}
              column={colIndex}
            //onClick={(e) => hasComments(rowIndex, colIndex)}
            />
          </td>
        ))}
      </tr>
    );
  };

  // Triggers the dropdown menu on right click
  const onRowDropdownMenu = (event: React.MouseEvent, rowIndex: number) => {
    setContextRowIndex(rowIndex);
    event.preventDefault();
    const { clientX, clientY } = event;
    setPosX(clientX);
    setPosY(clientY);
    setVisible(true);
  };

  // Adds a row to gridData
  function _addRowToGridData() {
    setGridData((prevData) => {
      const newData = [...prevData];
      const newRow = Array.from({ length: props.columns }, () => '');
      newData.push(newRow);
      return newData;
    });
  }
  // Adds a column to gridData
  function _addColumnToGridData() {
    setGridData((prevData) => {
      const newData = prevData.map((row) => {
        const newRow = [...row];
        newRow.push('');
        return newRow;
      });
      return newData;
    });
  }

  // Handle dropdown menu action
  const handleMenuAction = (key: string) => {
    switch (key) {
      case "1":
        // Insert row above
        _addRowToGridData();
        SpreadsheetModel.getInstance().createRowBefore(contextRowIndex);
        break;
      case "2":
        // Insert row below
        _addRowToGridData();
        SpreadsheetModel.getInstance().createRowAfter(contextRowIndex);
        break;
      case "3":
        // Delete row

        // Note: flushSync is discouraged, but we need it in order to ensure
        // that the subsequent call to delete the row in the SpreadsheetModel is 
        // made AFTER all UI components that are listening to the to-be-deleted cells
        // have been detached to avoid any observer errors.
        flushSync(() => {
          setGridData((prevData) => {
            const newData = [...prevData];
            newData.pop();
            return newData;
          })
        });
        SpreadsheetModel.getInstance().deleteRow(contextRowIndex);
        break;
      case "4":
        // Insert column left
        _addColumnToGridData();
        SpreadsheetModel.getInstance().createColBefore(contextColIndex);
        break;
      case "5":
        // Insert column right
        _addColumnToGridData();
        SpreadsheetModel.getInstance().createColAfter(contextColIndex);
        break;
      case "6":
        // Delete column

        // Note: See the note above on `flushSync` usage.
        flushSync(() => {
          setGridData((prevData) => {
            const newData = prevData.map((row) => {
              const newRow = [...row];
              newRow.splice(contextColIndex, 1); // Remove cell at contextColIndex
              return newRow;
            });
            return newData;
          })
        });
        SpreadsheetModel.getInstance().deleteCol(contextColIndex);
        break;
      case "7":
        // Add comment
        console.log("Add comment");
        console.log(contextRowIndex);
        console.log(contextColIndex);
        setShowCommentPopup(true);
        break;
      case "8":
        // Close the menu
        console.log("Close menu");
        break;
      default:
        console.log("Unknown action");
    }
    setVisible(false);
  };


  // Get the content of a cell for the formula bar
  const setFormulaBarContent = (rowIndex: number, colIndex: number) => {
    const displayValue = SpreadsheetModel.getInstance().getCellDisplayValue(rowIndex, colIndex);
    setFormulaContent(displayValue);
  };

  return (
    <div className="grid-container">
      <FormulaBarDisplay
        selectedCell={selectedCell}
        cellContent={formulaContent}
        onChange={(e) => setFormulaContent(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            {Array.from({ length: props.columns }).map((_, colIndex) => (
              <th key={colIndex}>{getColumnHeader(colIndex)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {gridData.map((rowData, rowIndex) => renderRow(rowIndex, rowData))}
        </tbody>
      </table>
      <DropdownMenu
        posX={posX}
        posY={posY}
        onClick={(e) => handleMenuAction(e.key)}
        visible={visible}
      />
      {showCommentPopup && <CommentPopup
        row={contextRowIndex}
        col={contextColIndex}
        closePopup={closeCommentPopup}
        setCommentText={setCommentText} />}
    </div>
  );
}


