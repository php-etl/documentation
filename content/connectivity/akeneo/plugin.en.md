---
title: "Akeneo plugin"
date: 2021-01-24T09:23:54+01:00
draft: false
description: "Akeneo API integration in satellites pipelines"
---

{{< feature-state for_mw_version="0.1" state="alpha" >}}

# Akeneo Plugin

## What is it ?

The Akeneo plugin aims at integration the Akeneo PHP clients into the
[Pipeline](https://github.com/php-etl/pipeline) stack. This integration is
compatible with both [Akeneo Enterprise Edition client](https://github.com/akeneo/api-php-client-ee)
and the [Akeneo Community Edition client](https://github.com/akeneo/api-php-client).

## Installation

```shell
composer require php-etl/akeneo-plugin
```

## Usage

### Connecting to Akeneo

To establish a connection to your Akeneo PIM, you must specify its URL and some connection identifiers
(`client_id`, `secret`, `username`, `password`).

```yaml
akeneo:
  # ...
  client:
    api_url: 'http://demo.akeneo.com'
    client_id: '414yc7d9mnk044ko4wswgw80o8ssw80gssos488kk8ogss40ko'
    secret: '4k8ee6n44m4gkkg0coc8o4w4coscw0w4cg0wg8sc0wsk0sw8gs'
    username: 'demo_9573'
    password: '516f3e3e5'
```

To retrieve these identifiers, you need to add a
[connection](https://help.akeneo.com/pim/v4/updates/connections.html) in your Akeneo PIM.


### Using a logger

The `logger` option has been set up so that you can use a logger directly in the Pipeline.
When using this option, you must specify the type of logger.

```yaml
akeneo:
  # ...
  logger:
    type: stderr
```

### Using the enterprise version

The `enterprise` option allows you to use the enterprise version. By default, it's set to false.

```yaml
akeneo:
  enterprise: true
  # ...
```

### Building an extractor

In the configuration of your extractor, you must specify the type of table you will be working on
and which method you want to use to retrieve your data.

The list of available tables is quite long and depends on the version of your Akeneo (enterprise or community).

For a community version, you can choose between several types of tables : `product`, `category`, `attribute`,
`attributeOption`, `attributeGroup`, `family`, `productMediaFile`, `locale`, `channel`, `currency`, `measureFamily`,
`associationType`, `familyVariant`, `productModel`.

For an enterprise version, you will have in addition to the types present in the community version :
`publishedProduct`, `productModelDraft`, `productDraft`, `asset`, `assetCategory`, `assetTag`, `referenceEntityRecord`,
`referenceEntityAttribute`, `referenceEntityAttributeOption`, `referenceEntity`.

For each table, the following 3 methods are available :
- `all` : retrieves all data from a table
- `get` : retrieve a row from a table
- `listPerPage` : retrieves a set number of data from a table

```yaml
akeneo:
  extractor:
    type: product
    method: all
  logger:
    type: stderr
  client:
    api_url: 'http://demo.akeneo.com/'
    client_id: '414yc7d9mnk044ko4wswgw80o8ssw80gssos488kk8ogss40ko'
    secret: '4k8ee6n44m4gkkg0coc8o4w4coscw0w4cg0wg8sc0wsk0sw8gs'
    username: 'demo_9573'
    password: '516f3e3e5'
```

### Building a lookup

In some cases, you will need to perform lookups by joining data from input columns to columns in a reference dataset;
this is called a lookup.

In the configuration of your lookup, you must specify the type of table you will be working on
and which method you want to use to retrieve your data.

The list of available tables is quite long and depends on the version of your Akeneo (enterprise or community).
The options available are the same as for the [loader](#building-a-loader).

The `merge` option allows you to add data to your dataset, in a sense merging your actual dataset with your new data.

The `map` option comes from the [FastMap](../../../connectivity/fast-map) plugin, feel free to read its documentation
to understand how to use it.

```yaml
akeneo:
  lookup:
    type: product
    method: all
    merge:
      map:
        - field: '[options]'
          expression: 'lookup["code"]'
  client:
    api_url: 'http://demo.akeneo.com/'
    client_id: '414yc7d9mnk044ko4wswgw80o8ssw80gssos488kk8ogss40ko'
    secret: '4k8ee6n44m4gkkg0coc8o4w4coscw0w4cg0wg8sc0wsk0sw8gs'
    username: 'demo_9573'
    password: '516f3e3e5'
```

### Building a ConditionalLookup

The conditional lookup is a lookup that takes conditions into account. Your lookup will be executed when each
condition is met.

About its configuration, you will find the same options as for the classic lookup, except that there is an additional
`condition` option.

```yaml
akeneo:
  lookup:
    conditional:
      - condition: '@=(input["type"] in ["pim_catalog_simpleselect", "pim_catalog_multipleselect"])'
        type: attributeOption
        code: '@=input["code"]'
        method: listPerPage
        search:
          - { field: enabled, operator: '=', value: '@=input["code"]', scope: '@=input["code"]', locale: '@=input["fr_FR"]' }
        merge:
          map:
            - field: '[options]'
              expression: 'join("|", lookup["code"])'
  # ...
```

### Building a loader

In the configuration of your extractor, you must specify the type of table you are going to work on
and which method you want to use to insert your data.

The list of available tables is quite long et dépend de la version de votre Akeneo (enterprise ou community).

For a community version, you can choose between several types of tables: `product`, `category`, `attribute`,
`attributeOption`, `attributeGroup`, `family`, `productMediaFile`, `locale`, `channel`, `currency`, `measureFamily`,
`associationType`, `familyVariant`, `productModel`.

For an enterprise version, you will have in addition to the types present in the community version : `publishedProduct`,
`productModelDraft`, `productDraft`, `asset`, `assetCategory`, `assetTag`, `referenceEntityRecord`, `referenceEntityAttribute`,
`referenceEntityAttributeOption`, `referenceEntity`.

For each table, the following 4 methods are available :

- `create` : insert a row into the table
- `upsert` : insert or update (if it already exists) a row into the table
- `upsertList` : insert or update a list of data
- `delete` : delete a row from the table

```yaml
akeneo:
  loader:
    type: products
    method: create
  logger:
    type: stderr
  client:
    api_url: 'http://demo.akeneo.com/'
    client_id: '414yc7d9mnk044ko4wswgw80o8ssw80gssos488kk8ogss40ko'
    secret: '4k8ee6n44m4gkkg0coc8o4w4coscw0w4cg0wg8sc0wsk0sw8gs'
    username: 'demo_9573'
    password: '516f3e3e5'
```

## Advanced Usage

### Filtering your search

In some cases, you may only want to retrieve data that matches specific criteria.

When performing a search, you need to specify certain options :

- `field` : the field you want to search
- `operator` : the operator of your search
- `value` : the value of the field you want to search

Other options are available but are not essential in your search :

- `scope` : scope in which you search
- `locale` : code of the locale you are looking for


```yaml
akeneo:
  extractor:
    # ...
    search:
      - { field: enabled, operator: '=', value: true }
      - { field: completeness, operator: '>', value: 70, scope: ecommerce }
```

### Using ExpressionLanguage

The plugin takes into account the [ExpressionLanguage](https://symfony.com/doc/current/components/expression_language.html)
component provided by Symfony.

We have also provided [custom expression](../../akeneo/expression-language) to use when mapping your data.

```yaml
akeneo:
  expression_language:
    - 'Kiboko\Component\ExpressionLanguage\Akeneo\AkeneoFilterProvider'
  # ...
```
