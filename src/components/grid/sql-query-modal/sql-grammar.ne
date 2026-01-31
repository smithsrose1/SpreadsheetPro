main -> createTable " " insertInto {%
    data => {
        return {
            header : data[0],
            values : data[2]
        }
    }
%}

# Begin CREATE TABLE RULES

createTable -> "CREATE TABLE " tableName " (" primaryKeyDecl ", " variableDeclList ");" {%
    (data) => {
        return {
            primaryKey: data[3],
            columns: data[5]
        }
    }
%}

tableName -> varName {% (data) => 'tableName' %}

primaryKeyDecl -> variableDecl " PRIMARY KEY" {% (data) => data[0] %}

variableDeclList -> (variableDeclList ", " variableDeclList) {%
    (data) => {
        return [data[0][0], data[0][2]].flat()
    }
%}
| variableDecl

variableDecl -> varName " " dataType {% 
    (data) => {
        return {name: data[0], type: data[2]}
    }
%}

varName -> [A-Za-z0-9_]:+ {% (data) => data.flat().join('') %}

dataType -> ("INTEGER" | "TEXT") {% (data) => data.flat().join('') %}

# End CREATE TABLE RULES

# Begin INSERT INTO RULES
insertInto -> "INSERT INTO " tableName " VALUES " rowList {%
    (data) => {
        return data[3]
    }
%}
rowList -> "(" valueList ");" {% 
    (data) => {
        return [data[1]]
    }
%} | "(" valueList "), " rowList {% 
    (data) => {
        const arr = [];
        arr.push(data[1])
        for (const el of data[3]) {
            arr.push(el)
        }
        return arr
    }
%}
valueList -> (valueList ", " valueList) {% 
    data => [data[0][0], data[0][2]].flat()
%}
| value
value -> [A-Za-z0-9_]:+ {% 
    (data) => data.flat().join('') 
%}