@builtin "number.ne"
main -> stringLiteral {% id %} 
| numberLiteral {% id %}

numberLiteral -> unsigned_decimal {% data => Number(data[0]) %}

stringLiteral -> alphaNumericStringLiteral {% data => data.flat().join('') %}
| numericalStringLiteral {% id %}

alphaNumericStringLiteral -> .:* [^0-9] .:* {% data => data.flat().join('') %}

numericalStringLiteral -> "\"" unsigned_decimal "\"" {% data => String(data[1]) %}