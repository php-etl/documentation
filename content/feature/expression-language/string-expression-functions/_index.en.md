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

| Name                                                                                                                                                                                           | Description                                                                                                                              |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| format(`string` format, `mixed` ...inputs): `string`                                                                                                                                           | Formats a string using the [sprintf](https://www.php.net/manual/en/function.sprintf.php) syntax                                          | 
| trim(`string` input): `string`                                                                                                                                                                 | Trims whitespaces from a string                                                                                                          | 
| capitalize(`string` input): `string`                                                                                                                                                           | Makes a string's first character uppercase                                                                                               | 
| toLowerCase(`string` input): `string`                                                                                                                                                          | Makes a string lowercase                                                                                                                 | 
| search(`string` input, `int` offset, `?int` length = null): `string`                                                                                                                           | Returns part of a string                                                                                                                 | 
| toUpperCase(`string` input): `string`                                                                                                                                                          | Makes a string uppercase                                                                                                                 | 
| formatNumber(`float` num, `int` decimals = 0, `?string` decimal_separator = ".", `?string` thousands_separator = ","): `string`                                                                | Formats a number with grouped thousands                                                                                                  | 
| indexOf(`string` haystack, `string` needle, `int` offset = 0): `int`&vert;`false`                                                                                                              | Finds the position of the first occurrence of a substring in a string                                                                    | 
| replace(`string` search, `string` replace, `string` input): `string`                                                                                                                           | Replaces the `search` values in the string by the `replace`                                                                              | 
| stripHtml(`string` string, `array`&vert;`string`&vert;`null` allowed_tags = null): `string`                                                                                                    | Strips HTML and PHP tags from a string                                                                                                   | 
| decode(`string` string, `array`&vert;`string`&vert;`null` allowed_tags = null): `mixed`                                                                                                        | Decodes a JSON string                                                                                                                    | 
| replaceByExpression(`string`&vert;`array` pattern, `string`&vert;`array` replacement, `string`&vert;`array` subject, `int` limit = -1, `int` &count = null): `string`&vert;`array`&vert;`null` | Performs a regular expression search and replace                                                                                         | 
| capitalizeWords(`string` string, `string` separators = " \t\r\n\f\v"): `string`                                                                                                                | Uppercase’s the first character of each word in a string                                                                                 | 
| removeWhitespaces(`string` string, `string` characters = " \n\r\t\v\x00"): `string`                                                                                                            | Strips whitespace (or other characters) from the end of a string                                                                         | 
| splitIntoArray(`string` separator, `string` string): `array`                                                                                                                                   | Splits a string by a string                                                                                                              | 
| fileName(`string` path): `string`                                                                                                                                                              | Extracts the file name from the path name                                                                                                | 
| dateTime(`string` dateTime, `string` format, `string` timezone = 'UTC'): `date`                                                                                                                | Creates a date object from a formatted date                                                                                              | 
| formatDate(`date` dateTime, `string` format): `string`                                                                                                                                         | Transforms a date object into a formatted date string                                                                                    | 
| now(`string` timezone): `string`                                                                                                                                                               | Returns a new \DateTime object with the given timezone                                                                                   | 
| convertCharCode(`string` text, `string` sourceCharCode, `string` destinationCharCode): `string`                                                                                                | Converts a string from one character encoding to another                                                                                 | 
| asFloat(`string` value): `string`                                                                                                                                                              | Converts the value into a float number                                                                                                   | 
| asInteger(`string` value): `string`                                                                                                                                                            | Converts the value to an integer                                                                                                         | 
| asString(`string` value): `string`                                                                                                                                                             | Converts the value into a string                                                                                                         | 
| truncate(`string` input, `int` limit): `string`                                                                                                                                                | Truncates the value. If the limit is 10 and the input goes above that limit, 9 characters will be kept and `…` will be added at the end. | 
