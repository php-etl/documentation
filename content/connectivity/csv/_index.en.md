---
title: "CSV"
date: 2021-01-19T10:02:02+02:00
draft: false
type: "plugins"
logo: "csv"
description: "Read and write CSV files in any format"
---

# CSV Plugin

## What is it ?

The CSV plugin aims at integrating the CSV reader and writer into the [Pipeline](https://github.com/php-etl/pipeline)
stack.

## Installation

```shell
composer require php-etl/csv-plugin
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

### Using a logger
The `logger` option has been set up so that you can use a logger directly in the Pipeline.
When using this option, you must specify the type of logger.

```yaml
csv:
  # ...
  logger:
    type: stderr
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

To limit the number of lines to be written to your excel, openDocument or csv file, you can specify the
`max_lines` option.

```yaml
spreadsheet:
  loader:
    file_path: 'input.xlsx'
    excel:
      # ...
      max_lines: 20
```

Warning : this option is only available for loaders

## See more

If you want to see complete configurations, please go to the [examples](/examples) folder.

## See also
* [php-etl/pipeline](https://github.com/php-etl/pipeline)
* [php-etl/fast-map](https://github.com/php-etl/fast-map)
* [php-etl/akeneo-expression-language](https://github.com/php-etl/akeneo-expression-language)
