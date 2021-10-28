---
title: "Pipeline"
date: 2020-07-12T15:21:02+02:00
draft: false
type: "component"
logo: "pipeline"
description: "Data stream processing at high rate and low memory consuming"
weight: 1
---

{{< feature-state for_mw_version="0.1" state="alpha" >}}

- [What is it for?](#what-is-it-for)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Advanced Usage](#advanced-usage)
  - [Using expressions](#using-expressions)
  - [Using services](#using-services)
  - [Adding logger](#adding-logger)
  - [Adding rejection](#adding-rejection)
  - [Adding state](#adding-state)

---

> A pipeline is a series of processes, also called steps, that filter or transform data.
> The first process takes raw input data, uses it and then
> sends the results to the second process, and so on, ending with the final result produced by the last process in progress.

![Pipeline schema](pipeline.svg)

The different steps of our pipeline are `extract`, `transform` or `load` but the transformation step isn't mandatory.

> Tip : It's possible to use multiple transformation steps in a pipeline.

## What is it for?

This package allows you to create a micro-service that will be operating a data pipeline.

## Installation

```shell
composer require php-etl/pipeline
```

## Basic usage

To define your pipeline, you need to specify which steps will make up the pipeline using the `steps` option. Each step 
contains the configuration of a plugin. For more details, go to the documentation page of the plugin of your choice.

{{< tabs name="basic_definition" >}}

{{< tab name="YAML" codelang="yaml"  >}}
pipeline:
  steps:
    - csv:
        extractor:
          file_path: path/to/file/input.csv
          delimiter: ';'
          enclosure: '"'
          escape: '\\'
    - csv:
        loader:
          file_path: path/to/file/output.csv
          delimiter: ','
          enclosure: '"'
          escape: '\\'
{{< /tab >}}

{{< tab name="PHP" codelang="php"  >}}
<?php

use Kiboko\Component\Pipeline\PipelineRunner;
use Kiboko\Component\Pipeline\Pipeline;
use Kiboko\Component\Flow\Csv\Safe\Extractor;
use Kiboko\Component\Flow\Csv\Safe\Loader;

/** @var Psr\Log\LoggerInterface $logger */ 
$runner = new PipelineRunner();
$pipeline = (new Pipeline($runner))
    ->extract((new Extractor('path/to/file/input.csv'))->setLogger($logger))
    ->load(new Loader('path/to/file/output.csv', delimiter: ','))
    ->run();
{{< /tab >}}

{{< /tabs >}}

## Advanced usage

### Using expressions

It's possible to use expressions in your pipeline using the `expression_language` option. To use these expressions,
you need to use our customised Providers which provide the different expressions. For more information, please visit 
the [detailed documentation](../../feature/expression-language) of the language expressions.

```yaml
pipeline:
  expression_language:
    - 'Kiboko\Component\Satellite\ExpressionLanguage\Provider'
```

### Using services

You can use services in your pipeline in the same way as in a traditional Symfony application.

For more details, go to the [detailed services documentation](../../feature/logger).

```yaml
pipeline:
  services:
    App\Service\Bar:
      arguments:
        - 'my-file.csv'
```

### Adding logger

It's possible to add a `logger` at each step of the pipeline.

For more details, go to the [detailed logger documentation](../../feature/logger).

```yaml
satellite:
# ...
   pipeline:
      steps:
      - akeneo:
        # ...
        logger:
          channel: pipeline
          destinations:
            - elasticsearch:
                level: warning
                hosts:
                  - http://user:password@elasticsearch.example.com:9200
```

### Adding rejection

It's possible to add a `rejection` at each step of the pipeline.

For more details, go to the [detailed rejection documentation](../../feature/rejection)

```yaml
satellite:
# ...
   pipeline:
      steps:
      - akeneo:
        # ...
        rejection:
          destinations:
            - rabbitmq:
                host: rabbitmq.example.com
                vhost: /
                topic: foo.rejects
```

### Adding state

It's possible to add a `state` at each step of the pipeline.

For more details, go to the [detailed state documentation](../../feature/state)

```yaml
satellite:
# ...
   pipeline:
      steps:
      - akeneo:
        # ...
        state:
          destinations:
            - rabbitmq:
                host: rabbitmq.example.com
                vhost: /
                topic: foo.rejects
```
