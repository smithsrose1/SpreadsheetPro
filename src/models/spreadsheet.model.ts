import { CellModel } from "./cell.model";
import { CommentModel } from "./comment.model";
// import { Media } from "./media.model"
import { Chart } from "./chart.model"
import { LinearChart } from "./linearChart.model";
import { PieChart } from "./pieChart.model";
import { BarChart } from "./barChart.model";
import { DependencyGraph } from "./dependencyGraph.model";

// Singleton
export class SpreadsheetModel {
    private title: string = 'Untitled';
    private charts: Array<Chart> = [];
    private grid: Array<Array<CellModel>>
    private comments: Array<CommentModel>
    private graph: DependencyGraph


    // 3D array of observers, where observers[row][col] is an array of observer functions
    // listening to changes in the cell at row `row` and column `col`.
    private observers: Array<Array<Array<() => void>>>;

    private static instance: SpreadsheetModel;

    public static getInstance(): SpreadsheetModel {
        if (SpreadsheetModel.instance === undefined) {
            SpreadsheetModel.instance = new SpreadsheetModel();
        }
        return SpreadsheetModel.instance;
    }

    /**
     *  Instantiates a grid with the specified dimensions.
     */
    private constructor(numRows: number = 50, numCols: number = 26) {
        const grid: Array<Array<CellModel>> = [];
        for (let row = 0; row < numRows; row++) {
            const row: Array<CellModel> = [];
            for (let col = 0; col < numCols; col++) {
                row.push(new CellModel(""));
            }
            grid.push(row);
        }
        this.grid = grid;
        this.comments = [];
        this.observers = Array.from({ length: numRows }, () =>
            Array.from({ length: numCols }, () => []));
    }

    /**
     * Updates the value of the cell at the specified row and column.
     * @param value 
     * @param row 
     * @param col 
     */
    public update(value: string, row: number, col: number) {
        this.graph = DependencyGraph.getInstance();
        this.grid[row][col].updateContent(value);
        // Notify observers of this cell that its value has changed.
        const references = this.grid[row][col].getReferences()
        for (const reference of references) {
            this.graph.addEdge(reference, [row, col])
            console.log("reference", reference)
        }
        console.log("notify dependents of ", [row, col])
        this.graph.notifyDependents([row, col])

        for (const observer of this.observers[row][col]) {
            observer();
        }
    }

    
    public refreshCell(row: number, col: number) {
        console.log("refreshing cell", row, col)
        this.graph = DependencyGraph.getInstance();
        this.grid[row][col].evaluateSavedInput();
        this.graph.notifyDependents([row, col])
    }

    public updateSavedInput(row: number, col: number, value: string) {
        this.grid[row][col].updateContent(value);
    }

    public getSavedInput(row: number, col: number): string {
        return this.grid[row][col].returnSavedInput();
    }

    public clearCell(row: number, col: number) {
        this.grid[row][col].clearContent();
    }

    // Get a cell's saved input
    public getCellSavedInput(row: number, col: number): string | number {
        return this.grid[row][col].getInput();
    }

    // Get a cell's content
    public getCellContent(row: number, col: number): string | number | null {
        return this.grid[row][col].getContent();
    }

    // Prioritize input over content, if no saved input, display content
    getCellDisplayValue(rowIndex: number, colIndex: number): string | number {
        const cell = this.grid[rowIndex][colIndex];
        if (cell.getInput() != null) {
            return cell.getInput();
        } else {
            return cell.getContent();
        }
    }


    // Create a comment (it used to have row and col but now comments is for whole spreadsheet)
    public createComment(input: string, author: string): void {
        this.comments.push(new CommentModel(input, author))
        //this.grid[row][col].createComment(input, author);
    }

    public getComments() {
        return this.comments;
    }

    public getGrid() {
        return this.grid;
    }

    public createColBefore(index: number): void {
        if (this.grid[0].length < index) {
            throw Error(`SpreadsheetModel has less than ${index} columns.`);
        } else {
            for (let row = 0; row < this.grid.length; row++) {
                this.grid[row].splice(index, 0, new CellModel(""));
                this.observers[row].splice(index, 0, []);
            }
            const graph = DependencyGraph.getInstance();

            this.graph.updateGraphOnColumnChange(index, "insert")


        }
    }

