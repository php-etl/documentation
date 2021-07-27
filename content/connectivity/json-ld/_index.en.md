---
title: "JSON-LD"
date: 2021-03-30T15:55:00+02:00
draft: false
type: "plugins"
description: "Read and write JSON-LD files"
---

{{< feature-state for_mw_version="0.1" state="alpha" >}}

# JSON Plugin

## What is it ?

The JSON plugin aims at integrating the JSON-LD extractor and loader into the [Pipeline](https://github.com/php-etl/pipeline)
stack.

## Installation

```shell
composer require php-etl/json-plugin
```

## Usage

### Building an extractor

```yaml
json:
  extractor:
    file_path: 'input.jsonld'
```

### Building a loader

```yaml
json:
  loader:
    file_path: 'output.jsonld'
```

### Using a logger
The `logger` option has been set up so that you can use a logger directly in the Pipeline.
When using this option, you must specify the type of logger.

```yaml
json:
  # ...
  logger:
    type: stderr
```
