---
title: "NL-JSON"
date: 2021-03-30T15:55:00+02:00
draft: false
type: "plugins"
icon: "ti-package"
description: "Read and write NL-JSON files through your pipelines"
---

{{< feature-state for_mw_version="0.1" state="alpha" >}}

# JSON Plugin

- [What is it ?](#what-is-it-)
- [Installation](#installation)
- [Usage](#usage)
    - [Building an extractor](#building-an-extractor)
    - [Building a loader](#building-a-loader)

---

> JSON (JavaScript Object Notation) is a lightweight format for data exchange.

## What is it for?

The JSON plugin aims at integrating the NL-JSON extractor and loader into the [Pipeline](https://github.com/php-etl/pipeline)
stack.

## Installation

In a Satellite project, add the NL-JSON plugin this way:

```shell
composer require php-etl/json-plugin
```

## Usage

### Building an extractor

To build an extractor, you need to specify the path of your file with the `file_path` option.

{{< tabs name="extractor" >}}

{{< tab name="YAML" codelang="yaml"  >}}

json:
  extractor:
    file_path: 'input.nljson'

{{< /tab >}}

{{< /tabs >}}

### Building a loader


To build a loader, you need to specify the path to your file with the `file_path` option.

{{< tabs name="loader" >}}

{{< tab name="YAML" codelang="yaml"  >}}

json:
  loader:
    file_path: 'output.nljson'

{{< /tab >}}

{{< /tabs >}}
