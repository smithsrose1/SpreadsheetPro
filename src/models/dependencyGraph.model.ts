import { CellModel } from "./cell.model";
import { SpreadsheetModel } from "./spreadsheet.model";

export class DependencyGraph {
    private static instance: DependencyGraph

    // A map of cells to the set of cells that depend on them
    private graph: Map<string, Set<string>>;
  

    private constructor() {
      this.graph = new Map();
    }

    //returns a singleton instance of the DependencyGraph
    public static getInstance(): DependencyGraph {
      if (DependencyGraph.instance === undefined) {
        DependencyGraph.instance = new DependencyGraph();
      }
      return DependencyGraph.instance;
    }

    //creates an edge between two cells in the graph, checks to see if there is a cycle and errors
    public addEdge(from: [number, number], to: [number, number]): void {
        const fromKey = JSON.stringify(from);  // Convert to string
        const toKey = JSON.stringify(to);      // Convert to string
        
        if (!this.graph.has(fromKey)) {
          this.graph.set(fromKey, new Set());
        }

        if(this.graph.has(toKey)) {
            if(this.getDependents(to).has(fromKey)) {
                SpreadsheetModel.getInstance().updateSavedInput(to[0], to[1], "#CYCLIC");

                console.log("Cycle detected, not adding edge from", from, "to", to);
                return;
            }
        }
        this.graph.get(fromKey)!.add(toKey);   // Use stringified keys
        
        console.log("Added edge from", from, "to", to);
      }
      
  
    public removeEdge(from: [number, number], to: [number, number]): void {
        const fromKey = JSON.stringify(from);  // Convert to string
        const toKey = JSON.stringify(to);      // Convert to string
      this.graph.get(fromKey)?.delete(toKey);
      if (this.graph.get(fromKey)?.size === 0) {
        this.graph.delete(toKey);
      }
    }
  
    public getDependents(cell: [number, number]): Set<string> {
        const cellKey = JSON.stringify(cell);  // Convert to string
        const dependents = this.graph.get(cellKey) || new Set();
        
        console.log("Dependents for cell", cell, ":", dependents);
        return dependents;
      }
      

    public notifyDependents(cell: [number, number]): void {
        const cellKey = JSON.stringify(cell);  // Convert to string
        const dependents = this.getDependents(cell);
        
        dependents.forEach(dependent => {
          const dependentKey = JSON.parse(dependent);  // Convert back to array
          console.log("Refreshing dependent:", dependentKey);
      
          const [row, col] = dependentKey;
          SpreadsheetModel.getInstance().refreshCell(row, col);
        });
    }

    public updateGraphOnRowChange(index: number, operation: string): void {
        const updatedEdges: [string, string][] = []; // Store updated edges to avoid concurrent modification
    
        // Iterate over all edges in the graph
        this.graph.forEach((dependents, fromKey) => {
            const fromCell = JSON.parse(fromKey) as [number, number];
            let newFromCell = fromCell;
    
            // Update the `from` cell if its row index is greater than or equal to the inserted index
            if(operation === "insert" && fromCell[0] >= index) {
                newFromCell = [fromCell[0] + 1, fromCell[1]];
            } else if (operation === "delete" && fromCell[0] > index) {
                newFromCell = [fromCell[0] - 1, fromCell[1]];
            }
            const newFromKey = JSON.stringify(newFromCell);
    
            dependents.forEach(toKey => {
                const toCell = JSON.parse(toKey) as [number, number];
                let newToCell = toCell;

                if(operation === "insert" && toCell[0] >= index) {
                    newToCell = [toCell[0] + 1, toCell[1]];
                } else if (operation === "delete" && toCell[0] >= index) {
                    newToCell = [toCell[0] - 1, toCell[1]];
                }
                const newToKey = JSON.stringify(newToCell);
    
                // Add the updated edge to the list of edges to be re-added
                updatedEdges.push([newFromKey, newToKey]);
    
                // Remove the old edge
                this.removeEdge(fromCell, toCell);
            });
        });
    
        // Add all the updated edges back to the graph
        updatedEdges.forEach(([fromKey, toKey]) => {
            this.addEdge(JSON.parse(fromKey) as [number, number], JSON.parse(toKey) as [number, number]);
        });
    
        console.log("Dependency graph updated after row insert at index:", index);
        const updatedCells: Set<string> = new Set();
        // Update the saved input of the dependents
        this.graph.forEach((dependents, fromKey) => {
            const fromCell = JSON.parse(fromKey) as [number, number];
            
            dependents.forEach(dependent => {
                const dependentCell = JSON.parse(dependent) as [number, number];
                if (updatedCells.has(dependent)) {
                    console.log(`Cell (${dependentCell[0]}, ${dependentCell[1]}) has already been updated. Skipping...`);
                    return; // Skip this dependent
                } else{
                    updatedCells.add(dependent);
                    if (operation === "insert") {
                        this.updateRowDependentsSavedInput(dependentCell, fromCell, index, operation);
                    } else if (operation === "delete") {
                        this.updateRowDependentsSavedInput(dependentCell, fromCell, index, operation);
                    }
                    
                }
            });
            
        });
    }
    

