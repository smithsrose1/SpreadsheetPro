# Entry point
formula -> "=" expression {%
    data => data[1]
%}

expression -> numericalExpression {% data => Number(data[0]) %} 
| stringConcat {% data => String(data[0]) %}

stringConcat -> stringConcat "+" stringConcat {%
    data => data[0] + data[2]
%}
| stringLiteral {% id %}

stringLiteral -> "\"" [^="]:+ "\"" {%
    data => data[1].join('')
%}


numericalExpression -> additionSubtraction {% id %}

# Addition and subtraction are the lowest precedence, so they appear at the top of the hierarchy
additionSubtraction -> additionSubtraction "+" multiplicationDivision {% 
    data => Number(data[0]) + Number(data[2])
%}
| additionSubtraction "-" multiplicationDivision {% 
    data => data[0] - data[2]
%}
| multiplicationDivision {% id %}

# Multiplication and division come next in precedence
multiplicationDivision -> multiplicationDivision "*" power {% 
    data => data[0] * data[2]
%}
| multiplicationDivision "/" power {% 
    data => data[0] / data[2]
%}
| power {% id %}

# Exponentiation has higher precedence than multiplication/division
power -> atom "^" power {% 
    data => Math.pow(data[0], data[2])
%}
| atom {% id %}

# Atom is the lowest level, which includes numbers and expressions in parentheses
atom -> "(" expression ")" {% 
    data => data[1]
%}
| number {% id %}
| reference {% id %}
| rangeExpression {% id %}

@builtin "number.ne"
number -> unsigned_decimal {% id %}

reference -> "REF(" cellName ")" {%
    data => {
        // dummy callback, replace with below.
        return data
    }
%}
####### CALLBACK: ################################
# Following is the callback for this rule in the
# compiled grammar JavaScript file.
##################################################
# // at top of JavaScript file:
# import { SpreadsheetModel } from ...

# // callback for reference rule
# data => {
#     const theAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
#     const column = Number(theAlphabet.indexOf(data[1][0])) + 1;
#     const row = Number(data[1][1]);
#     const content = SpreadsheetModel.getInstance().getCellContent(row, column)
#     return content
# }
##################################################

rangeExpression -> "SUM(" range ")" {% id %}
| "AVERAGE(" range ")" {% id %}

range -> cellName ".." cellName {% id %}

cellName -> letter number {%
    data => data
%}
letter -> [A-Z]:+ {%
    data => data.flat().join('')
%}
number -> [1-9] [0-9]:* {%
    data => data.flat().join('')
%}