---
title: "Custom connector"
date: 2021-01-22T09:23:54+01:00
draft: false
type: "plugins"
icon: "ti-settings"
description: "Read transform and write files in any format"
weight: 10
---

- [What is it ?](#what-is-it-)
- [Installation](#installation)
- [Usage](#usage)
  - [Building an extractor](#building-an-extractor)
  - [Building a transformer](#building-a-transformer)
  - [Building a loader](#building-a-loader)
---

## Definition

The custom plugin allows you to use your own source code in your [pipelines](https://php-etl.github.io/documentation/components/pipeline/),
allowing you to connect tools that are not supported by the standard distribution.

## Installation

This plugin is already integrated into the Satellite package, so you can’t require it with the composer.

## Usage

Unlike other plugins, the configuration is the same whether it is an extractor, a transformer or a loader.

First you need to [determine your services](../../feature/services) in your pipeline or workflow and then use the `use` 
option which allows you to define which service to use.

### Building an extractor

```yaml
custom:
  extractor:
    use: 'App\Class\Bar'
```

### Building a transformer

```yaml
custom:
  transformer:
    use: 'App\Class\Bar'
```

### Building a loader

```yaml
custom:
  loader:
    use: 'App\Class\Bar'
```
