---
title: "Satellite Expression Language"
date: 2021-08-12T12:49:51Z
draft: false
type: "feature"
---

# Satellite Expression Language

- [What is it ?](#what-is-it-)
- [Installation](#installation)
- [Usage](#usage)
- [List of available functions](#list-of-available-functions)

---

## What is it ?

This package extends the ExpressionLanguage component of Symfony to compile and evaluate file and environment variables.

## Installation

This package is already integrated into the Satellite package, so you can't require it with the composer.

## Usage

To use the functions provided in this package, you need to add the `expression_language` key to your plugin configuration
and use the `Kiboko\Component\Satellite\ExpressionLanguage\Provider` Provider.

```yaml
expression_language:
  - Kiboko\Component\Satellite\ExpressionLanguage\Provider
```

To determine that a value in your configuration will be a language expression, you must use the `@` annotation.

```yaml
foo: '@=env("MY_ENVIRONMENT_VARIABLE")'
```

## List of available functions

* `env(string $name) : string|false` : Gets the value of an environment variable
* `envAsFile(string $name) : string` : Create a file whose name is an environment variable
* `file(string $name) : string` : Create a file
* `base64Decode(string $name) : string|false` :  Decodes data encoded with Base64
* `temporaryFile(string $name) : resource` : Create a temporary file
