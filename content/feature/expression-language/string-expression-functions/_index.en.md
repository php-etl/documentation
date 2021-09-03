---
title: "String Expression functions"
date: 2021-08-12T12:08:50Z
draft: false
---

# Array Expression functions

- [What is it for?](#what-is-it-for)
- [Installation](#installation)
- [Usage](#usage)
- [List of available functions](#list-of-available-functions)
    - [Generic functions](#generic-functions)
    - [Functions that can be used with reduce](#functions-that-can-be-used-with-reduce)
    - [Functions that can be used with map](#functions-that-can-be-used-with-map)

---

## What is it for? 

This package extends the ExpressionLanguage component of Symfony to compile and evaluate arrays with custom functions.

## Installation

```shell
composer require php-etl/string-expression-language
```

## Usage

To use the functions provided in this package, you need to add the `expression_language` key to your plugin configuration 
and use the `Kiboko\Component\ArrayExpressionLanguage\ArrayExpressionLanguageProvider` Provider.

```yaml
expression_language:
  - Kiboko\Component\StringExpressionLanguage\StringExpressionLanguageProvider
```

To determine that a value in your configuration will be a language expression, you must use the `@` annotation.

```yaml
foo: '@=dateTime(input["updated_at"], "YYYY-MM-ddTHH:ii:ss", "Europe/Paris")'
```

## List of available functions

* `format( string format, mixed ...inputs ) : string` formats a string using the [sprintf](https://www.php.net/manual/en/function.sprintf.php) syntax
* `trim( string input ) : string` trims whitespaces from a string
* `replace( string search, string replace, string input ) : string` replaces the `search` values in the string by the `replace`
* `fileName( string path ) : string` extracts the file name from the path name
* `dateTime( string dateTime, string format, string timezone = 'UTC' ) : date` Creates a date object from a formatted date 
* `formatDate( date dateTime, string format ) : string` Transforms a date object into a formatted date string