    public createColAfter(index: number): void {
        this.createColBefore(index + 1);
    }

    public createRowAfter(index: number): void {
        this.createRowBefore(index + 1);
    }

    public createRowBefore(index: number): void {
        const rowIterator = { length: this.grid[0].length }
        this.grid.splice(index, 0,
            Array.from(rowIterator, () => new CellModel(""))
        );
        this.observers.splice(index, 0,
            Array.from(rowIterator, () => [])
        );
        const graph = DependencyGraph.getInstance();
        graph.updateGraphOnRowChange(index, "insert")
    }

    // Justification for getter method:
    // `number`s are immutable, so it is safe to share.
    public getNumRows(): number {
        return this.grid.length;
    }

    // Justification for getter method:
    // `number`s are immutable, so it is safe to share.
    public getNumCols(): number {
        return this.grid[0].length;
    }

    public deleteCol(index: number): void {
        for (let row = 0; row < this.grid.length; row++) {
            // Notify all components listening to this column that they will 
            // now be covering the column to the right that is shifting left
            for (const observer of this.observers[row][index]) {
                observer();
            }
            // Detach all components listening to the last column, as the last
            // column will be removed.
            for (const observer of this.observers[row][this.observers[row].length - 1]) {
                this.detach(observer, row, index);
            }
            this.grid[row].splice(index, 1);
            this.observers[row].splice(index, 1);
        }
        this.graph.updateGraphOnColumnChange(index, "delete")

    }
    public deleteRow(index: number): void {
        this.grid.splice(index, 1);
        for (const cells of this.observers[index]) {
            for (const observer of cells) {
                observer();
            }
        }
        for (let col = 0; col < this.observers[this.observers.length - 1].length; col++) {
            for (const observer of this.observers[this.observers.length - 1][col]) {
                this.detach(observer, this.observers.length - 1, col);
            }
        }
        this.observers.pop();
        this.graph = DependencyGraph.getInstance();
        this.graph.updateGraphOnRowChange(index, "delete")
    }

    public setTitle(title: string) {
        this.title = title;
    }

    /**
     * Attaches the given observer function to the specified cell.
     * @param observer the observer function to be executed when the cell's value changes
     * @param row the row of the cell that `observer` is to be attached to
     * @param col the column of the cell that `observer` is to be attached to
     */
    public attach(observer: any, row: number, col: number): void {
        this.observers[row][col].push(observer);
    }

    /**
     * Detaches the specified observer from the specified cell.
     * Does nothing if the specified observer is not attached to the specified cell.
     * @param observer the observer function to be detached
     * @param row the row of the cell that `observer` is to be detached from
     * @param col the column of the cell that `observer` is to be detached from
     */
    public detach(observer: any, row: number, col: number): void {
        const index = this.observers[row][col].indexOf(observer);
        if (index !== -1) {
            this.observers[row][col].splice(index, 1);
        }
    }

    public createChart(title: string, data: string, xLabel: string, yLabel: string, chartType: string): void {
        switch(chartType){
            case "Pie":
                const p_chart = new PieChart(title, data, xLabel, yLabel)
                this.charts.push(p_chart)
                p_chart.render()
                console.log("Generating data for a pie chart")
                break;
            case "Bar":
                const b_chart = new BarChart(title, data, xLabel, yLabel)
                this.charts.push(b_chart)
                b_chart.render()

                break;
            case "Line":
                const l_chart = new LinearChart(title, data, xLabel, yLabel)
                this.charts.push(l_chart)
                l_chart.render()
                break;
            
        }
     }

    public getChartData(): any {
        return this.charts[this.charts.length - 1].getChartData()
    }

    public updateChart(): void { 
        for (const chart of this.charts) {
            chart.render();
        }
    }
    public deleteChart(): void { }
    public setChartTitle(): void { }
    public setChartDataRange(): void { }
}