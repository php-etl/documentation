---
title: "Logs"
date: 2021-03-30T15:55:00+02:00
draft: false
type: "plugins"
icon: "ti-package"
description: "Print logs for your pipelines"
weight: 8
---

{{< feature-state for_mw_version="0.1" state="alpha" >}}

- [What is it ?](#what-is-it-)
- [Installation](#installation)
- [Usage](#usage)
    - [Disabling logging](#disabling-logging)
    - [Logging to STDERR](#logging-to-stderr)

---

## What is it for?

The Log plugin aims at integrating logging capabilities to the pipelines.

## Installation

In a Satellite project, add the Log plugin this way:

```shell
composer require php-etl/log-plugin
```

## Usage

### Disabling logging

{{< tabs name="extractor" >}}

{{< tab name="YAML" codelang="yaml"  >}}

logger:
  null: ~

{{< /tab >}}

{{< /tabs >}}

### Logging to STDERR

{{< tabs name="loader" >}}

{{< tab name="YAML" codelang="yaml"  >}}

logger:
  stderr: ~

{{< /tab >}}

{{< /tabs >}}
