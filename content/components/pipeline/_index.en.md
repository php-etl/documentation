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

# Pipeline

- [Installation](#installation)
- [Usage](#usage)
    - [Simple usage](#simple-usage)
    - [Adding logger](#adding-logger)

---

> A pipeline is a series of processes, also called steps, that filter or transform data.
> The first process takes raw input data, uses it and then
> sends the results to the second process, and so on, ending with the final result produced by the last process in progress.

The steps of our pipeline are `extract`, `transform` or `load`.

## Installation

``` 
composer require php-etl/pipeline
```

## Usage

### Simple usage

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

### Adding logger

It's possible to add a `logger` at each step of the pipeline.

For more details, go to the [detailed logger documentation](../../connectivity/logger)

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
