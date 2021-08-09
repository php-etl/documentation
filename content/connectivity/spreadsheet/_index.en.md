---
title: "Spreadsheet"
date: 2021-03-30T15:50:22+02:00
draft: false
type: "plugins"
description: "Read and write Excel or OpenDocument files"
---

# Spreadsheet Plugin

> XLSX is the file format saved for Microsoft Excel spreadsheets.

> ODS is the file format saved for OpenDocument spreadsheets.

## What is it ?

The Spreadsheet plugin aims at integrating the spreadsheet (CSV, XLSX and ODS) reader and writer into the
[Pipeline](https://github.com/php-etl/pipeline) stack.

## Installation

```shell
composer require php-etl/spreadsheet-plugin
```

## Usage

The Spreadsheet plugin allows you to instantiate an extractor or loader for excel, opendocument and csv files.

### Building an  extractor
To build an extractor, you need to specify the path of your file, the type of extractor to build and the name of the
sheet to read.

The different types of extractor supported :
- `excel`
- `open_document`
- `csv`

```yaml
spreadsheet:
  extractor:
    file_path: 'input.xlsx'
    excel: # can be excel, open_document or csv
      sheet: 'sheet2'
```

Warning : CSV files don't use any sheet, so the `sheet` option is disabled but takes additional options `delimiter` and
`enclosure`.

### Building a loader
To build a loader, you must specify the path of your file, the type of loader to build and the name of the sheet to create.

The different types of loader supported :
- `excel`
- `open_document`
- `csv`

```yaml
spreadsheet:
  loader:
    file_path: 'input.xlsx'
    excel: # can be excel, open_document or csv
      sheet: 'sheet2'
```

Warning : CSV files do not use a sheet, so the `sheet` option is disabled but takes additional options `delimiter`,
`enclosure` and `encoding`.

## Advanced usage

### Skip one or more lines

Your file may have a header of one or more lines, you must use the `skip_lines` option to get your pipeline to start
extracting from the right row.

 ```yaml
spreadsheet:
  extractor: 
    excel:
      # ...
      skip_lines: 2
```

Warning : This option is only available when building extractors

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
