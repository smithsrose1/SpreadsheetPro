CREATE TABLE Person (
    personId INT NOT NULL PRIMARY KEY,
    personName TEXT,
    hobbyId INT,
    FOREIGN KEY (hobbyId) REFERENCES Hobby(hobbyId)
);

CREATE TABLE Hobby (
    hobbyId INT NOT NULL PRIMARY KEY,
    hobbyName TEXT
);

INSERT INTO Person
VALUES 
(1, "Thomas", 3),
(2, "Rachel", 1),
(3, "Margaret", 2),
(4, "Ryan", 4);

INSERT INTO Hobby
VALUES 
(3, "Snowboarding"),
(1, "Cycling"),
(2, "Woodworking"),
(4, "Textile Arts");