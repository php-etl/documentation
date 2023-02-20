---
title: "String Expression functions"
date: 2021-08-12T12:08:50Z
draft: false
type: "feature"
---

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

| Name | Description                                                                                     |
|------|-------------------------------------------------------------------------------------------------|
| format(string $format, mixed ...$inputs): string | Formats a string using the [sprintf](https://www.php.net/manual/en/function.sprintf.php) syntax | 

* `format( string $format, mixed ...$inputs ) : string` formats a string using the [sprintf](https://www.php.net/manual/en/function.sprintf.php) syntax
* `trim( string $input ) : string` trims whitespaces from a string
* `capitalize( string $input ) : string` makes a string's first character uppercase
* `toLowerCase( string $input ) : string` makes a string lowercase
* `search( string $input,  int $offset, ?int $length = null ) : string` returns part of a string
* `toUpperCase( string $input ) : string` makes a string uppercase
* `formatNumber(  float $num, int $decimals = 0, ?string $decimal_separator = ".", ?string $thousands_separator = "," ) : string` formats a number with grouped thousands
* `indexOf(  string $haystack, string $needle, int $offset = 0 ) : int|false` finds the position of the first occurrence of a substring in a string
* `replace( string $search, string $replace, string $input ) : string` replaces the `search` values in the string by the `replace`
* `stripHtml( string $string, array|string|null $allowed_tags = null ) : string` strips HTML and PHP tags from a string
* `decode( string $string, array|string|null $allowed_tags = null ) : mixed` decodes a JSON string
* `replaceByExpression( string|array $pattern, string|array $replacement, string|array $subject, int $limit = -1, int &$count = null ) : string|array|null` performs a regular expression search and replace
* `capitalizeWords( string $string, string $separators = " \t\r\n\f\v" ) : string` uppercase's the first character of each word in a string
* `removeWhitespaces( string $string, string $characters = " \n\r\t\v\x00" ) : string` strips whitespace (or other characters) from the end of a string
* `splitIntoArray( string $separator, string $string, int $limit = PHP_INT_MAX ) : array` splits a string by a string
* `fileName( string $path ) : string` extracts the file name from the path name
* `dateTime( string $dateTime, string $format, string $timezone = 'UTC' ) : date` Creates a date object from a formatted date 
* `formatDate( date $dateTime, string $format ) : string` Transforms a date object into a formatted date string
* `now( string $timezone ) : string` returns a new \DateTime object with the given timezone
