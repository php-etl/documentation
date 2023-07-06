---
title: "Custom"
date: 2023-07-06T15:54:13+02:00
draft: false
weight: 1
---

- [What is it ?](#what-is-it-)
- [Installation](#installation)
- [Usage](#usage)
    - [Building an extractor](#building-an-extractor)
    - [Building a transformer](#building-a-transformer)
    - [Building a loader](#building-a-loader)
---

## Definition

The custom connector allows you to use your own source code in your [actions](https://php-etl.github.io/documentation/core-concept/action/),
allowing you to connect tools that are not supported by the standard distribution.

## Installation

This feature is already integrated into the Satellite package, so you can’t require it with the composer.

## Usage

First you need to [determine your services](../../feature/services) in your pipeline or workflow and then use the `use`
option which allows you to define which service to use.

```yaml
    
```
