---
title: "CSV"
date: 2021-01-19T10:02:02+02:00
draft: false
type: "plugins"
logo: "csv"
description: "Read and write CSV files in any format"
weight: 2
---

- [What is it ?](#what-is-it-)
- [Installation](#what-is-it-)
- [Usage](#what-is-it-)
    - [Building an extractor](#building-an-extractor)
    - [Building a loader](#building-a-loader)
    - [Additional options](#additional-options)
- [Advanced Usage](#advanced-usage)
    - [Splitting into several files](#splitting-into-several-files)
- [See more](#see-more)    
---

> CSV, Comma-Separated Values, is a spreadsheet-like computer file with values separated by commas.

## What is it ?

The CSV plugin aims at integrating the CSV reader and writer into the [Pipeline](../../core-concept/pipeline)
stack.

## Installation

```shell
composer require php-etl/csv-plugin:'*'
```

## Usage

### Building an extractor

To build an extractor, you need to specify the path of your file.

```yaml
csv:
  extractor:
    file_path: 'input.csv'
```

### Building a loader

To build a loader, you need to specify the path of your file.

```yaml
csv:
  loader:
    file_path: 'output.csv'
```

### Additional options

To build extractors or loaders, additional options exist and can be used :

- `delimiter` : sets the field separator
- `enclosure` : sets the text enclosure character
- `escape` : sets the escape character
- `safe_mode` : enable safe mode in the Pipeline
- `columns` : specify the name of the columns to retrieve or write

```yaml
csv:
  loader:
    file_path: 'output.csv'
    delimiter: '/'
    enclosure: '"'
    escape: '\\'
    safe_mode: true
    columns:
      - firstname
      - lastname
```

## Advanced Usage

### Splitting into several files

To limit the number of lines to be written to your csv file, you can specify the `max_lines` option.

```yaml
csv:
  expression_language:
    - 'Kiboko\Component\StringExpressionLanguage\StringExpressionLanguageProvider'
  loader:
    # ...
    max_lines: 20
    file_path: '@=env("OUTPUT_DIRECTORY")~format("output_%06d.csv",index)'
```

For the dynamic filename to work, you must install `php-etl/string-expression-language`:

```bash
composer require php-etl/string-expression-language
```

> Warning : this option is only available for loaders


### Using a nonstandard format 

In some cases, it is possible to generate a csv file that does not correspond to the standard format (for example by removing the enclosures).
For this we have added the `nonstandard` option which is a boolean.

```yaml
csv:
  loader:
    # ...
    nonstandard: true
```

> Notice : The `nonstandard` option cannot be used with the `enclosure` and `escape` options.
