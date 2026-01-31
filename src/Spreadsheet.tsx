import React from 'react';
import { Grid } from './components/grid/grid-display';
import { SpreadsheetModel } from './models/spreadsheet.model';
import { RibbonDisplay } from 'components/ribbon/ribbon-display';

function SpreadsheetUI() {
  
  return (
    <div className="SpreadsheetUI" >

      {RibbonDisplay()}
      {
        Grid(
          {
            rows: SpreadsheetModel.getInstance().getNumRows(),
            columns: SpreadsheetModel.getInstance().getNumCols()
          }
        )
      }
    </div>
  );
}

export default SpreadsheetUI;
