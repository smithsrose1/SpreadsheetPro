import { SpreadsheetModel } from "./spreadsheet.model";

export abstract class Chart {
    public title: string
    public dataRange: string
    public xLabel: string
    public yLabel: string
    protected chartData: any;
    private spreadsheet: SpreadsheetModel;
    protected convertedData: Array<any>;


    constructor(title: string, dataRange: string, xLabel: string, yLabel: string) {
        this.title = title
        this.dataRange = dataRange
        this.xLabel = xLabel
        this.yLabel = yLabel
        this.spreadsheet = SpreadsheetModel.getInstance();

    }
    public getChartData(): any {
        return this.chartData;
    }

    public extractData(): void {
        const rangeRegex = /^([A-Z]+)(\d+):([A-Z]+)(\d+)$/;
        const match = this.dataRange.match(rangeRegex);

        if (!match) {
            throw new Error('Invalid range format. Use format like A1:B3.');
        }

        const [, startCol, startRow, endCol, endRow] = match;
        const colToIndex = (col) => col.split('').reduce((sum, char) => sum * 26 + (char.charCodeAt(0) - 65), 0);

        const startColIndex = colToIndex(startCol);
        const endColIndex = colToIndex(endCol);
        const startRowIndex = parseInt(startRow, 10) - 1; // Convert to zero-based
        const endRowIndex = parseInt(endRow, 10) - 1;

        const data = [];

        for (let row = startRowIndex; row <= endRowIndex; row++) {
            const rowData = [];
            for (let col = startColIndex; col <= endColIndex; col++) {
                rowData.push(this.spreadsheet.getCellContent(row, col)); // Extract value from grid
            }
            data.push(rowData);
        }

        this.convertedData = data;

    }
    
    public abstract render(): void ;
    public update(): void {
        this.render();
    }
}
