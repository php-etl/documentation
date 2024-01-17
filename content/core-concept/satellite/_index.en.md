---
title: "Satellites"
date: 2020-07-12T15:21:02+02:00
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
        - [Using the file system](#using-the-file-system)
    - [Configure Composer](#configure-composer)
    - [Setting up the runtime](#setting-up-the-runtime)
- [Configuration formats](#configuration-formats)
- Building
  - [Building locally](#build-your-satellite-locally)
- [Migration from version 0.2 and earlier](#migration-from-version-02-and-earlier)
- [Importing external files](#importing-external-configuration-files)

---

A satellite is the program that will execute your data flows. Depending on the type, it can be executed periodically or act as a microservice.

It can be deployed in a various list of infrastructure types, including LAMP stacks and container-aware stacks.

In the context of Gyroscops, a satellite can either be a [Pipeline](pipeline), a [Workflow](workflow) (containing multiple [Pipelines](pipeline) and Actions), a HTTP [Hook](http-hook) or an [API](http-api).

> Those programs are called Satellites to reflect the fact that they need to operate very close from the main application in order to enhance their data connectivity
> ![Satellite schema](satellite.svg)

## Building a satellite

The configuration of your satellite must be defined in a yaml file.

A single file can describe several satellites. Each satellite is identified by a code (`my_satellite` in the following example) and has a label.

```yaml
version: '0.3'
satellites:
  my_satellite:
    label: 'My first satellite'
      #...
```

### Setting up the Adapter

Next, you should declare the Docker image or the directory inside which you want to build the satellite.

If you are using [Gyroscops Cloud](https://gyroscops.com), you can ignore this step and directly go to [the next chapter](#configure-composer).

#### Using Docker 

To use a Docker image to build your satellite, implement the `docker` key with its configuration options :

- `from` : determines the image on which your code will run
- `workdir` : define the working directory of a Docker container
- `tags` : determines the references to the Docker images

```yaml
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
```

Here, we chose to use the `php:8.0-cli-alpine` base image on which our code will be executed.
You could use any Docker image of your choice, however you will need to have a PHP runtime 
available, in a compatible version: >=8.0 with the CLI SAPI.

#### Using the file system

To build your satellite inside your file system, implement the `filesystem` key.

The filesystem key is accompanied by a `path` key which determines the path of the microservice to be built.

```yaml
version: '0.3'
satellites:
  my_satellite:
    label: 'My first Satellite'
    filesystem:
      path: ../build # path to the build directory, relative to the YAML file
#...
```

#### Add custom code without a Composer package

Sometimes you need to use a custom class but you can't add a composer package, or creating this package is a disproportional effort. In this cas you have the `copy` options under the adapter.

Supported by [Docker](#using-docker-) and [Filesystem](#using-the-file-system) adapters.

The build will copy files you list. If you use a class with a namespace, you will need to add the namespace to the [autoloading](#autoload) specification.

```yaml
version: '0.3'
satellites:
  my_satellite:
    label: 'My first Satellite'
    filesystem:
      copy:
        - from: '../Foo/Bar'
          to: '../build/Foo/Bar'
      path: ../build # path to the build directory, relative to the YAML file
#...
```

```yaml
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
      copy:
        - from: '../Foo/Bar'
          to: './src/Foo/Bar'
#...
```

### Configure Composer

It's possible to declare the Composer dependencies, autoloads, repositories and auths that our microservice needs with the `composer` key.

If you instead wish to use your own `composer.json` to define the requirements and autoloads, set the option `from_local` to `true`, and jump to [the next chapter](#setting-up-the-runtime).
This will copy `composer.json`, and optionally `composer.lock`, if they are present next to your YAML configuration file:

```yaml
version: '0.3'
satellites:
  my_satellite:
    label: 'My first Satellite'
    # ...
    composer:
      from_local: true
```

#### Dependencies

The `require` parameter allows to add all the packages, written as `package_name:version`, that your microservice needs.

```yaml
version: '0.3'
satellites:
  my_satellite:
    label: 'My first Satellite'
    # ...
    composer:
      require:
        - "foo/bar:^0.2"
```

> Tip : This part is not mandatory. If you do not configure it, these packages (`php-etl/pipeline-contracts`,
`php-etl/pipeline`, `php-etl/pipeline-console-runtime`, `php-etl/workflow-console-runtime`, 
`psr/log`, `monolog/monolog`, `symfony/console`, `symfony/dependency-injection`) will be installed automatically.

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

There are 4 types of runtimes, you will have to choose one depending on your needs:
| name      | description | details |
|-|-|-|
| pipeline  | The satellite will be operating a data pipeline, executed in the backend that can be executed as a cron job. | [Pipeline documentation page](pipeline) |
| workflow  | The satellite will be orchestrating multiple pipelines, executed in the backend that can be executed as a cron job | [Workflow documentation page](workflow) |
| http_hook | The satellite will be operating an API on a single URL route. `http_hook` is used for webhooks. A webhook is a POST request sent to a URL. It's considered to be a mean for one application to provide other applications with real-time information | [HTTP Hook documentation page](http-hook) |
| http_api  | The satellite will be operating an API on multiple URL routes. `http_api` is used for REST API. | [HTTP API documentation page](http-api) |

{{< tabs name="runtimes" >}}

{{< tab name="pipeline" codelang="yaml"  >}}
version: '0.3'
satellites:
  my_satellite:
    label: 'My first Satellite'
    # ...
    pipeline:
      code: 'my-first-pipeline'
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
{{< /tab >}}

{{< tab name="workflow" codelang="yaml"  >}}
version: '0.3'
satellites:
  my_satellite:
    label: 'My first Satellite'
    # ...
    workflow:
      jobs:
        - pipeline:
            code: 'my-first-pipeline'
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
            code: 'my-second-pipeline'
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
{{< /tab >}}

{{< tab name="http_hook" codelang="yaml"  >}}
version: '0.3'
satellites:
  my_satellite:
    label: 'My first Satellite'
    # ...
    http_hook:
      path: /my-hook
      expression: 'input'
      pipeline:
        code: 'my-first-pipeline'
        steps:
          - fastmap:
              map:
                - field: '[sku]'
                  copy: '[product_name]'
                - field: '[id]'
                  copy: '[product_code]'
          - csv:
              loader:
                file_path: 'output.csv'
{{< /tab >}}

{{< tab name="http_api" codelang="yaml"  >}}
version: '0.3'
satellites:
  my_satellite:
    label: 'My first Satellite'
    # ...
    http_api:
      path: /my-api
      routes:
        - route: /category
          expression: 'input'
          pipeline:
            code: 'my-first-pipeline'
            steps:
              - fastmap:
                  map:
                    - field: '[code]'
                      copy: '[category_name]'
                    - field: '[id]'
                      copy: '[category_code]'
              - csv:
                  loader:
                    file_path: 'category.csv'
        - route: /product
          expression: 'input'
          pipeline:
            code: 'my-second-pipeline'
            steps:
              - fastmap:
                  map:
                    - field: '[sku]'
                      copy: '[product_name]'
                    - field: '[id]'
                      copy: '[product_code]'
              - csv:
                  loader:
                    file_path: 'product.csv'
{{< /tab >}}

{{< /tabs >}}

### Configuration formats

We are using YAML configuration format in all our example. However, you can similarly write your satellite configuration in the JSON format.

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

## Migration from version 0.2 and earlier

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

## Importing external configuration files

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
