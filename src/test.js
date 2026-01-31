const nearley = require("nearley");
// const formulaGrammar = require("./formulaGrammar.js");
const literalGrammar = require("./literalGrammar.js");
// const referenceGrammar = require("./referenceGrammar.js");

// const parser = new nearley.Parser(nearley.Grammar.fromCompiled(formulaGrammar));
// let literalParser = new nearley.Parser(nearley.Grammar.fromCompiled(literalGrammar));

// Parse something!
// parser.feed("3+2*5+10-6/2-(7+3)*2^2");
// parser.feed('');
// parser.feed("=33+5");
// parser.feed("=(3+2)*67+REF(A7)/3+2^3-42*AVERAGE(B4..Z2");

// parser.results is an array of possible parsings.
// console.log(JSON.stringify(parser.results)); // expect: 35

// literalParser = new nearley.Parser(nearley.Grammar.fromCompiled(literalGrammar));
// literalParser.feed('"7423432"');
// console.log(literalParser.results[0] === '7423432')

// literalParser = new nearley.Parser(nearley.Grammar.fromCompiled(literalGrammar));
// literalParser.feed('7423432');
// console.log(literalParser.results[0] === 7423432)

// literalParser = new nearley.Parser(nearley.Grammar.fromCompiled(literalGrammar));
// literalParser.feed('abc');
// console.log(literalParser.results[0] === 'abc')

// literalParser = new nearley.Parser(nearley.Grammar.fromCompiled(literalGrammar));
// literalParser.feed('ab7cfdf88em4');
// console.log(literalParser.results[0] === 'ab7cfdf88em4')

// const referenceParser = new nearley.Parser(nearley.Grammar.fromCompiled(referenceGrammar))
// parser.feed("=REF(B13)")

const re = /REF\([A-Z]+[1-9]+[0-9]*\)/g
// for (const a of "REF(B7)+8-2*33/55345234+REF(ZA257)-2567".matchAll(re)) {
//     console.log(a[0])
// }
console.log(re.exec("REF(B7)+8-2*33/55345234+REF(ZA257)-2567").index)