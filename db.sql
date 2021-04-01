CREATE DATABASE todolist;

CREATE TABLE todos(
    position SERIAL PRIMARY KEY,
    text VARCHAR(240)
);