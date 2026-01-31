import { SpreadsheetModel } from "./spreadsheet.model";

const nearley = require("nearley");
const formulaGrammar = require("../formulaGrammar.js");
const literalGrammar = require("../literalGrammar.js");


// Parses the given input to the cell. Delegates parsing to the
// appropriate parser depending on the type of input
// (e.g. formula vs. literal).
export class Parser {
    private parser: InternalParser;

    public constructor(savedInput: string) {
        if (savedInput[0] == '=') {
            this.parser = new FormulaInternalParser(savedInput);
        } else {
            this.parser = new LiteralInternalParser(savedInput);
        }
    }

    public parse() {
        return this.parser.parse();
    }

    public getDependencies(): Array<[number, number]> {
        if (this.parser instanceof FormulaInternalParser) {
            return this.parser.getDependencies();
        }
        return [];
    }
}

// Handles the given input appropriately depending on the type of
// input it is (e.g. formula vs. literal).
abstract class InternalParser {
    protected parser;
    protected savedInput: string;
    public constructor(savedInput: string) {
        this.savedInput = savedInput;
    }
    public abstract parse();
}


// Parses formulas.
class FormulaInternalParser extends InternalParser {
    private detectedDependencies: Array<[number, number]> = [];

    public constructor(savedInput: string) {
        super(savedInput);
        this.parser = new nearley.Parser(nearley.Grammar.fromCompiled(formulaGrammar));
    }

    public getDependencies(): Array<[number, number]> {
        return this.detectedDependencies;
    }

    // Returns the column number of the given column name.
    private columnLetterToNumber(columnLetter: string): number {
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(columnLetter);
    }

    // Replaces, in `this.savedInput`, references to cells with the
    // content of those cells.
    // Aggregates a list of all cells referenced in the formula to
    // `this.detectedDependencies`.
    private fillRefs(): void {
        const refRegExp: RegExp = /REF\([A-Z]+[1-9]+[0-9]*\)/g;
        let parsedInput: string = this.savedInput;
        for (const ref of this.savedInput.matchAll(refRegExp)) {
            const fullReference = ref[0];
            const rowsIndex = /[0-9]+/g.exec(fullReference).index
            const column = fullReference.slice(
                fullReference.indexOf('(') + 1,
                rowsIndex
            );
            const columnNumber = this.columnLetterToNumber(column);
            const rowNumber = Number(fullReference.slice(
                rowsIndex,
                fullReference.indexOf(')')
            )) - 1;
            this.detectedDependencies.push([rowNumber, columnNumber]);
            parsedInput = parsedInput.replace(
                fullReference,
                JSON.stringify(SpreadsheetModel.getInstance().getCellContent(rowNumber, columnNumber))
            );
        }
        this.savedInput = parsedInput;
    }

    // Replaces, in `this.savedInput`, expressions on ranges of cells with the
    // range expression evaluated on those cells' content.
    // Aggregates a list of all cells referenced in the formula to
    // `this.detectedDependencies`.
    private fillRangeExpression(
        rangeExpressionRegExp: RegExp,
        calculation: (
            leftBoundColumn: number,
            leftBoundRow: number,
            rightBoundColumn: number,
            rightBoundRow: number
        ) => [any, Array<[number, number]>]
    ): void {
        console.log(rangeExpressionRegExp);
        let parsedInput: string = this.savedInput;
        console.log(parsedInput);
        for (const ref of this.savedInput.matchAll(rangeExpressionRegExp)) {
            const fullSum = ref[0];
            const ellipses = fullSum.indexOf('..');

            // Find row and column of the left bound
            const leftBoundRowsStart = /[0-9]+/g.exec(fullSum).index;
            const leftBoundRow = Number(fullSum.slice(leftBoundRowsStart, ellipses)) - 1;
            const leftBoundColumn = this.columnLetterToNumber(
                fullSum.slice(
                    fullSum.indexOf('(') + 1,
                    leftBoundRowsStart
                )
            );

            // Find row and column of the right bound
            const rightBoundRowStart = ellipses + /[0-9]+/g.exec(fullSum.slice(ellipses)).index;
            const rightBoundRow = Number(fullSum.slice(rightBoundRowStart, fullSum.indexOf(')'))) - 1;
            const rightBoundColumn = this.columnLetterToNumber(fullSum.slice(ellipses + 2, rightBoundRowStart));

            // Find all cells within the area defined by the left and right bounds.
            console.log(fullSum.slice(ellipses, rightBoundRowStart))
            if (leftBoundColumn > rightBoundColumn || leftBoundRow > rightBoundRow) {
                throw Error('Invalid range of cells. Left bound exceeds right bound.');
            } else {
                const [replacement, references]: [any, Array<[number, number]>] = calculation(
                    leftBoundColumn, leftBoundRow, rightBoundColumn, rightBoundRow
                )
                parsedInput = parsedInput.replace(fullSum, JSON.stringify(replacement));
                this.detectedDependencies.push(...references);
            }
        }
        console.log(parsedInput);
        this.savedInput = parsedInput;
    }

