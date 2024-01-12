---
title: "Sylius"
date: 2021-02-17T10:13:54+01:00
draft: false
type: "plugins"
logo: "sylius"
description: "Connect your Sylius e-commerce through pipelines"
weight: 10
---

{{< feature-state for_mw_version="0.1" state="alpha" >}}

- [What is it ?](#what-is-it-)
- [Installation](#installation)
- [Usage](#usage)
    - [Connecting to Sylius](#connecting-to-sylius)
    - [Building an extractor](#building-an-extractor)
    - [Building a loader](#building-a-loader)
- [Advanced usage](#advanced-usage)
    - [Filtering your search](#filtering-your-search)

---

> Sylius is a Headless E-commerce platform.

## What is it ?

The Sylius plugin will enable Sylius connectivity to the [Pipeline](../../core-concept/pipeline), in order to read and write from and to Sylius.

## Installation

```shell
composer require php-etl/sylius-plugin:'*'
```

## Usage

### Connecting to Sylius

To establish a connection to your Sylius API, you must specify its URL and some connection identifiers
(`client_id`, `secret`, `username`, `password`).

```yaml
sylius:
  # ...
  client:
    api_url: 'http://127.0.0.1:8001'
    client_id: '414yc7d9mnk044ko4wswgw80o8ssw80gssos488kk8ogss40ko'
    secret: '4k8ee6n44m4gkkg0coc8o4w4coscw0w4cg0wg8sc0wsk0sw8gs'
    username: 'api'
    password: 'sylius-api'
```

To retrieve these identifiers, go to the [official documentation](https://docs.sylius.com/en/1.7/api/index.html) of
Sylius.

### Building an extractor

In the configuration of your extractor, you must specify the type of table you will be working on
and which method you want to use to retrieve your data.

The list of available tables is quite long : `channels`, `countries`, `carts`, `currencies`, `customers`, `exchangeRates`,
`locales`, `orders`, `payments`, `paymentMethods`, `products`, `productAttributes`, `productAssociationTypes`, `productOptions`,
`promotions`, `shipments`, `shippingCategories`, `taxCategories`, `taxRates`, `taxons`, `users`, `zones`.

For each table, the following 3 methods are available :
- `all` : retrieves all data from a table
- `get` : retrieve a row from a table
- `listPerPage` : retrieves a set number of data from a table

```yaml
sylius:
  extractor:
    type: products
    method: all
  client:
    api_url: 'http://127.0.0.1:8001'
    client_id: '414yc7d9mnk044ko4wswgw80o8ssw80gssos488kk8ogss40ko'
    secret: '4k8ee6n44m4gkkg0coc8o4w4coscw0w4cg0wg8sc0wsk0sw8gs'
    username: 'api'
    password: 'sylius-api'
```

### Building a loader

In the configuration of your extractor, you must specify the type of table you are going to work on
and which method you want to use to insert your data.

The list of available tables is quite long : `channels`, `countries`, `carts`, `currencies`, `customers`, `exchangeRates`,
`locales`, `orders`, `payments`, `paymentMethods`, `products`, `productAttributes`, `productAssociationTypes`, `productOptions`,
`promotions`, `shipments`, `shippingCategories`, `taxCategories`, `taxRates`, `taxons`, `users`, `zones`.

For each table, the following 2 methods are available:

- `create` : insert a row into the table
- `delete` : delete a row from the table

```yaml
sylius:
  loader:
    type: products
    method: create
  client:
    api_url: 'http://127.0.0.1:8001'
    client_id: '414yc7d9mnk044ko4wswgw80o8ssw80gssos488kk8ogss40ko'
    secret: '4k8ee6n44m4gkkg0coc8o4w4coscw0w4cg0wg8sc0wsk0sw8gs'
    username: 'api'
    password: 'sylius-api'
```

## Advanced Usage

### Filtering your search

In some cases, you may only want to retrieve data that matches specific criteria.

When performing a search, you need to specify certain options :

- `field` : the field you want to search
- `operator` : the operator of your search
- `value` : the value of the field you want to search

Other options are available but are not essential in your search :

- `scope` : channel in which you search
- `locale` : code of the locale you are looking for

```yaml
sylius:
  extractor:
    # ...
    search:
      - { field: enabled, operator: '=', value: true }
```
