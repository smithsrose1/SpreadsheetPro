// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "formula", "symbols": [{"literal":"="}, "expression"], "postprocess": 
        data => data[1]
        },
    {"name": "expression", "symbols": ["numericalExpression"], "postprocess": data => Number(data[0])},
    {"name": "expression", "symbols": ["stringConcat"], "postprocess": data => String(data[0])},
    {"name": "stringConcat", "symbols": ["stringConcat", {"literal":"+"}, "stringConcat"], "postprocess": 
        data => data[0] + data[2]
        },
    {"name": "stringConcat", "symbols": ["stringLiteral"], "postprocess": id},
    {"name": "stringLiteral$ebnf$1", "symbols": [/[^="]/]},
    {"name": "stringLiteral$ebnf$1", "symbols": ["stringLiteral$ebnf$1", /[^="]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "stringLiteral", "symbols": [{"literal":"\""}, "stringLiteral$ebnf$1", {"literal":"\""}], "postprocess": 
        data => data[1].join('')
        },
    {"name": "numericalExpression", "symbols": ["additionSubtraction"], "postprocess": id},
    {"name": "additionSubtraction", "symbols": ["additionSubtraction", {"literal":"+"}, "multiplicationDivision"], "postprocess":  
        data => Number(data[0]) + Number(data[2])
        },
    {"name": "additionSubtraction", "symbols": ["additionSubtraction", {"literal":"-"}, "multiplicationDivision"], "postprocess":  
        data => data[0] - data[2]
        },
    {"name": "additionSubtraction", "symbols": ["multiplicationDivision"], "postprocess": id},
    {"name": "multiplicationDivision", "symbols": ["multiplicationDivision", {"literal":"*"}, "power"], "postprocess":  
        data => data[0] * data[2]
        },
    {"name": "multiplicationDivision", "symbols": ["multiplicationDivision", {"literal":"/"}, "power"], "postprocess":  
        data => data[0] / data[2]
        },
    {"name": "multiplicationDivision", "symbols": ["power"], "postprocess": id},
    {"name": "power", "symbols": ["atom", {"literal":"^"}, "power"], "postprocess":  
        data => Math.pow(data[0], data[2])
        },
    {"name": "power", "symbols": ["atom"], "postprocess": id},
    {"name": "atom", "symbols": [{"literal":"("}, "expression", {"literal":")"}], "postprocess":  
        data => data[1]
        },
    {"name": "atom", "symbols": ["number"], "postprocess": id},
    {"name": "atom", "symbols": ["reference"], "postprocess": id},
    {"name": "atom", "symbols": ["rangeExpression"], "postprocess": id},
    {"name": "unsigned_int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_int$ebnf$1", "symbols": ["unsigned_int$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_int", "symbols": ["unsigned_int$ebnf$1"], "postprocess": 
        function(d) {
            return parseInt(d[0].join(""));
        }
        },
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"-"}]},
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"+"}]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "int$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "int$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$2", "symbols": ["int$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "int", "symbols": ["int$ebnf$1", "int$ebnf$2"], "postprocess": 
        function(d) {
            if (d[0]) {
                return parseInt(d[0][0]+d[1].join(""));
            } else {
                return parseInt(d[1].join(""));
            }
        }
        },
    {"name": "unsigned_decimal$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$1", "symbols": ["unsigned_decimal$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1", "symbols": [{"literal":"."}, "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "unsigned_decimal$ebnf$2", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "unsigned_decimal$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "unsigned_decimal", "symbols": ["unsigned_decimal$ebnf$1", "unsigned_decimal$ebnf$2"], "postprocess": 
        function(d) {
            return parseFloat(
                d[0].join("") +
                (d[1] ? "."+d[1][1].join("") : "")
            );
        }
        },
    {"name": "decimal$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "decimal$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decimal$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$2", "symbols": ["decimal$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": ["decimal$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "decimal$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "decimal$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "decimal$ebnf$3", "symbols": ["decimal$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "decimal$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decimal", "symbols": ["decimal$ebnf$1", "decimal$ebnf$2", "decimal$ebnf$3"], "postprocess": 
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "")
            );
        }
        },
    {"name": "percentage", "symbols": ["decimal", {"literal":"%"}], "postprocess": 
        function(d) {
            return d[0]/100;
        }
        },
    {"name": "jsonfloat$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "jsonfloat$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$2", "symbols": ["jsonfloat$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": ["jsonfloat$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "jsonfloat$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "jsonfloat$ebnf$3", "symbols": ["jsonfloat$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [/[+-]/], "postprocess": id},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": ["jsonfloat$ebnf$4$subexpression$1$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$4$subexpression$1", "symbols": [/[eE]/, "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "jsonfloat$ebnf$4$subexpression$1$ebnf$2"]},
    {"name": "jsonfloat$ebnf$4", "symbols": ["jsonfloat$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat", "symbols": ["jsonfloat$ebnf$1", "jsonfloat$ebnf$2", "jsonfloat$ebnf$3", "jsonfloat$ebnf$4"], "postprocess": 
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "") +
                (d[3] ? "e" + (d[3][1] || "+") + d[3][2].join("") : "")
            );
        }
        },
    {"name": "number", "symbols": ["unsigned_decimal"], "postprocess": id},
    {"name": "reference$string$1", "symbols": [{"literal":"R"}, {"literal":"E"}, {"literal":"F"}, {"literal":"("}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "reference", "symbols": ["reference$string$1", "cellName", {"literal":")"}], "postprocess": 
        data => {
            // dummy callback, replace with below.
            return data
        }
        },
    {"name": "rangeExpression$string$1", "symbols": [{"literal":"S"}, {"literal":"U"}, {"literal":"M"}, {"literal":"("}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "rangeExpression", "symbols": ["rangeExpression$string$1", "range", {"literal":")"}], "postprocess": id},
    {"name": "rangeExpression$string$2", "symbols": [{"literal":"A"}, {"literal":"V"}, {"literal":"E"}, {"literal":"R"}, {"literal":"A"}, {"literal":"G"}, {"literal":"E"}, {"literal":"("}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "rangeExpression", "symbols": ["rangeExpression$string$2", "range", {"literal":")"}], "postprocess": id},
    {"name": "range$string$1", "symbols": [{"literal":"."}, {"literal":"."}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "range", "symbols": ["cellName", "range$string$1", "cellName"], "postprocess": id},
    {"name": "cellName", "symbols": ["letter", "number"], "postprocess": 
        data => data
        },
    {"name": "letter$ebnf$1", "symbols": [/[A-Z]/]},
    {"name": "letter$ebnf$1", "symbols": ["letter$ebnf$1", /[A-Z]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "letter", "symbols": ["letter$ebnf$1"], "postprocess": 
        data => data.flat().join('')
        },
    {"name": "number$ebnf$1", "symbols": []},
    {"name": "number$ebnf$1", "symbols": ["number$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "number", "symbols": [/[1-9]/, "number$ebnf$1"], "postprocess": 
        data => data.flat().join('')
        }
]
  , ParserStart: "formula"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
