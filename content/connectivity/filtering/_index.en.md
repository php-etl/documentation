---
title: "Filtering, drop or reject"
date: 2023-06-07T15:00:02+02:00
draft: false
type: "plugins"
description: "Drop or reject data based on conditions."
weight: 12
---

- [What is it?](#what-is-it)
- [Installation](#installation)
- [Usage](#usage)
    - [Dropping a line](#dropping-a-line)
    - [Rejecting a line](#rejecting-a-line)
---

## What is it?

The Filtering plugin can reject data, which prevents it from advancing in the pipeline, based on a condition.

## Installation

This plugin is already integrated into the Satellite package, so you can’t require it with composer.

## Usage

### Dropping a line

For example, this will ignore the line if the field "`identifier`" is missing, using the [array expression](../../feature/expression-language/array-expression-functions#generic-functions) `keyExists`:

```yaml
- filter:
    drop:
      - when: '@=!keyExists("identifier", input)'
```

### Rejecting a line

This is equivalent to dropping a line, but when paired with a [rejection configuration](../../feature/rejection) you will be able to log information about the dropped line.

This will ignore a line where the field "`image`" is empty, and store that data in some destination:

```yaml
- filter:
    reject:
      - when: '@=input["identifier"] === null'
    rejection:
      destinations:
        # ...
```
