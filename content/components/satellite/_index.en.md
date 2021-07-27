---
title: "Satellite"
date: 2020-07-12T15:21:02+02:00
weight: 1
draft: false
type: "component"
logo: "lambda"
description: "Generated micro-services for data stream processing in the cloud"
---

{{< feature-state for_mw_version="0.1" state="alpha" >}}

### Definition of a Satellite

A satellite is a micro-service running in the cloud, packaged as a docker image.
It can be deployed in any Docker infrastructure, including Kubernetes clusters.

There are 4 types of runtimes, depending on your needs you will have to choose one of:
 * `http-api`: the micro-service will be operating an API, on which several URL routes can be registered. `http-api` is used for REST API.
 * `http-hook`: the micro-service will be operating an API on a single URL route. `http-hook` is used for webhooks. A webhook is a POST request sent to a URL. It's considered to be 
a means for one application to provide other applications with real-time information
 * `pipeline`: the micro-service will be operating a data pipeline, executed in the backend that can be executed as a cron job. For more information on pipelines, see [Pipeline](../pipeline/).
 * `batch`: the micro-service will be orchestrating more than one data pipeline, executed in the backend that can be executed as a cron job

### Building your own satellite

Make sure that you have a yaml file in your root folder which will contain all your configuration.  
Then, let's declare the docker image (or the file) on which we want to build our micro-service. 

#### Using Docker 
To use a docker image to build your micro-service, implement the `docker` key.

{{< tabs name="basic_definition" >}}

{{< tab name="YAML" codelang="yaml"  >}}
satellite:
  docker:
      from: php:8.0-cli-alpine
      workdir: /var/www/html
      tags:
        - kiboko/satellite:foo
        - kiboko/satellite:bar
#...
{{< /tab >}}

{{< tab name="PHP" codelang="php"  >}}
<?php

use Kiboko\Component\ETL\Satellite\Adapter\Docker;

$dockerfile = new Docker\Dockerfile(
    new Docker\Dockerfile\From('php:8.0-cli-alpine'),
    new Docker\Dockerfile\Workdir('/var/www/html/'),
);

$satellite = (new Docker\Satellite(
    'foo/satellite:bar',
    $dockerfile,
))->addTags("kiboko/satellite:foo", "kiboko/satellite:bar");
{{< /tab >}}

{{< /tabs >}}

#### Using system 
To use a system file to build your micro-service, implement the `filesystem` key.

{{< tabs name="basic_definition_system" >}}

{{< tab name="YAML" codelang="yaml"  >}}
satellite:
  filesystem:
    path: path/to/file/foo
#...
{{< /tab >}}

{{< tab name="PHP" codelang="php"  >}}

{{< /tab >}}

{{< /tabs >}}

Here, we chose to use the `php:8.0-cli-alpine` base image on which our code will be executed.
You could use any docker image of your choice, however you will need to have a PHP runtime 
available, in a compatible version: >=8.0 with the CLI SAPI.

#### Configure composer 

Next, as a second step, we need to declare the composer dependencies our microservice will have.
We will require them through composer, with a declarative manner.

{{< tabs name="basic_with_composer" >}}

{{< tab name="YAML" codelang="yaml"  >}}
satellite:
#...
  composer:
    autoload:
      psr4:
      - namespace: "Pipeline\\"
        paths: [""]
    require:
      - "php-etl/pipeline:^0.2"
      - "php-etl/fast-map:^0.2"
      - "php-etl/csv-flow:^0.1"
      - "akeneo/api-php-client-ee"
      - "laminas/laminas-diactoros"
      - "php-http/guzzle7-adapter"
{{< /tab >}}

{{< tab name="PHP" codelang="php"  >}}
$dockerfile->push(
    new Docker\PHP\Composer(),
    new Docker\PHP\ComposerInit(),
    new Docker\PHP\ComposerMinimumStability('dev'),
    new Docker\PHP\ComposerRequire('php-etl/pipeline:@dev')
    new Docker\PHP\ComposerRequire('php-etl/fast-map:@dev');
);
{{< /tab >}}

{{< /tabs >}}

You can add the `from_local` option in your configuration. This option copies an existing composer.json and composer.lock.

{{< tabs name="basic_with_composer_from_local" >}}

{{< tab name="YAML" codelang="yaml"  >}}
satellite:
#...
  composer:
    from_local: true
{{< /tab >}}

{{< /tabs >}}

#### Configure the runtime

Now that we have made our environment prepared for our satellite, we will declare 
the way we want our pipeline to handle our data flows.

{{< tabs name="dataflows" >}}

{{< tab name="YAML" codelang="yaml"  >}}
satellite:
#...
   pipeline:
      steps:
      - akeneo:
          enterprise: true
          extractor:
            type: productModel
            method: all
            search:
              - { field: enabled, operator: '=', value: true }
              - { field: completeness, operator: '>', value: 70, scope: ecommerce }
              - { field: completeness, operator: '<', value: 85, scope: ecommerce }
              - { field: categories, operator: IN, value: winter_collection }
              - { field: family, operator: IN, value: [camcorders, digital_cameras] }
          logger:
            type: 'stderr'
      - fastmap:
          map:
            - field: '[sku]'
              copy: '[sku]'
            - field: '[title]'
              expression: 'input["sku"] ~" | "~ input["name"]'
            - field: '[name]'
              copy: '[name]'
            - field: '[staticValue]'
              constant: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur mollis efficitur justo, id facilisis elit venenatis et. Sed fermentum posuere convallis. Phasellus lectus neque, bibendum sit amet enim imperdiet, dignissim blandit nisi. Donec nec neque nisi. Vivamus luctus facilisis nibh id rhoncus. Vestibulum eget facilisis tortor. Etiam at cursus enim, vitae mollis ex. Proin at velit at erat bibendum ultricies. Duis ut velit malesuada, placerat nisl a, ultrices tortor.'
            - field: '[foo]'
              expression: 'input'
              list:
                - field: '[bar]'
                  copy: '[bar]'
      - csv:
          loader:
            file_path: output.csv
            delimiter: ','
            enclosure: '"'
            escape: '\'
{{< /tab >}}

{{< tab name="PHP" codelang="php"  >}}
<?php

/** @var array $config */ 
$pipeline = new Runtime\Pipeline($config);
$pipeline->build();

{{< /tab >}}

{{< /tabs >}}

### Configuration formats

There are 2 ways to declare satellites :
* Use the [PHP objects](php-objects)
* Use the [YAML configuration Syntax](yaml-format)

### Executing the command
After configuring your config file, you can run the command which will allow you to create the Dockerfile or the file system :
```
php bin/console build
```

You can also specify the name of the file to be executed : 
```
php bin/console build `satellite.yaml`
```
