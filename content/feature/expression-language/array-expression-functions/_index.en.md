---
title: "Array Expression Language"
date: 2021-08-12T12:08:50Z
draft: false
type: "feature"
---

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
foo: '@=map(input["attributes"], extractData("[fr_FR][data]"))'
```

## List of available functions

### Generic functions

* `firstKey( array input ) : int|string|null` Gets the first key of an array
* `lastKey( array input ) : int|string|null ` Gets the last key of an array
* `keyExists( string|int key, array input ) : bool` Checks if the given key or index exists in the array
* `merge( array|list ...inputs ) : array`  Merge one or more arrays
* `count( Countable|array input ) : int` Count all elements in an array, or something in an object
* `combine( list<int|string> keys, list<mixed> values ) : array` Creates an array by using one array for keys and another for its values
* `iterableToArray( Traversable iterator, bool useKeys = true ) : array` Copy the iterator into an array
* `map( callable callback, iterable input ) : iterable` Applies the callback to the elements of the given iterable
* `reduce( closure callback, iterable input ) : string` Iteratively reduce the iterable to a single value using a callback function
* `list( int length, mixed $value ) : iterable` Fill an array with values

### Closures that can be provided to reduce

* `join( string separator ) : closure` Join array elements with a string

### Closures that can be provided to map

* `extraxctData( string path ) : closure` Retrieves the value of a key in an array or the property of an object
