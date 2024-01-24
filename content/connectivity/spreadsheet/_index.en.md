---
title: "Spreadsheet"
date: 2021-03-30T15:50:22+02:00
draft: false
type: "plugins"
icon: "ti-layout-grid3"
description: "Read and write Excel or OpenDocument files"
weight: 8
---

{{< feature-state for_mw_version="0.1" state="alpha" >}}

- [What is it ?](#what-is-it-)
- [Installation](#installation)
- [Usage](#usage)
    - [Building an extractor](#building-an-extractor)
    - [Building a loader](#building-a-loader)
- [Advanced usage](#advanced-usage)
    - [Skip one or more lines](#skip-one-or-more-lines)
    - [Splitting into several files](#splitting-into-several-files)

---

> XLSX is the file format used by Microsoft Excel spreadsheets.

> ODS is the OpenDocument spreadsheet file format used by Libreoffice and OpenOffice.

## What is it for?

The Spreadsheet plugin aims at integrating spreadsheet file formats (XLSX, ODS and CSV) into the
[Pipeline](https://github.com/php-etl/pipeline) stack.

## Installation

In a Satellite project, add the spreadsheet plugin this way:

```shell
composer require php-etl/spreadsheet-plugin:'*'
```

## Usage

### Building an extractor

To build an extractor, you need to specify the path of your file, the type of extractor to build, and the name of the
sheet to read.

The different types of extractor supported are:
- `excel`
- `open_document`
- `csv`

{{< tabs name="extractor" >}}

{{< tab name="Excel" codelang="yaml"  >}}

spreadsheet:
  extractor:
    file_path: 'input.xlsx'
    excel: 
      sheet: 'sheet2'

{{< /tab >}}

{{< tab name="OpenDocument" codelang="yaml"  >}}

spreadsheet:
  extractor:
    file_path: 'input.ods'
    open_document: 
      sheet: 'sheet2'

{{< /tab >}}

{{< tab name="CSV" codelang="yaml"  >}}

spreadsheet:
  extractor:
    file_path: 'input.csv'
    csv: 
      delimiter: ','
      enclosure: '"'

{{< /tab >}}

{{< /tabs >}}

### Building a loader

To build a loader, you must specify the path of your file, the type of loader 
to build and the name of the sheet to write data into.

The different types of loader supported are:
- `excel`
- `open_document`
- `csv`

{{< tabs name="loader" >}}

{{< tab name="Excel" codelang="yaml"  >}}

spreadsheet:
  loader:
    file_path: 'output.xlsx'
    excel:
      sheet: 'sheet2'

{{< /tab >}}

{{< tab name="OpenDocument" codelang="yaml"  >}}

spreadsheet:
  loader:
    file_path: 'output.ods'
    open_document: 
      sheet: 'sheet2'

{{< /tab >}}

{{< tab name="CSV" codelang="yaml"  >}}

spreadsheet:
  loader:
    file_path: 'output.csv'
    csv: 
      delimiter: ','
      enclosure: '"'

{{< /tab >}}

{{< /tabs >}}

## Advanced usage

### Skip one or more lines

Your file may have a header of one or more lines, you must use the `skip_lines` option to get your pipeline to start
extracting from the right row.

{{< tabs name="skip_lines" >}}

{{< tab name="Excel" codelang="yaml"  >}}

spreadsheet:
  extractor: 
    excel:
      # ...
      skip_lines: 2


{{< /tab >}}

{{< tab name="OpenDocument" codelang="yaml"  >}}

spreadsheet:
  extractor: 
    open_document:
      # ...
      skip_lines: 2

{{< /tab >}}

{{< tab name="CSV" codelang="yaml"  >}}

spreadsheet:
  extractor: 
    csv:
      # ...
      skip_lines: 2

{{< /tab >}}

{{< /tabs >}}

> Note: This option is only available when building extractors

### Splitting into several files

To limit the number of lines you will write into the output files, you can specify the `max_lines` option.

{{< tabs name="max_lines" >}}

{{< tab name="Excel" codelang="yaml"  >}}

spreadsheet:
  loader:
    excel:
      # ...
      max_lines: 20

{{< /tab >}}

{{< tab name="OpenDocument" codelang="yaml"  >}}

spreadsheet:
  loader:
    open_document:
      # ...
      max_lines: 20

{{< /tab >}}

{{< tab name="CSV" codelang="yaml"  >}}

spreadsheet:
  loader:
    csv:
      # ...
      max_lines: 20

{{< /tab >}}

{{< /tabs >}}
> Note: this option is only available for loaders
