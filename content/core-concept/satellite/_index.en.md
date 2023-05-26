---
title: "Creating Satellite"
date: 2020-07-12T15:21:02+02:00
weight: 1
draft: false
type: "component"
logo: "lambda"
description: "Generated satellites for data stream processing in the cloud"
weight: 1
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

A satellite is the program that will execute your data flows. Depending on the type, it can be executed periodically or act as a microservice.

It can be deployed in a various list of infrastructure types, including LAMP stacks and container-aware stacks.

In the context of Gyroscops, a satellite can be a [Pipeline](#using-pipeline), a [Workflow](#using-workflow), an Action, an API Proxy or an HTTP hook

> Those programs are called Satellites to reflect the fact that they need to operate very close from the main application in order to enhance their data connectivity

![Satellite schema](satellite.svg)

## Building a satellite

The configuration of your satellite must be defined in a yaml file.

A single file can describe several satellites. Each satellite is identified by a code (`my_satellite` in the following example) and has a label.

{{< tabs name="basic_definition" >}}

{{< tab name="YAML" codelang="yaml"  >}}
version: '0.3'
satellites:
  my_satellite:
    label: 'My first satellite'
      #...
  {{< /tab >}}

{{< /tabs >}}

### Setting up the Adapter

Your next step, you should declare the docker image, or the file, on which you want to build the satellite.

If you are using [Gyroscops Cloud](https://gyroscops.com), you can ignore this step and directly go to [the next chapter](#configure-composer).

#### Using Docker 

To use a docker image to build your satellite, implement the `docker` key with its configuration options :

- `from` : determines the image on which your code will run
- `workdir` : define the working directory of a Docker container
- `tags` : determines the references to the Docker images

{{< tabs name="basic_definition_docker" >}}

{{< tab name="YAML" codelang="yaml"  >}}
version: '0.3'
satellites:
  my_satellite:
    label: 'My first Satellite'
    docker:
      from: php:8.0-cli-alpine
      workdir: /var/www/html
      tags:
        - acmeinc/my-satellite:latest
        - acmeinc/my-satellite:1.0.0
#...
{{< /tab >}}

{{< /tabs >}}

Here, we chose to use the `php:8.0-cli-alpine` base image on which our code will be executed.
You could use any docker image of your choice, however you will need to have a PHP runtime 
available, in a compatible version: >=8.0 with the CLI SAPI.

#### Using the file system

To use a system file to build your satellite, implement the `filesystem` key.

The filesystem key is accompanied by a `path` key which determines the path of the microservice to be built.

{{< tabs name="basic_definition_filesystem" >}}

{{< tab name="YAML" codelang="yaml"  >}}
version: '0.3'
satellites:
  my_satellite:
    label: 'My first Satellite'
    filesystem:
      path: ../build # path to the build directory, relative to the YAML file
#...
{{< /tab >}}

{{< /tabs >}}

### Configure composer 

#### Dependencies

It's possible to declare the composer dependencies that our microservice needs with the `composer` key.

> Tip : This part is not mandatory. If you do not configure it, these packages (`php-etl/pipeline-contracts`,
`php-etl/pipeline`, `php-etl/pipeline-console-runtime`, `php-etl/workflow-console-runtime`, 
`psr/log`, `monolog/monolog`, `symfony/console`, `symfony/dependency-injection`) will be installed automatically.

The `require` parameter allows to add all the packages, written as `package_name:version`, that your microservice needs.

{{< tabs name="basic_with_composer" >}}

{{< tab name="YAML" codelang="yaml"  >}}
version: '0.3'
satellites:
  my_satellite:
    label: 'My first Satellite'
    # ...
    composer:
      require:
        - "foo/bar:^0.2"
{{< /tab >}}

{{< /tabs >}}

#### Autoload

The `autoload` parameter is optional and allows you to configure your autoloader by specifying one or more namespaces and 
directories paths as if you were directly in the composer.json.

Every autoloading configuration shall be in the following format:

- `namespace`: namespace of your files
- `paths`: directories in which the files to be loaded are located

```yaml
version: '0.3'
satellites:
  my_satellite:
    label: 'My first Satellite'
    # ...
    composer:
      autoload:
        psr4:
          - namespace: "Pipeline\\"
            paths: [""]
``` 

#### From local

The `from_local` parameter is optional and copies local `composer.json`, `composer.lock` and `vendor` files into your 
microservice instead of creating them.

```yaml
version: '0.3'
satellites:
  my_satellite:
    label: 'My first Satellite'
    # ...
    composer:
      from_local: true
``` 

#### Repositories

The `repositories` parameter is optional. It allows you to use repositories that are not hosted on [packagist.org](https://packagist.org/).

Each repository should have the following configuration fields:

- `name`: the name of your repository
- `url`: the url of your repository
- `type`: the type of your repository (vcs, composer, package, etc...)


```yaml
version: '0.3'
satellites:
  my_satellite:
    label: 'My first Satellite'
    # ...
    composer:
      repositories:
        - { name: 'private-packagist', url: 'https://repo.packagist.com/package/', type: 'composer' }
``` 

#### Auth

The `auth` parameter is optional and allows you to use registries that are not public and must be accessed through an authentication.
The parameter is the way for you to tell composer how to authenticate to the registry server.

Each auth can have the following configuration fields:
- `url`: the url of your repository
- `token`: when you use a connection via token, you must use this field

```yaml
version: '0.3'
satellites:
  my_satellite:
    label: 'My first Satellite'
    # ...
    composer:
      auth:
      - { url: 'http-basic.kiboko.repo.packagist.com', token: '0fe8828b23371406295ca2b72634c0a3df2431c4787df0173ea051a0c639' }
``` 

> Notice : Currently, the only way to identify to a repository is to use tokens. Support for other authentication methods is in our backlog.

### Setting up the runtime

Now that we have made our environment prepared for our satellite, we will declare 
the way we want our pipeline to handle our data flows.

There are 4 types of runtimes, depending on your needs you will have to choose one of:
 * `http-api`: the satellite will be operating an API, on which several URL routes can be registered. `http-api` is used for REST API.
 * `http-hook`: the satellite will be operating an API on a single URL route. `http-hook` is used for webhooks. A webhook is a POST request sent to a URL. It's considered to be 
a means for one application to provide other applications with real-time information
 * `pipeline`: the satellite will be operating a data pipeline, executed in the backend that can be executed as a cron job.
 * `workflow`: the satellite will be orchestrating more than one data pipeline, executed in the backend that can be executed as a cron job

#### Using Pipeline

Please visit the [Pipeline documentation page](../pipeline) to find out how to set up your pipeline.

{{< tabs name="dataflows" >}}

{{< tab name="YAML" codelang="yaml"  >}}
version: '0.3'
satellites:
  my_satellite:
    label: 'My first Satellite'
    # ...
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
  my_satellite:
    label: 'My first Satellite'
    # ...
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
  my_second_satellite:
    label: 'My second Satellite'
    pipeline:
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

### Build your satellite locally

After declaring your satellite definition file, there is a command allowing you to generate the satellite program, either as a [Docker image](#using-docker) or [files in your filesystem](#using-the-file-system)

```shell
# Either use the satellite.yaml file in the current working directory
php bin/satellite build

# or specify the path to the yaml file
php bin/satellite build path/to/satellite.yaml
```

If you selected the [Docker image variant](#using-docker), you can now execute this image in the way your container-aware environment
If you are using Docker, you can do it with the following command: `docker run --rm acmeinc/my-satellite:latest my_satellite`

If you selected the [Filesystem variant](#using-the-file-system), you can now execute this Satellite with the `run:*` commands provided:
* For a Pipeline: `bin/satellite run:pipeline build/`
* For a Workflow: `bin/satellite run:workflow build/`

### Send your satellite to Gyroscops Cloud

If you are using Gyroscops Cloud, you can push your satellite configuration to the service.

You will need to authenticate to the service before sending your satellites.

```shell
bin/cloud login johndoe@example.com # authenticate as johndoe@example.com 
```

> The service may ask you to select your organization and your workspace.

```shell
# Either use the satellite.yaml file in the current working directory
php bin/cloud create

# or specify the path to the yaml file
php bin/cloud create path/to/satellite.yaml
```

Once done, you will be able to control your satellite execution through the Gyroscops Cloud interface.

## Configuration changes in the version of satellites

If you are using a configuration for satellite prior to version 0.3, you should migrate your files ot the updated version.
the new version `0.3` of the files definitions allows you to import files and create several satellites inside a single file. 

To use this new version, you need to specify the `version` field in your configuration at the root of the file: 

```yaml
# path/to/satellite.yaml
version: 0.3
```

Unlike the previous configuration, the `satellite` option becomes `satellites` and each satellite will be 
determined by an identifier of your choice.

```yaml
# path/to/satellite.yaml
version: 0.3
satellites:
  products: # this is the satellite key
    # ...
```

The rest of the configuration is similar to the previous version.

# Importing external configuration files

The major new feature of the version 0.3 is the ability to import external files in the Satellite configuration.

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

This way, you will be able to separate long and complex configurations into several smaller files.
