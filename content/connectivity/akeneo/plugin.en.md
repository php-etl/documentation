---
title: "Akeneo plugin"
date: 2021-01-24T09:23:54+01:00
draft: false
description: "Akeneo API integration in satellites pipelines"
weight: 1
---

{{< feature-state for_mw_version="0.1" state="alpha" >}}

# Akeneo Plugin

- [What is it ?](#what-is-it-)
- [Installation](#installation)
- [Usage](#usage)
    - [Connecting to Akeneo](#connecting-to-akeneo)
    - [Building an extractor](#building-an-extractor)
    - [Building a lookup](#building-a-lookup)
    - [Building a conditional lookup](#building-a-conditional-lookup)
    - [Building a loader](#building-a-loader)
- [Advanced Usage](#advanced-usage)
    - [Filtering your search](#filtering-your-search)
    - [Using ExpressionLanguage](#using-expressionlanguage)
- [Available resources](#available-resources)
--- 
## What is it ?

The Akeneo plugin aims at integration the Akeneo PHP clients into the
[Pipeline](https://github.com/php-etl/pipeline) stack. This integration is
compatible with both [Akeneo Enterprise Edition client](https://github.com/akeneo/api-php-client-ee)
and the [Akeneo Community Edition client](https://github.com/akeneo/api-php-client).

## Installation

```shell
composer require php-etl/akeneo-plugin:'*'
```

## Usage

### Connecting to Akeneo

To establish a connection to your Akeneo PIM, you must specify its URL (`api_url`) and some connection identifiers
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

Warning: For the `api_url` option, you must remove the `/` at the end of your URL if there is one.

### Building an extractor

In the configuration of your extractor, you must specify the `type` of resource (see [available-resources](#available-resources)) 
you will be working on and which method you want to use to retrieve your data.

For each resource, the following 3 methods are available :
- `all` : retrieves all data from a table
- `get` : retrieve a row from a table
- `listPerPage` : retrieves a set number of data from a table

Depending on the resource and the method used, different options are available in the YAML configuration :

| Resource                             | Method      | Option(s) required            |
|--------------------------------------|-------------|-------------------------------|
| **All resources**                    | all         | _No options required_         |
| **All resources**                    | get         | identifier                    |
| **All resources**                    | listPerPage | _No options required_         |
| **attributeOption**                  | all         | attribute_code                |
| **attributeOption**                  | get         | attribute_code, code          |
| **assetManager**                     | all         | asset_family_code             |
| **assetManager**                     | get         | asset_family_code, asset_code |
| **productMediaFile, assetMediaFile** | get         | file                          |

```yaml
akeneo:
  extractor:
    type: product
    method: all
  client:
    api_url: 'http://demo.akeneo.com/'
    client_id: '414yc7d9mnk044ko4wswgw80o8ssw80gssos488kk8ogss40ko'
    secret: '4k8ee6n44m4gkkg0coc8o4w4coscw0w4cg0wg8sc0wsk0sw8gs'
    username: 'demo_9573'
    password: '516f3e3e5'
```

### Building a lookup

In some cases, you will need to perform some lookups to append to the data already read some complementary data coming from a secondary data source;
this is called a lookup.

In the configuration of your lookup, you must specify the `type` of resource you will be working on
and which `method` you want to use to retrieve your data.

You can retrieve the list of available resources [here](#available-resources).

The options available are the same as for the [loader](#building-a-loader).

The `merge` option allows you to add data to your dataset, in a sense merging your actual dataset with your new data.

The `map` option comes from the [FastMap](../fast-map) plugin, you may need to read its documentation
to understand how to use it properly.

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

### Building a conditional lookup

The conditional lookup is very similar to a regular lookup, at the difference that the lookup will be performed only if some conditions
are full-filled.

In this configuration, you will find options very similar to a standard lookup, difference being on 2 new levels of encapsulation, one of them containing the condition.

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
      - condition: '@=(input["type"] in ["akeneo_reference_entity", "akeneo_reference_entity_collection"])'
        type: referenceEntityRecord
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

In the configuration of your loader, you must specify the `type` of resource (see [available-resources](#available-resources)) 
you are going to write and which `method` you want to use to insert your data.

For each resource, the following 4 methods are available :

- `create`: insert a new resource
- `upsert`: will try to update the resource, otherwise the resource will be created
- `upsertList`: will try to update a resources list, otherwise the resources will be created
- `delete`: delete a resource from the table

Depending on the resource and the method used, different options are available in the YAML configuration :

| Resource                           | Method     | Option(s) required                                 |
|------------------------------------|------------|----------------------------------------------------|
| **All resources**                  | upsert     | code                                               |
| **All resources**                  | upsertList | _No options required_                              |
| **referenceEntityRecord**          | upsert     | reference_entity, code                             |
| **referenceEntityRecord**          | upsertList | reference_entity                                   |
| **referenceEntityAttributeOption** | upsert     | reference_entity, reference_entity_attribute, code |
| **referenceEntityAttributeOption** | upsertList | reference_entity, reference_entity_attribute       |
| **attributeOption**                | upsert     | attribute_code, code                               |
| **attributeOption**                | upsertList | attribute_code                                     |

```yaml
akeneo:
  loader:
    type: products
    method: create
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

You may need to read the [filtering documentation of Akeneo API](https://api.akeneo.com/documentation/filter.html)
### Using ExpressionLanguage

The plugin takes into account the [ExpressionLanguage](https://symfony.com/doc/current/components/expression_language.html)
component provided by Symfony.

We have also provided [custom expression](expression-language) to use when mapping your data.

```yaml
akeneo:
  expression_language:
    - 'Kiboko\Component\ExpressionLanguage\Akeneo\AkeneoFilterProvider'
  # ...
```

## Available resources

| Resources                          | Akeneo's Edition(s)           |
|------------------------------------|-------------------------------|
| **product**                        | Community, Growth, Enterprise |
| **category**                       | Community, Growth, Enterprise |
| **attribute**                      | Community, Growth, Enterprise |
| **attributeOption**                | Community, Growth, Enterprise |
| **attributeGroup**                 | Community, Growth, Enterprise |
| **family**                         | Community, Growth, Enterprise |
| **productMediaFile**               | Community, Growth, Enterprise |
| **locale**                         | Community, Growth, Enterprise |
| **channel**                        | Community, Growth, Enterprise |
| **currency**                       | Community, Growth, Enterprise |
| **measureFamily**                  | Community, Growth, Enterprise |
| **associationType**                | Community, Growth, Enterprise |
| **familyVariant**                  | Community, Growth, Enterprise |
| **productModel**                   | Community, Growth, Enterprise |
| **publishedProduct**               | Enterprise                    |
| **productModelDraft**              | Enterprise                    |
| **productDraft**                   | Enterprise                    |
| **asset**                          | Enterprise                    |
| **assetCategory**                  | Enterprise                    |
| **assetTag**                       | Enterprise                    |
| **referenceEntityRecord**          | Enterprise                    |
| **referenceEntityAttribute**       | Enterprise                    |
| **referenceEntityAttributeOption** | Enterprise                    |
| **referenceEntity**                | Enterprise                    |
