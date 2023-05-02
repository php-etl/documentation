---
title: "Prestashop"
date: 2023-05-02T15:00:02+02:00
draft: false
type: "plugins"
description: "Read from and write to a PrestaShop site."
weight: 11
---

- [What is it?](#what-is-it)
- [Installation](#installation)
- [Usage](#usage)
    - [Building an extractor](#building-an-extractor)
    - [Building a loader](#building-a-loader)
---

> Prestashop is an e-commerce platform.
> Read more about its API's [resources](https://devdocs.prestashop-project.org/8/webservice/reference/#available-resources),
> [options](https://devdocs.prestashop-project.org/8/webservice/cheat-sheet/),
> and [how to open the API access.](https://devdocs.prestashop-project.org/1.7/webservice/tutorials/creating-access/)

## What is it?

The Prestashop plugin aims at connecting the Prestashop API to your [pipeline](https://github.com/php-etl/pipeline).

Currently the following resources are supported by the plugin: `categories`, `combinations`, `manufacturers`, `product_features`, `product_feature_values`, `product_options`, `product_option_values`, `products`, `shops`, `stock_availables`, `suppliers`, `tax_rule_groups`, `tax_rules`.

## Installation

```shell
composer require php-etl/prestashop-plugin
```

## Usage

### Building an extractor
{{< tabs name="extractor" >}}
{{< tab name="Example" codelang="yaml">}}
prestashop:
  client:
    url: 'https://prestashop.example.com'
    api_key: 'abc1234'
  extractor:
    type: 'products'
    method: 'all'
{{< /tab >}}

{{< tab name="Description" codelang="yaml">}}
prestashop:
  client:
    url: the domain of your Prestashop website.
    api_key: the access key to the API.
  extractor:
    type: the resource to retrieve.
    method: currently the only method available is 'all'.
{{< /tab >}}
{{< /tabs >}}

#### Optional parameters:

{{< tabs name="extractor_options" >}}
{{< tab name="Example" codelang="yaml">}}
  extractor:
# ...
    options:
      columns:
        - 'id'
        - 'product_type'
        - 'price'
      filters:
        id: '[1,10]'
      sorters:
        id: "ASC"
      id_shop: 1
      id_group_shop: 1
      price:
        my_price:
          product_attribute: 25
{{< /tab >}}

{{< tab name="Description" codelang="yaml">}}
  extractor:
# ...
    options:
      columns: returns only the fields specified.
               By default all the fields will be displayed.


      filters: filter the result based on a value, or a range of values.

      sorters: sorting fields and their direction.

      id_shop: id of the shop.
      id_group_shop: id of the shop group.
      price:
        my_price: display a custom field containing the price of the product.
          country|state|postcode|currency|group|quantity|product_attribute|decimals|use_tax|use_reduction|only_reduction|use_ecotax
{{< /tab >}}
{{< /tabs >}}

##### languages:

{{< tabs name="extractor_options_languages" >}}
{{< tab name="As a list of IDs" codelang="yaml">}}
  extractor:
# ...
    options:
      languages: [ 1, 2, 3 ]
{{< /tab >}}
{{< tab name="As a range" codelang="yaml">}}
  extractor:
# ...
    options:
      languages:
        from: 1
        to: 5
{{< /tab >}}
{{< tab name="Description" codelang="yaml">}}
  extractor:
# ...
    options:
      languages: id, list of ids or range of ids of the languages to retrieve.
{{< /tab >}}
{{< /tabs >}}

[Read the PrestaShop Documentation for more details.](https://devdocs.prestashop-project.org/8/webservice/tutorials/advanced-use/additional-list-parameters/)

### Building a loader
{{< tabs name="loader" >}}
{{< tab name="Example" codelang="yaml">}}
prestashop:
  client:
    url: 'https://prestashop.example.com'
    api_key: 'abc1234'
  loader:
    type: 'products'
    method: 'all'
{{< /tab >}}

{{< tab name="Description" codelang="yaml">}}
prestashop:
  client:
    url: the domain of your Prestashop website.
    api_key: the access key to the API.
  loader:
    type: the resource to write to.
    method: available methods are 'create', 'update', 'upsert'.
{{< /tab >}}
{{< /tabs >}}

#### Optional parameters:
{{< tabs name="loader_options" >}}
{{< tab name="Example" codelang="yaml">}}
  loader:
# ...
    options: 
      id_shop: 1
      id_group_shop: 1
{{< /tab >}}

{{< tab name="Description" codelang="yaml">}}
  loader:
# ...
    options: 
      id_shop: id of the shop.
      id_group_shop: id of the shop group.
{{< /tab >}}
{{< /tabs >}}

[Read the PrestaShop Documentation for more details.](https://devdocs.prestashop-project.org/8/webservice/tutorials/advanced-use/additional-list-parameters/)