    private updateRowDependentsSavedInput(dependentCell: [number, number], reference: [number, number], index:number, operation: string): void {
        // Convert the column number to a letter
        const columnLetter = this.convertColumnIndexToLetter(reference[1]); 
        // Increment the row number by 1 (spreadsheet rows are 1-based)
        const rowNumber = reference[0] + 1; 
        // Create the updated reference string
        const updatedReference = `=REF(${columnLetter}${rowNumber})`;
        
        const oldInput = SpreadsheetModel.getInstance().getSavedInput(dependentCell[0], dependentCell[1]);
        console.log("old", oldInput)
        if (oldInput.startsWith('=REF(')) {
            SpreadsheetModel.getInstance().updateSavedInput(dependentCell[0], dependentCell[1], updatedReference);
            console.log(`Updated cell (${dependentCell[0]}, ${dependentCell[1]}) saved input to "${updatedReference}"`);
            } else if (oldInput.startsWith('=SUM(') || oldInput.startsWith('=AVERAGE(')) {
                // Update the formula by adjusting row indexes in range expressions
                if (operation === "insert") {
                    const updatedInput = this.updateRowIndexesInInsertFormula(oldInput, index);
                    
                    SpreadsheetModel.getInstance().updateSavedInput(dependentCell[0], dependentCell[1], updatedInput);
                    console.log(`Updated cell (${dependentCell[0]}, ${dependentCell[1]}) saved input to "${updatedInput}"`);
                } else if (operation === "delete") {
                    const updatedInput = this.updateRowIndexesOnDeleteInFormula(oldInput, index);
                    
                    SpreadsheetModel.getInstance().updateSavedInput(dependentCell[0], dependentCell[1], updatedInput);
                    console.log(`Updated cell (${dependentCell[0]}, ${dependentCell[1]}) saved input to "${updatedInput}"`);
                }
            } else {
                console.log(`No update needed for cell (${dependentCell[0]}, ${dependentCell[1]}), input: "${oldInput}"`);
            }
    }

    // Helper function to update row indexes in formulas like =SUM(G2..G5) or =AVERAGE(G2..G5)
    private updateRowIndexesInInsertFormula(formula: string, insertedRowIndex: number): string {
        // Regular expression to match range references (e.g., G2..G5)
        const rangeReferenceRegex = /([A-Z]+)(\d+)(\.\.)([A-Z]+)(\d+)/g;

        // Replace matches with updated row numbers
        const updatedFormula = formula.replace(rangeReferenceRegex, (match, col1, row1, dots, col2, row2) => {
            const updatedRow1 = parseInt(row1, 10) >= insertedRowIndex + 1 ? (parseInt(row1, 10) + 1).toString() : row1;
            const updatedRow2 = parseInt(row2, 10) >= insertedRowIndex + 1 ? (parseInt(row2, 10) + 1).toString() : row2;

            return `${col1}${updatedRow1}${dots}${col2}${updatedRow2}`;
        });

        // Return the formula with updated ranges
        return updatedFormula;
    }

