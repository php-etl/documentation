---
title: "Creating Satellite"
date: 2020-07-12T15:21:02+02:00
weight: 1
draft: false
type: "component"
logo: "lambda"
description: "Generated micro-services for data stream processing in the cloud"
weight: 2
---

{{< feature-state for_mw_version="0.1" state="alpha" >}}

- [Building a satellite](#building-a-satellite)
    - [Setting up the Adapter](#setting-up-the-adapter)
        - [Using Docker](#using-docker)
        - [Using system](#using-system)
    - [Configure composer](#configure-composer)
    - [Setting up the runtime](#setting-up-the-runtime)
        - [Using Pipeline](#using-pipeline)
        - [Using Workflow](#using-workflow)
- [Configuration formats](#configuration-formats)
- [New version of satellites](#new-version-of-satellites)

---

> A satellite is a micro-service that can be executed as a cron job.
> It can be deployed in any Docker infrastructure (including Kubernetes clusters) or in any operating system.

![Satellite schema](satellite.svg)

## Building a satellite

The configuration of your satellite must be defined in a yaml file.

### Setting up the Adapter

First, you should declare the docker image, or the file, on which we want to build the micro-service.

#### Using Docker 
To use a docker image to build your micro-service, implement the `docker` key with its configuration options :

- `from` : determines the image on which your code will run
- `workdir` : define the working directory of a Docker container
- `tags` : determines the references to the Docker images

{{< tabs name="basic_definition_docker" >}}

{{< tab name="YAML" codelang="yaml"  >}}
version: '0.3'
satellites:
  - docker:
      from: php:8.0-cli-alpine
      workdir: /var/www/html
      tags:
        - kiboko/satellite:foo
        - kiboko/satellite:bar
#...
{{< /tab >}}

{{< /tabs >}}

Here, we chose to use the `php:8.0-cli-alpine` base image on which our code will be executed.
You could use any docker image of your choice, however you will need to have a PHP runtime 
available, in a compatible version: >=8.0 with the CLI SAPI.

#### Using system 
To use a system file to build your micro-service, implement the `filesystem` key.

The filesystem key is accompanied by a `path` key which determines the path of the microservice to be built.

{{< tabs name="basic_definition_filesystem" >}}

{{< tab name="YAML" codelang="yaml"  >}}
version: '0.3'
satellites:
   - filesystem:
    path: path/to/folder
#...
{{< /tab >}}

{{< /tabs >}}

### Configure composer 

In a second step, it's possible to declare the composer dependencies that our microservice needs with the `composer` key.

> Tip : This part is not mandatory. If you do not configure it, these packages (`php-etl/pipeline-contracts`,
`php-etl/pipeline`, `php-etl/pipeline-console-runtime`, `php-etl/workflow-console-runtime`, 
`psr/log`, `monolog/monolog`, `symfony/console`, `symfony/dependency-injection`) will be installed automatically.

The `require` option allows to add all the packages, write like `package_name:version`, that we need for your microservice.

{{< tabs name="basic_with_composer" >}}

{{< tab name="YAML" codelang="yaml"  >}}
version: '0.3'
satellites:
  - # ...
    composer:
      require:
        - "foo/bar:^0.2"
{{< /tab >}}

{{< /tabs >}}

The `autoload` option is optional and allows you to configure your autoloader by specifying one or more namespaces and 
and directories paths as if you were directly in the composer.json.

```yaml
version: '0.3'
satellites:
  - # ...
    composer:
      autoload:
        psr4:
          - namespace: "Pipeline\\"
            paths: [""]
``` 

The `from_local` option is optional and copies local `composer.json`, `composer.lock` and `vendor` files in your 
microservice instead creating them.

```yaml
version: '0.3'
satellites:
  - # ...
    composer:
      from_local: true
``` 

### Setting up the runtime

Now that we have made our environment prepared for our satellite, we will declare 
the way we want our pipeline to handle our data flows.

There are 4 types of runtimes, depending on your needs you will have to choose one of:
 * `http-api`: the micro-service will be operating an API, on which several URL routes can be registered. `http-api` is used for REST API. 
It also allows the use of a JSON Web Token (JWT) or Basic HTTP authentication.
 * `http-hook`: the micro-service will be operating an API on a single URL route. `http-hook` is used for webhooks. A webhook is a POST request sent to a URL. It's considered to be 
a means for one application to provide other applications with real-time information
 * `pipeline`: the micro-service will be operating a data pipeline, executed in the backend that can be executed as a cron job.
 * `workflow`: the micro-service will be orchestrating more than one data pipeline, executed in the backend that can be executed as a cron job
 
#### Using HTTP API
Please check [How to setup HTTP API](../http-api)

#### Using Pipeline

Please visit the [Pipeline documentation page](../pipeline) to find out how to set up your pipeline.

{{< tabs name="dataflows" >}}

{{< tab name="YAML" codelang="yaml"  >}}
version: '0.3'
satellites:
 - # ...
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

{{< /tabs >}}

#### Using Workflow

Please visit the [Workflow documentation page](../workflow) to find out how to set up your workflow.

```yaml
version: '0.3'
satellites:
  - # ...
    workflow:
      jobs:
        - name: 'Lorem ipsum dolor'
          pipeline:
            steps:
              - akeneo:
                  extractor:
                    type: category
                    method: all
                  client:
                    api_url: '@=env("AKENEO_URL")'
                    client_id: '@=env("AKENEO_CLIENT_ID")'
                    secret: '@=env("AKENEO_CLIENT_SECRET")'
                    username: '@=env("AKENEO_USERNAME")'
                    password: '@=env("AKENEO_PASSWORD")'
              - csv:
                  loader:
                    file_path: categories.csv
                    delimiter: ','
                    enclosure: '"'
                    escape: '\\'
    - pipeline:
        steps:
          - akeneo:
              extractor:
                type: product
                method: all
              client:
                api_url: '@=env("AKENEO_URL")'
                client_id: '@=env("AKENEO_CLIENT_ID")'
                secret: '@=env("AKENEO_CLIENT_SECRET")'
                username: '@=env("AKENEO_USERNAME")'
                password: '@=env("AKENEO_PASSWORD")'
          - csv:
              loader:
                file_path: products.csv
                delimiter: ','
                enclosure: '"'
                escape: '\'
```

### Configuration formats

There are 2 ways to declare satellites :
* Use the [YAML configuration Syntax](yaml-format)
* Use the [JSON configuration Syntax](json-format)

### Execute your micro-service

After configuring your config file, you can run the command which will allow you to create the Dockerfile or the file 
system. 

```shell
# will execute the satellite.yaml file located at the root of the project
php bin/satellite build

# specify the name of the file to be executed
php bin/satellite build `satellite.yaml`
```

This command will create a folder with a file `main.php` containing the code to execute.

You have to execute it with php command like this :

```shell
php path/to/folder/main.php
```

## New version of satellites

If you are using the previous configuration, you should use the recommended version to write your satellites.

However, it is possible to use version `0.3` which allows you to import files directly into your configuration. 

To use this new version, you need to specify the `version` option in your configuration file like this: 

```yaml
# path/to/satellite.yaml
version: 0.3
```

Unlike the previous configuration, the `satellite` option becomes `satellites` and each satellite will be 
determined by the key of your choice. Then you write your configuration as in the previous version.

```yaml
# path/to/satellite.yaml
version: 0.3
satellites:
  products: # this is the satellite key
    # ...
```

The major new feature of this version is the ability to import files directly in your configuration.

The import of files can be done at several levels in your config file: 

```yaml
imports: # full configuration from another file
  - { resource: 'path/to/another_config_file.yaml' }

version: '0.3'

satellites:
  imports: # configuration of a satellite
    - { resource: 'path/to/satellite.yaml' }
  product:
    label: 'Product'
    imports:  # configuration of the adapter
      - { resource: 'path/to/filesystem.yaml' }
    pipeline:
     imports: 
        # configuration of the pipeline
        - { resource: 'path/to/pipeline.yaml' }
```