    // Replaces, in `this.savedInput`, SUMs of ranges of cells with the
    // sum of those cells' content.
    // Aggregates a list of all cells referenced in the formula to
    // `this.detectedDependencies`.
    private fillSums(): void {
        this.fillRangeExpression(
            /SUM\([A-Z]+[1-9]+[0-9]*..[A-Z]+[1-9]+[0-9]*\)/g,
            (leftBoundColumn, leftBoundRow, rightBoundColumn, rightBoundRow) => {
                const references: Array<[number, number]> = [];
                let sum = 0;
                for (let col = leftBoundColumn; col <= rightBoundColumn; col++) {
                    for (let row = leftBoundRow; row <= rightBoundRow; row++) {
                        // Typechecking was chosen here because we decided
                        // it would be too heavy-weight to implement an object-oriented
                        // system where cells have specific types.
                        const content: string | number = SpreadsheetModel.getInstance().getCellContent(row, col);
                        console.log(Number.isNaN(content))
                        if (typeof content != 'number') {
                            throw Error('Non-number encountered in sum.')
                        } else {
                            sum += <number>content;
                            references.push([row, col]);
                        }
                    }
                }
                return [sum, references]
            }
        );
    }

    // Replaces, in `this.savedInput`, AVERAGEs of ranges of cells with the
    // sum of those cells' content.
    // Aggregates a list of all cells referenced in the formula to
    // `this.detectedDependencies`.
    private fillAverages(): void {
        this.fillRangeExpression(
            /AVERAGE\([A-Z]+[1-9]+[0-9]*..[A-Z]+[1-9]+[0-9]*\)/g,
            (leftBoundColumn, leftBoundRow, rightBoundColumn, rightBoundRow) => {
                const references: Array<[number, number]> = [];
                let sum = 0;
                let numAddends = 0;
                for (let col = leftBoundColumn; col <= rightBoundColumn; col++) {
                    for (let row = leftBoundRow; row <= rightBoundRow; row++) {
                        // Typechecking was chosen here because we decided
                        // it would be too heavy-weight to implement an object-oriented
                        // system where cells have specific types.
                        const content: string | number = SpreadsheetModel.getInstance().getCellContent(row, col);
                        console.log(Number.isNaN(content))
                        if (typeof content != 'number') {
                            throw Error('Non-number encountered in average.')
                        } else {
                            sum += <number>content;
                            numAddends += 1;
                            references.push([row, col]);
                        }
                    }
                }
                return [sum / numAddends, references]
            }
        );
    }

    public parse() {
        this.fillRefs();
        this.fillSums();
        this.fillAverages();
        this.parser.feed(this.savedInput);
        return this.parser.results[0];
    }

}


// Parses literals.
class LiteralInternalParser extends InternalParser {
    public constructor(savedInput: string) {
        super(savedInput);
        this.parser = new nearley.Parser(nearley.Grammar.fromCompiled(literalGrammar));
    }

    public parse() {
        this.parser.feed(this.savedInput);
        return this.parser.results[0];
    }
}