    // Helper function to update row indexes in formulas like =SUM(G2..G5) or =AVERAGE(G2..G5) when a row is deleted
    private updateRowIndexesOnDeleteInFormula(formula: string, deletedRowIndex: number): string {
        // Regular expression to match range references (e.g., G2..G5)
        const rangeReferenceRegex = /([A-Z]+)(\d+)(\.\.)([A-Z]+)(\d+)/g;

        // Replace matches with updated row numbers (decrement rows after the deleted row index)
        const updatedFormula = formula.replace(rangeReferenceRegex, (match, col1, row1, dots, col2, row2) => {
            const updatedRow1 = parseInt(row1, 10) > deletedRowIndex ? (parseInt(row1, 10) - 1).toString() : row1;
            const updatedRow2 = parseInt(row2, 10) > deletedRowIndex ? (parseInt(row2, 10) - 1).toString() : row2;

            return `${col1}${updatedRow1}${dots}${col2}${updatedRow2}`;
        });

        // Return the formula with updated ranges
        return updatedFormula;
    }

    

    public updateGraphOnColumnChange(index: number, operation:string): void {
        const updatedEdges: [string, string][] = []; // Store updated edges to avoid concurrent modification
    
        // Iterate over all edges in the graph
        this.graph.forEach((dependents, fromKey) => {
            const fromCell = JSON.parse(fromKey) as [number, number];
            let newFromCell = fromCell;
    
            // Update the `from` cell if its column index is greater than or equal to the inserted index
            if (operation === "insert" && fromCell[1] >= index) {
                newFromCell = [fromCell[0], fromCell[1] + 1];
            } else if (operation === "delete" && fromCell[1] > index) {
                newFromCell = [fromCell[0], fromCell[1] - 1];
            }
            const newFromKey = JSON.stringify(newFromCell);
    
            dependents.forEach(toKey => {
                const toCell = JSON.parse(toKey) as [number, number];
                let newToCell = toCell;
    
                // Update the `to` cell if its column index is greater than or equal to the inserted index
                if (operation === "insert" && toCell[1] >= index) {
                    newToCell = [toCell[0], toCell[1] + 1];
                } else if (operation === "delete" && toCell[1] > index) {
                    newToCell = [toCell[0], toCell[1] - 1];
                }
                const newToKey = JSON.stringify(newToCell);
    
                // Add the updated edge to the list of edges to be re-added
                updatedEdges.push([newFromKey, newToKey]);
    
                // Remove the old edge
                this.removeEdge(fromCell, toCell);
            });
        });
    
        // Add all the updated edges back to the graph
        updatedEdges.forEach(([fromKey, toKey]) => {
            this.addEdge(JSON.parse(fromKey) as [number, number], JSON.parse(toKey) as [number, number]);
        });
    
        console.log("Dependency graph updated after column insert at index:", index);
        
        const updatedCells: Set<string> = new Set();
        // Update the saved input of the dependents
        this.graph.forEach((dependents, fromKey) => {
            const fromCell = JSON.parse(fromKey) as [number, number];
    
            dependents.forEach(dependent => {
                const dependentCell = JSON.parse(dependent) as [number, number];
                // Skip if already updated
                const dependentKey = JSON.stringify(dependentCell);
                if (updatedCells.has(dependentKey)) {
                    console.log(`Cell (${dependentCell[0]}, ${dependentCell[1]}) has already been updated. Skipping...`);
                    return; // Skip this dependent
                } else {
                    updatedCells.add(dependentKey);
                    if (operation === "insert") {
                        this.updateColumnDependentsSavedInput(dependentCell, fromCell, index, operation);
                    } else if (operation === "delete") {
                        this.updateColumnDependentsSavedInput(dependentCell, fromCell, index, operation);
                    }
                }
            });
        });
    }

