const nearley = require('nearley');
const grammar = require('./sql-grammar.js');

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

parser.feed(
    "CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, studentNum INTEGER); INSERT INTO test VALUES (1, John, 20, 123456), (2, Michael, 45, 358), (2, Michael, 45, 358);"
);
console.log(parser.results[0])