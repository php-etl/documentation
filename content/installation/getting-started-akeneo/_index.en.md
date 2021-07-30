---
title: "Getting started with Akeneo"
date: 2020-07-12T15:21:02+02:00
draft: false
shortDescription: Getting started with Akeneo
---

# Getting Started

In this example we will install the middleware and connect it to an Akeneo instance using the Akeneo plugin. Free feel
to use any application as long as a plugin exists.

## Requirements

- composer
- php 8.0
- An Akeneo instance

## Install

If you want to start from scratch , create a composer project using the following command

- `composer init`

Then add the following components to your composer.json :

```
composer require php-etl/satellite php-etl/akeneo-expression-language php-etl/akeneo-plugin
```

- `php-etl/satellite` is the core of the middleware
- `php-etl/akeneo-expression-language` provide some config functions useful when working with Akeneo
- `php-etl/akeneo-plugin` is a Middleware plugin dedicated to Akeneo. It allow to connect and use the Akeneo Api

## Setup

- Create a directory containing a new created file `pipeline.yaml` or any yaml file.
- add the following content :


<details>

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
        logger:
          type: stderr
      - fastmap:
          map:
            - field: '[code]'
              expression: 'input["code"]'
            - field: '[type]'
              constant: 'input["type"]'
            - field: '[group]'
              expression: 'input["group"]'
        logger:
          type: stderr
      - csv:
          loader:
            file_path: 'attributes.csv'
            delimiter: ';'
            enclosure: '"'
            escape: '\'

```

</details>

In this example we extract every attribute ok Akeneo and export some informations into a csv file.

We will explain every section of this config :

### 1. The system declaration :
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

- Every pipeline config file start with satellite keyword.
- Then you specify the output folder. This directory contain the auto-generated php application.
- And then you have to specify some packages required for the auto-generated application to run.
In this example we have the minimal requirement to start the pipeline, extract data from akeneo,
transform and export the data into a csv file.
- And finally you specify each steps of the pipeline , see below.

### 2. Steps 

In this pipeline , you have 3 steps.
The first one, allow you to extract every attribute of the Akeneo instance you are connected to
(you have to configure your credentials).
For more explication about this plugin, check the corresponding documentation page.
As you can see, it sends logs to the php terminal using these lines in each step :

```yaml
logger:
    type: stderr
```
In fact you can send logs to Kibana using elasticsearch and obviously, a specific config.
Anyway, for this example, we will export logs to the terminal as it the easiest possible solution.

```yaml
  - fastmap:
      map:
        - field: '[code]'
          expression: 'input["code"]'
        - field: '[type]'
          constant: 'input["type"]'
        - field: '[group]'
          expression: 'input["group"]'
    logger:
      type: stderr
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

## Run the pipeline ! 

### Build

Once your configuration is ready :
- Start `php bin/satellite build path/to/pipeline.yaml`.
- Run the pipeline using `php path/to/build/function.php`

Wait until your csv is ready.
