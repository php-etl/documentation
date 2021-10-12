---
title: "Installation"
date: 2021-10-12T15:21:02+02:00
draft: false
type: "getting-started"
shortDescription: Getting started
---

# Getting Started

- [Requirements](#requirements)
- [Installation](#installation)
- [Create your micro-service](#create-your-micro-service)
    - [Explanation of configuration](#explanation-of-configuration)
- [Running the pipeline](#running-the-pipeline)
    
---

## Requirements

Before creating your first middleware application you must :

- [Install Composer](https://getcomposer.org/download/) version 2
- Install PHP 8.0 or higher
- A connection to an Akeneo API (minimum read mode)

## Installation

After creating a new blank project, open your console terminal and run these commands :

```shell
composer init
```

You must choose `dev` as the value for the `minimum-stability` option.

```shell
composer require php-etl/satellite
```

This command will add the `php-etl/satellite` package, that is the core of the middleware, to your composer.json.

Then, choose the plugin(s) you need from [all our plugins](../../connectivity).

```shell
composer require php-etl/akeneo-expression-language php-etl/akeneo-plugin
```

In this example, the command will add the following component packages to your composer.json :

- `php-etl/akeneo-expression-language` provide some config functions useful when working with Akeneo
- `php-etl/akeneo-plugin` is a Middleware plugin dedicated to Akeneo. It allow to connect and use the Akeneo Api


Finally, in your `composer.json` file, add the following lines :

```json
"config": {
    "bin-dir": "bin"
},
"scripts": {
    "post-install-cmd": [
        "Kiboko\\Component\\Satellite\\ComposerScripts::postInstall"
    ],
    "post-update-cmd": [
        "Kiboko\\Component\\Satellite\\ComposerScripts::postUpdate"
    ]
}
```

## Create your micro-service

Create a `src` folder in which you will add a new folder each time you want to create a microservice. 
In this new folder, create a yaml file that will contain your configuration.

In our case, we have created a `pipeline.yaml` file in the `src/pipeline-akeneo-to-csv/` folder which contains the 
following content :

<details>

```yaml
# src/pipeline-akeneo-to-csv/pipeline.yaml

satellite:

  filesystem:
    path: build

  composer:
    require:
      - "php-etl/pipeline:^0.3"
      - "php-etl/fast-map:^0.2"
      - "php-etl/csv-flow:^0.2"
      - "akeneo/api-php-client-ee"
      - "laminas/laminas-diactoros"
      - "php-http/guzzle7-adapter"

  pipeline:
    steps:
      - akeneo:
          enterprise: false
          extractor:
            type: attribute
            method: all
          client:
            api_url: 'api_url'
            client_id: 'client_id'
            secret: 'secret'
            username: 'username'
            password: 'password'
      - fastmap:
          map:
            - field: '[code]'
              expression: 'input["code"]'
            - field: '[type]'
              constant: 'input["type"]'
            - field: '[group]'
              expression: 'input["group"]'
      - csv:
          loader:
            file_path: 'attributes.csv'
            delimiter: ';'
            enclosure: '"'
            escape: '\'

```

</details>

In this example we extract every attribute ok Akeneo and export some informations into a csv file.

### Explanation of configuration

#### 1. The system declaration :
```yaml
satellite:

  filesystem:
    path: build
    
  composer:
    require:
      - "php-etl/pipeline:^0.3"
      - "php-etl/fast-map:^0.2"
      - "php-etl/csv-flow:^0.2"
      - "akeneo/api-php-client-ee"
      - "laminas/laminas-diactoros"
      - "php-http/guzzle7-adapter"
      
  pipeline:
    steps:
```

To understand the structure of the configuration go to the [Satellite documentation](../satellite).

#### 2. Steps 

In this pipeline , you have 3 steps.
The first one, allow you to extract every attribute of the Akeneo instance you are connected to
(you have to configure your credentials).
For more explication about this plugin, check the corresponding documentation page.

```yaml
  - fastmap:
      map:
        - field: '[code]'
          expression: 'input["code"]'
        - field: '[type]'
          constant: 'input["type"]'
        - field: '[group]'
          expression: 'input["group"]'
```

This step uses the fastmap plugin, like the Akeneo plugin, there is a dedicated documentation.
This step create associative array with key : code, type and group and fill row with values
corresponding to the data from the last step, in the input variable, so you access using the
[Symfony expression language syntax](https://symfony.com/doc/current/components/expression_language.html)
We will see later that you can add some functions in every step , and use them in `expression`.
If you want to see what is available in this step, you can use Postman and check the data returned by Akeneo.
Here, an attribute is represented like that:
<details>

```
{
  "_links": {
    "self": {
      "href": "https://myakeneo/api/rest/v1/attributes/accessoires"
    }
  },
  "code": "accessories",
  "type": "pim_catalog_text",
  "group": "marketing",
  "unique": false,
  "useable_as_grid_filter": false,
  "allowed_extensions": [],
  "metric_family": null,
  "default_metric_unit": null,
  "reference_data_name": null,
  "available_locales": [],
  "max_characters": null,
  "validation_rule": null,
  "validation_regexp": null,
  "wysiwyg_enabled": null,
  "number_min": null,
  "number_max": null,
  "decimals_allowed": null,
  "negative_allowed": null,
  "date_min": null,
  "date_max": null,
  "max_file_size": null,
  "minimum_input_length": null,
  "sort_order": 17,
  "localizable": true,
  "scopable": false,
  "labels": {
    "fr_FR": "Accessoires"
  },
  "auto_option_sorting": null,
  "default_value": null,
  "group_labels": {
    "fr_FR": "Marketing"
  }
}
```


</details>

And the last step, exporting the data into a csv file.

```yaml
- csv:
    loader:
        file_path: 'attributes.csv'
        delimiter: ';'
        enclosure: '"'
        escape: '\'
```

We create a `attributes.csv` file. The header is the key of the array of the last step (code, type, group).
And this step will fill data automatically.

## Running the pipeline

Once you have completed your configuration, open a console terminal and run these commands :

```shell
# php bin/satellite build --path-to-your-config-file
php bin/satellite build src/pipeline-akeneo-to-csv/pipeline.yaml
```

Warning: You must run this command every time you change your configuration. 

```shell
# php --path-to-the-generated-function-file
php src/pipeline-akeneo-to-csv/build/function.php
```

The first command will build your microservice and create a folder whose name is the value defined in the path of your
filesystem in which there is a generated function.php file.

The second command allows you to run your microservice. The execution of your microservice may take several minutes, 
so please wait until the execution is completed.
