## Demven-DB

This is my Node.js-based SQL database pet-project.
It's a very simple database, and for now supports only SELECT queries. Doesn't support JOIN yet.
Should not be used in production.

### Usage
Supports only Node > v12

```shell
npm i
npm start
```

### SQL queries

```shell
? SQL > select id, name, done from tasks where id = 1;
queryResult [ [ 1, 'Buy food in supermarket', false ] ]

? SQL > select * from contacts;
queryResult [
  [ 1, 'Instagram', 'https://www.instagram.com/demven' ],
  [ 2, 'Facebook', 'https://www.facebook.com/salnikov.d' ],
  [ 3, 'Email', 'dmitry_salnikov@protonmail.com' ]
]

? SQL > select * from contacts where name = "Facebook";
queryResult [ [ 2, 'Facebook', 'https://www.facebook.com/dm.salnikov' ] ]
```

### Data
All tables are stored in .ddb format.

```
____COLUMNS____
id;name;done
____DATA_TYPES____
number;string;boolean
____VALUES____
1;Buy food in supermarket;false
2;Fix the car;false
3;Clean the apartment;true
```

All tables must be placed to /data directory.
Then when the DB starts – it will read these files and create Table objects for every file.