    private updateColumnDependentsSavedInput(dependentCell: [number, number], reference: [number, number], index: number, operation:string): void {
        // Convert the row number to a 1-based row index (spreadsheet row numbers start at 1)
        const columnLetter = this.convertColumnIndexToLetter(reference[1]);
        const rowNumber = reference[0] + 1;  // Row number is 1-based
    
        // Create the updated reference string
        const updatedReference = `=REF(${columnLetter}${rowNumber})`;
            
        const oldInput = SpreadsheetModel.getInstance().getSavedInput(dependentCell[0], dependentCell[1]);
        console.log("old", oldInput);
        
        if (oldInput.startsWith('=REF(')) {
            // Update the reference formula for "=REF()" formulas
            SpreadsheetModel.getInstance().updateSavedInput(dependentCell[0], dependentCell[1], updatedReference);
            console.log(`Updated cell (${dependentCell[0]}, ${dependentCell[1]}) saved input to "${updatedReference}"`);
        } else if (oldInput.startsWith('=SUM(') || oldInput.startsWith('=AVERAGE(')) {
            // Update the formula by adjusting column indexes in range expressions
            if (operation === "insert") {
                const updatedInput = this.updateColumnIndexesInInsertFormula(oldInput, index);
                    
                SpreadsheetModel.getInstance().updateSavedInput(dependentCell[0], dependentCell[1], updatedInput);
                console.log(`Updated cell (${dependentCell[0]}, ${dependentCell[1]}) saved input to "${updatedInput}"`);
            } else if (operation === "delete") {
                const updatedInput = this.updateColumnIndexesInDeleteFormula(oldInput, index);
                    
                SpreadsheetModel.getInstance().updateSavedInput(dependentCell[0], dependentCell[1], updatedInput);
                console.log(`Updated cell (${dependentCell[0]}, ${dependentCell[1]}) saved input to "${updatedInput}"`);
            }
        } else {
            console.log(`No update needed for cell (${dependentCell[0]}, ${dependentCell[1]}), input: "${oldInput}"`);
        }
    }

    private updateColumnIndexesInInsertFormula(formula: string, insertColumnIndex: number): string {
        // Regex to find column references (e.g., A1, B2, C3, etc.)
        const columnRegex = /([A-Z]+)(\d+)/g;
    
        return formula.replace(columnRegex, (match, col, row) => {
            const colIndex = this.convertColumnLetterToIndex(col);
            if (colIndex >= insertColumnIndex) {
                // Shift the column index to the right if it's past the inserted column
                const updatedColIndex = colIndex + 1;
                const updatedCol = this.convertColumnIndexToLetter(updatedColIndex);
                return updatedCol + row; // Rebuild the reference with the updated column
            }
            return match; // If the column is before the insertion, don't modify it
        });
    }

    // Helper function to update row indexes in formulas like =SUM(G2..G5) or =AVERAGE(G2..G5) when a row is deleted
    private updateColumnIndexesInDeleteFormula(formula: string, deletedColumnIndex: number): string {
        // Regular expression to match column and row references (e.g., A1, G2..G5)
        const rangeReferenceRegex = /([A-Z]+)(\d+)(\.\.)([A-Z]+)(\d+)/g;
        
        // Replace matches with updated column letters
        const updatedFormula = formula.replace(rangeReferenceRegex, (match, col1, row1, dots, col2, row2) => {
            // Update column indexes if the column is to the right of the deleted column
            const updatedCol1 = this.convertColumnIndexToLetter(this.convertColumnLetterToIndex(col1) - (this.convertColumnLetterToIndex(col1) > deletedColumnIndex ? 1 : 0));
            const updatedCol2 = this.convertColumnIndexToLetter(this.convertColumnLetterToIndex(col2) - (this.convertColumnLetterToIndex(col2) > deletedColumnIndex ? 1 : 0));
        
            return `${updatedCol1}${row1}${dots}${updatedCol2}${row2}`;
        });
        
        // Return the formula with updated columns
        return updatedFormula;
    }
    


    // Helper function to convert column letter to index (e.g., A -> 0, B -> 1, etc.)
    private convertColumnLetterToIndex(col: string): number {
        let index = 0;
        for (let i = 0; i < col.length; i++) {
            index = index * 26 + (col.charCodeAt(i) - 65);
        }
        return index;
    }
    
    
    // Helper function to convert column index (0-based) to a letter (A, B, C, etc.)
    private convertColumnIndexToLetter(colIndex: number): string {
        let letter = '';
        let index = colIndex;
        while (index >= 0) {
            letter = String.fromCharCode((index % 26) + 65) + letter; // 65 is ASCII for 'A'
            index = Math.floor(index / 26) - 1;
        }
        return letter;
    }

  }
  