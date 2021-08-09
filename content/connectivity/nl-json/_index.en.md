---
title: "NL-JSON"
date: 2021-03-30T15:55:00+02:00
draft: false
type: "plugins"
description: "Read and write JSON-LD files"
---

{{< feature-state for_mw_version="0.1" state="alpha" >}}

# JSON Plugin

> JSON (JavaScript Object Notation) is a lightweight format for data exchange.

## What is it ?

The JSON plugin aims at integrating the NL-JSON extractor and loader into the [Pipeline](https://github.com/php-etl/pipeline)
stack.

## Installation

```shell
composer require php-etl/json-plugin
```

## Usage

### Building an extractor

To build an extractor, you only need to specify the path to your file with the `file_path` option.

```yaml
json:
  extractor:
    file_path: 'input.jsonld'
```

### Building a loader


To build a loader, you only need to specify the path to your file with the `file_path` option.

```yaml
json:
  loader:
    file_path: 'output.jsonld'
```
