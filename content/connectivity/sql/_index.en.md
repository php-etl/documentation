---
title: "SQL"
date: 2021-07-26T16:22:03+02:00
draft: false
type: "plugins"
description: "Write SQL queries"
---

# SQL Plugin

## What is it ?

The SQL plugin allows you to write your own SQL queries and use them into the [Pipeline](https://github.com/php-etl/pipeline)
stack.

SQL, Structured Query Language, is a language for manipulating databases.

## Installation

```shell
composer require php-etl/sql-plugin
```

## Usage

### Database connection
The SQL plugin uses the PDO extension and relies on its interface to access databases using
the `dsn`, `username` and `password` parameters.

This connection must be present in any case, whether it be when defining the extractor,
loader or lookup.

```yaml
sql:
  connection:
    dsn: 'mysql:host=127.0.0.1;port=3306;dbname=kiboko'
    username: username
    password: password
```

It is possible to specify options at the time of this connection using `options`. Currently, it is only possible to
specify if the database connection should be persistent.

```yaml
sql:
  connection:
  # ...
    options:
      persistent: true
```

### Building an extractor

In the configuration of your extractor, you must write your query avec l'option `query`.

```yaml
sql:
  extractor:
    query: 'SELECT * FROM table1'
  connection:
    dsn: 'mysql:host=127.0.0.1;port=3306;dbname=kiboko'
    username: username
    password: password
```

### Building a lookup

In some cases, you will need to perform lookups by joining data from input columns to columns in a reference dataset;
this is called a lookup.

In the configuration of your lookup, you must write your query avec l'option `query`.

The `merge` option allows you to add data to your dataset, in a sense merging your actual dataset with your new data.

The `map` option comes from the [FastMap](../../../connectivity/fast-map) plugin, feel free to read its documentation
to understand how to use it.

```yaml
sql:
  lookup:
    query: 'SELECT * FROM table2 WHERE bar = foo'
    merge:
      map:
        - field: '[options]'
          expression: 'lookup["name"]'
  connection:
    dsn: 'mysql:host=127.0.0.1;port=3306;dbname=kiboko'
    username: username
    password: password

```

### Building a ConditionalLookup

The conditional lookup is a lookup that takes conditions into account. Your lookup will be executed when each
condition is met.

About its configuration, you will find the same options as for the classic lookup, except that there is an additional
`condition` option.

```yaml
sql:
  lookup:
    conditional:
      - condition: '@=input["id"] > 2'
        query: 'SELECT * FROM foo WHERE value IS NOT NULL AND id <= ?'
        parameters:
          - key: 'identifier'
            value: '@=3'
        merge:
          map:
            - field: '[options]'
              expression: 'lookup["name"]'
  # ...
```

### Building a loader

In the configuration of your loader, you must write your query avec l'option `query`.

```yaml
sql:
  loader:
    query: 'INSERT INTO table1 VALUES (bar, foo, barfoo)'
  connection:
    dsn: 'mysql:host=127.0.0.1;port=3306;dbname=kiboko'
    username: username
    password: password

```

### Building a ConditionalLoader

The conditional loader is a loader that takes conditions into account. Your loader will be executed when each
condition is met.

About its configuration, you will find the same options as for the classic loader, except that there is an additional
`condition` option.

```yaml
sql:
  loader:
    conditional:
      - condition: '@=input["id"] > 2'
        query: 'SELECT * FROM foo WHERE value IS NOT NULL AND id <= ?'
        parameters:
          - key: 'identifier'
            value: '@=3'
  # ...
```

### Using a logger
The `logger` option has been set up so that you can use a logger directly in the Pipeline.
When using this option, you must specify the type of logger.

```yaml
sql:
  # ...
  logger:
    type: stderr
```

## Advanced Usage

### Using params in your queries

Thanks to the SQL plugin, it is possible to write your queries with parameters.

If you write a prepared statement using named parameters (`:param`), your parameter key in the configuration will be
the name of your parameter without the `:` :

```yaml
sql:
  loader:
    query: 'INSERT INTO table1 VALUES (:value1, :value2, :value3)'
    parameters:
      - key: value1
        value: '@=input["value1"]'
      - key: value2
        value: '@=input["value3"]'
      - key: value3
        value: '@=input["value3"]'
    # ... 
```

If you are using a prepared statement using interrogative markers (`?`), your parameter key in the
configuration will be its position (starting from 1) :

```yaml
sql:
  loader: 
    query: 'INSERT INTO table1 VALUES (?, ?, ?)'
    parameters:
      - key: 1
        value: '@=input["value1"]'
      - key: 2
        value: '@=input["value3"]'
      - key: 3
        value: '@=input["value3"]'
  # ... 
```

### Creating before and after queries

In some cases, you may need to run queries in order to best prepare for the execution of your pipeline.

#### Before queries
Before queries will be executed before performing the query written in the configuration. Often, these are
queries that set up the database.

```yaml
sql:
  before:
    queries:
      - 'CREATE TABLE foo (id INTEGER NOT NULL, value VARCHAR(255) NOT NULL)'
      - 'INSERT INTO foo (id, value) VALUES (1, "Lorem ipsum dolor")'
      - 'INSERT INTO foo (id, value) VALUES (2, "Sit amet consecutir")'
  # ...
```

#### After queries
After queries will be executed after performing the query written in the configuration. Often, these are
queries that clean up the database.

```yaml
sql:
  after:
    queries:
      - 'DROP TABLE foo'
  # ...
```
