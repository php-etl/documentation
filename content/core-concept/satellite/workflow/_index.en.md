---
title: "Workflow"
date: 2021-08-10T10:16:41+02:00
draft: false
weight: 3
---

- [What is it ?](#what-is-it-)
- [Installation](#installation)
- [Basic usage](#basic-usage)
- [Advanced usage](#advanced-usage)
  - [Using expression](#using-expressions)
  - [Using services](#using-services)
    
---

![Workflow schema](workflow.svg)

## What is it ?

This package allows you to create a micro-service that will be orchestrating more than one data pipeline.

## Installation

``` 
composer require php-etl/workflow
```

## Basic usage

To define your workflow, you need to specify the `jobs` you need, that is to say your different pipelines.
Please see the [Pipeline documentation](../pipeline) to know how a pipeline should be configured.

```yaml
workflow:
  jobs:
    - pipeline:
        # the first pipeline configuration
        # ...
    - pipeline:
        # the second pipeline configuration
        # ...
```

The `name` option allows you to name your job.

```yaml
workflow:
  jobs:
    - name: 'Pipeline 1'
      pipeline:
        # the pipeline configuration
        # ...
```

## Advanced usage

### Using expressions

It's possible to use expressions in your pipeline using the `expression_language` option. To use these expressions,
you need to use our customised Providers which provide the different expressions. For more information, please visit
the [detailed documentation](../../../feature/expression-language) of the language expressions.

```yaml
pipeline:
  expression_language:
    - 'Kiboko\Component\Satellite\ExpressionLanguage\Provider'
```

### Using services

You can use services in your pipeline in the same way as in a traditional Symfony application.

For more details, go to the [detailed services documentation](../../../feature/logger).

```yaml
pipeline:
  services:
    App\Service\Bar:
      arguments:
        - 'my-file.csv'
```
