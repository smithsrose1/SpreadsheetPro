// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "main", "symbols": ["createTable", {"literal":" "}, "insertInto"], "postprocess": 
        data => {
            return {
                header : data[0],
                values : data[2]
            }
        }
        },
    {"name": "createTable$string$1", "symbols": [{"literal":"C"}, {"literal":"R"}, {"literal":"E"}, {"literal":"A"}, {"literal":"T"}, {"literal":"E"}, {"literal":" "}, {"literal":"T"}, {"literal":"A"}, {"literal":"B"}, {"literal":"L"}, {"literal":"E"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "createTable$string$2", "symbols": [{"literal":" "}, {"literal":"("}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "createTable$string$3", "symbols": [{"literal":","}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "createTable$string$4", "symbols": [{"literal":")"}, {"literal":";"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "createTable", "symbols": ["createTable$string$1", "tableName", "createTable$string$2", "primaryKeyDecl", "createTable$string$3", "variableDeclList", "createTable$string$4"], "postprocess": 
        (data) => {
            return {
                primaryKey: data[3],
                columns: data[5]
            }
        }
        },
    {"name": "tableName", "symbols": ["varName"], "postprocess": (data) => 'tableName'},
    {"name": "primaryKeyDecl$string$1", "symbols": [{"literal":" "}, {"literal":"P"}, {"literal":"R"}, {"literal":"I"}, {"literal":"M"}, {"literal":"A"}, {"literal":"R"}, {"literal":"Y"}, {"literal":" "}, {"literal":"K"}, {"literal":"E"}, {"literal":"Y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "primaryKeyDecl", "symbols": ["variableDecl", "primaryKeyDecl$string$1"], "postprocess": (data) => data[0]},
    {"name": "variableDeclList$subexpression$1$string$1", "symbols": [{"literal":","}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "variableDeclList$subexpression$1", "symbols": ["variableDeclList", "variableDeclList$subexpression$1$string$1", "variableDeclList"]},
    {"name": "variableDeclList", "symbols": ["variableDeclList$subexpression$1"], "postprocess": 
        (data) => {
            return [data[0][0], data[0][2]].flat()
        }
        },
    {"name": "variableDeclList", "symbols": ["variableDecl"]},
    {"name": "variableDecl", "symbols": ["varName", {"literal":" "}, "dataType"], "postprocess":  
        (data) => {
            return {name: data[0], type: data[2]}
        }
        },
    {"name": "varName$ebnf$1", "symbols": [/[A-Za-z0-9_]/]},
    {"name": "varName$ebnf$1", "symbols": ["varName$ebnf$1", /[A-Za-z0-9_]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "varName", "symbols": ["varName$ebnf$1"], "postprocess": (data) => data.flat().join('')},
    {"name": "dataType$subexpression$1$string$1", "symbols": [{"literal":"I"}, {"literal":"N"}, {"literal":"T"}, {"literal":"E"}, {"literal":"G"}, {"literal":"E"}, {"literal":"R"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "dataType$subexpression$1", "symbols": ["dataType$subexpression$1$string$1"]},
    {"name": "dataType$subexpression$1$string$2", "symbols": [{"literal":"T"}, {"literal":"E"}, {"literal":"X"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "dataType$subexpression$1", "symbols": ["dataType$subexpression$1$string$2"]},
    {"name": "dataType", "symbols": ["dataType$subexpression$1"], "postprocess": (data) => data.flat().join('')},
    {"name": "insertInto$string$1", "symbols": [{"literal":"I"}, {"literal":"N"}, {"literal":"S"}, {"literal":"E"}, {"literal":"R"}, {"literal":"T"}, {"literal":" "}, {"literal":"I"}, {"literal":"N"}, {"literal":"T"}, {"literal":"O"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "insertInto$string$2", "symbols": [{"literal":" "}, {"literal":"V"}, {"literal":"A"}, {"literal":"L"}, {"literal":"U"}, {"literal":"E"}, {"literal":"S"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "insertInto", "symbols": ["insertInto$string$1", "tableName", "insertInto$string$2", "rowList"], "postprocess": 
        (data) => {
            return data[3]
        }
        },
    {"name": "rowList$string$1", "symbols": [{"literal":")"}, {"literal":";"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "rowList", "symbols": [{"literal":"("}, "valueList", "rowList$string$1"], "postprocess":  
        (data) => {
            return [data[1]]
        }
        },
    {"name": "rowList$string$2", "symbols": [{"literal":")"}, {"literal":","}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "rowList", "symbols": [{"literal":"("}, "valueList", "rowList$string$2", "rowList"], "postprocess":  
        (data) => {
            const arr = [];
            arr.push(data[1])
            for (const el of data[3]) {
                arr.push(el)
            }
            return arr
        }
        },
    {"name": "valueList$subexpression$1$string$1", "symbols": [{"literal":","}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "valueList$subexpression$1", "symbols": ["valueList", "valueList$subexpression$1$string$1", "valueList"]},
    {"name": "valueList", "symbols": ["valueList$subexpression$1"], "postprocess":  
        data => [data[0][0], data[0][2]].flat()
        },
    {"name": "valueList", "symbols": ["value"]},
    {"name": "value$ebnf$1", "symbols": [/[A-Za-z0-9_]/]},
    {"name": "value$ebnf$1", "symbols": ["value$ebnf$1", /[A-Za-z0-9_]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "value", "symbols": ["value$ebnf$1"], "postprocess":  
        (data) => data.flat().join('') 
        }
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
