import database from 'better-sqlite3';
import { SpreadsheetModel } from './src/models/spreadsheet.model';

const dml = `
    SELECT personName, hobbyName
    FROM Person JOIN Hobby
    ON Person.hobbyId == Hobby.hobbyId;
`

export function loadQueryResult(query: string) {
    const better = new database.Database('test.db');
    better.all(
        query,
        (err: Error | null, rows: Array<Object>) => {
            if (err != null) {
                throw err;
            } else if (rows.length > 0) {
                const fields = Object.keys(rows[0]);
                for (let col = 0; col < fields.length; col++) {
                    SpreadsheetModel.getInstance().update(fields[col], 1, col);
                    for (let row = 0; row < rows.length; row++) {
                        SpreadsheetModel.getInstance().update(rows[row][fields[col]], row + 2, col);
                    }
                }
            } else {
                SpreadsheetModel.getInstance().update('Query returned 0 results.', 0, 0);
            }
        }
    );
}