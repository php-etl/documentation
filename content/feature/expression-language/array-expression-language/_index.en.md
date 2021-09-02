---
title: "Array Expression Language"
date: 2021-08-12T12:08:50Z
draft: false
---

# Array Expression Language

- [What is it ?](#what-is-it-)
- [Installation](#installation)
- [Usage](#usage)
- [List of available functions](#list-of-available-functions)
    - [Generic functions](#generic-functions)
    - [Functions that can be used with reduce](#functions-that-can-be-used-with-reduce)
    - [Functions that can be used with map](#functions-that-can-be-used-with-map)

---

## What is it ? 

This package extends the ExpressionLanguage component of Symfony to compile and evaluate arrays with custom functions.

## Installation

```shell
composer require php-etl/array-expression-language
```

## Usage

To use the functions provided in this package, you need to add the `expression_language` key to your plugin configuration 
and use the `Kiboko\Component\ArrayExpressionLanguage\ArrayExpressionLanguageProvider` Provider.

```yaml
expression_language:
  - Kiboko\Component\ArrayExpressionLanguage\ArrayExpressionLanguageProvider
```

To determine that a value in your configuration will be a language expression, you must use the `@` annotation.

```yaml
foo: '@=count(input["myArray"])'
```

## List of available functions

### Generic functions

* `firstKey(array $array) : int|string|null` : Gets the first key of an array
* `lastKey(array $array) : int|string|null ` : Gets the last key of an array
* `keyExists(string|int $key, array $array) : bool` : Checks if the given key or index exists in the array
* `merge(array ...$arrays) : array` :  Merge one or more arrays
* `count(Countable|array $value) : int` : Count all elements in an array, or something in an object
* `combine(array $keys, array $values) : array` : Creates an array by using one array for keys and another for its values
* `iterableToArray(Traversable $iterator, bool $use_keys = true) : array` : Copy the iterator into an array
* `map(callable $callback, iterable $source) : iterable` : Applies the callback to the elements of the given iterable
* `reduce(callable $callback, iterable $source) : string` : Iteratively reduce the iterable to a single value using a callback function
* `list(int $length, mixed $value) : iterable` : Fill an array with values

### Functions that can be used with reduce
* `join(string $separator) : callable` : Join array elements with a string

### Functions that can be used with map

* `extraxctData(string $path) : callable` : Retrieves the value of a key in an array or the property of an object
