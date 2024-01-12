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
> Read more about its API [resources](https://devdocs.prestashop-project.org/8/webservice/reference/#available-resources),
> [options](https://devdocs.prestashop-project.org/8/webservice/cheat-sheet/),
> and [how to open the API access.](https://devdocs.prestashop-project.org/1.7/webservice/tutorials/creating-access/)

## What is it?

The Prestashop plugin aims at connecting a Prestashop instance through its API using a [pipeline](../../core-concept/pipeline).

Currently, the following resources are supported by the plugin: `categories`, `combinations`, `manufacturers`, `product_features`, `product_feature_values`, `product_options`, `product_option_values`, `products`, `shops`, `stock_availables`, `suppliers`, `tax_rule_groups`, `tax_rules`.

## Installation

```shell
composer require php-etl/prestashop-plugin:'*'
```

## Usage

### Building an extractor

```yaml
prestashop:
  client:
    url: 'https://prestashop.example.com' # the base URL of your Prestashop main website
    api_key: 'abc1234'                    # the access key to the API
  extractor:
    type: 'products'                      # the resource type you wish to retrieve
    method: 'all'                         # the retrieval method, currently it should always be 'all'.
```

#### Optional parameters:

```yaml
  extractor:
# ...
    options:
      columns:           # Specify the fields you wish to retrieve
        - 'id'           # by default all the fields will be retrieved, which can have
        - 'product_type' # an impact on the performance of your pipelines
        - 'price'
      filter:            # filter the result based on a value, or a range of values
        id: '[1,10]'
      sorters:           # sorting fields and their direction
        id: "ASC"
      id_shop: 1         # identifier of the shop containing the data you want to extract data from
      id_group_shop: 1
      price:             # list the price requests you want the API to calculate for you
        my_price:        # each element in this list is an individual price request you 
                         # will ask, that will be retrieved through an individual field
          quantity: 25
                  # the price request may contain any of the following parameters: 
                  # country, state, postcode, currency, group, quantity, product_attribute,
                  # decimals, use_tax, use_reduction, only_reduction, use_ecotax
                  # for more details, see https://devdocs.prestashop-project.org/8/webservice/tutorials/advanced-use/specific-price/
```

##### languages:

{{< tabs name="extractor_options_languages" >}}
{{< tab name="Example, with a list of identifiers" codelang="yaml">}}
  extractor:
# ...
    options:
      languages: [ 1, 2, 3 ] # list of ids of the languages to retrieve.
{{< /tab >}}
{{< tab name="Example, with a range of identifiers" codelang="yaml">}}
  extractor:
# ...
    options:
      languages: # a range of ids of the languages to retrieve.
        from: 1
        to: 5
{{< /tab >}}
{{< /tabs >}}

[Read the PrestaShop Documentation for more details.](https://devdocs.prestashop-project.org/8/webservice/tutorials/advanced-use/additional-list-parameters/)

### Building a loader
```yaml
prestashop:
  client:
    url: 'https://prestashop.example.com'
    api_key: 'abc1234'
  loader:
    type: 'products'   # the resource type to write to
    method: 'upsert'   # the method to use, available methods are 'create', 'update', 'upsert'.
                       # 'create' will only create products and fail if the product already exists
                       # 'update' will only update products and fail if the product does not exist
                       # 'upsert' will try to update if the product already exists or create the product if it does not exist
```

#### Optional parameters:
```yaml
  loader:
# ...
    options: 
      id_shop: 1       # id of the shop
      id_group_shop: 1 # id of the shop group
```

[Read the PrestaShop Documentation for more details.](https://devdocs.prestashop-project.org/8/webservice/tutorials/advanced-use/additional-list-parameters/)
