---
title: "Magento 2"
date: 2023-06-07T15:00:02+02:00
draft: false
type: "plugins"
description: "Read from and write to a Magento 2 site."
weight: 2
---

- [What is it?](#what-is-it)
- [Installation](#installation)
- [Usage](#usage)
    - [Building an extractor](#building-an-extractor)
    - [Building a lookup](#building-a-lookup)
---

> Magento 2 is an e-commerce platform.

## What is it?

This package includes classes to extract data from Magento, using a [custom connector](../custom).

## Installation

```shell
composer require "php-etl/magento2-flow:*"
```

This package includes classes and code that you will be able to use in your custom connector.

## Usage

### Building an extractor
The package includes the following extractor classes: `CustomerExtractor`, `InvoiceExtractor`, `OrderExtractor`, `ProductExtractor`.

Extractor classes take 4 arguments:

| name          | description                                                                                      | type                     | default value |
|---------------|--------------------------------------------------------------------------------------------------|--------------------------|---------------|
| logger        | the service that will log exceptions                                                             | \Psr\Log\LoggerInterface |               |
| client        | client to choose depending on the Magento version. Available clients are: V2_1, V2_2, V2_3, V2_4 | Client                   |               |
| page size     | (Optional) maximum amount of entities to retrieve in a single payload                            | int                      | 100           |
| filter groups | (Optional) groups of filters to use when searching for entities                                  | array                    | []            |

```yaml
custom:
  extractor:
    use: 'Kiboko\Component\Flow\Magento2\CustomerExtractor'
    services:
      Kiboko\Component\Flow\Magento2\CustomerExtractor:
        public: true
        arguments:
          - '@Monolog\Logger' # Logger
          - '@Kiboko\Magento\V2_1\Client' # Client
          - 500 # Page size
          - [] # Filter groups

      Kiboko\Magento\V2_1\Client:
        factory:
          class: 'Kiboko\Magento\V2_1\Client' # Client
          method: 'create'
        arguments:
          - '@Http\Client\Common\PluginClient'
      Http\Client\Common\PluginClient:
        arguments:
          - '@GuzzleHttp\Client'
          - [ '@Http\Client\Common\Plugin\BaseUriPlugin', '@Http\Client\Common\Plugin\AuthenticationPlugin' ]
      GuzzleHttp\Client: ~
      Http\Client\Common\Plugin\BaseUriPlugin:
        arguments:
          - '@GuzzleHttp\Psr7\Uri'
      Http\Client\Common\Plugin\AuthenticationPlugin:
        arguments:
          - '@Http\Message\Authentication\Bearer'
      GuzzleHttp\Psr7\Uri:
        arguments:
          - 'http://example-magento.com' # URL of the website
      Http\Message\Authentication\Bearer:
        arguments:
          - '12345abcde' # Access token

      Monolog\Logger:
        arguments:
          - 'app'
          - [ '@Monolog\Handler\StreamHandler' ]
      Monolog\Handler\StreamHandler:
        arguments:
          - 'var/dev.log' # Path to the log file
          - 300 # Log level. 300 for Warning, 200 for Info...
```

#### With filters
Filters and filter groups can be specified.
Filters in a group are chained with `OR`. Groups are chained with `AND`.

In this example we will search for customers that were updated after 1985 (`@date_filter_group`) and which have either the ID 17 or 46 (`@id_filter_group`).
```yaml
# ...
      Kiboko\Component\Flow\Magento2\CustomerExtractor:
        public: true
        arguments:
          - '@Monolog\Logger'
          - '@Kiboko\Magento\V2_1\Client'
          - 500
          - [ '@date_filter_group', '@id_filter_group' ]
          # updated_at >= 1985-10-26 11:25:00 AND (entity_id = 17 OR entity_id = 46)

# ...

      date_filter_group:
        class: Kiboko\Component\Flow\Magento2\FilterGroup
        calls:
          - withFilter: [ '@last_execution' ]
      last_execution:
        class: Kiboko\Component\Flow\Magento2\Filter
        arguments:
          - 'updated_at'
          - 'gteq'
          - '1985-10-26 11:25:00'
          
      id_filter_group:
        class: Kiboko\Component\Flow\Magento2\FilterGroup
        calls:
          - withFilter: [ '@id_to_check', '@other_id' ]
      id_to_check:
        class: Kiboko\Component\Flow\Magento2\Filter
        arguments:
          - 'entity_id'
          - 'eq'
          - '17'   
      other_id:
        class: Kiboko\Component\Flow\Magento2\Filter
        arguments:
          - 'entity_id'
          - 'eq'
          - '46'
# ...
```

#### With long filter
Filters are passed on the url.
But the most popular web browsers will not work with URLs over 2000 characters, and would return a 414 (Request-URI Too Long).
You can use the method withLongFilter to avoid this limitation and batch your request in multiple requests.

In this example we will search for specifics orders with a lot of data, we have 214 increment_id, and we use a withLongFilter with parameters '@order_filter' (like the withFilter method), but we have 2 additional parameters who defines an offset and a lenght.
The offset can help you to start the request at the chosen index, by default we have 0.
The lenght help you to define a batch lenght, by default we have 200.
Here we have defined an offset to 0 and a lenght to 150, it means we are starting the request to the first element and make multiple request with 150 items max.
```yaml
# ...
      order_filter_group:
        class: Kiboko\Component\Flow\Magento2\FilterGroup
        calls:
          - withLongFilter: [ '@order_filter' ]
      order_filter:
      class: Kiboko\Component\Flow\Magento2\FilterGroup
      calls:
        - withLongFilter: ['@order_increment_id', 0, 150]
      order_increment_id:
        class: Kiboko\Component\Flow\Magento2\Filter
        arguments:
          - 'increment_id'
          - 'in'
          - '000000526,4000000026,00000918,000001754,6000000123,4000000150,6000000185,000003798,6000000211,6000000230,000004664,000004950,6000000265,6000000293,000008038,000008842,6000000475,6000000494,6000000500,000012074,000012247,000012453,000012589,2000000159,000014903,6000000760,6000000776,000016545,4000000530,000016553,4000000531,000016567,000016593,000016623,000016631,000016636,000016642,000016646,000016649,000016662,000016684,000016687,000016690,000016700,000016706,000016731,000016743,000016751,000016755,000016770,000016771,000016775,000016782,000016805,000016820,000016826,000016832,000016836,000016837,000016839,000016841,000016842,000016843,000016845,000016849,000016851,000016852,000016858,000016859,000016862,000016863,000018513,6000000947,4000000604,000021935,000021938,000021944,000022086,000022515,000022582,000022613,000022682,000022998,000023200,000023201,000023202,000023203,6000001188,000023204,000023205,000023206,6000001189,000023207,000023208,000023209,000023210,000023211,000023212,000023213,000023216,000023218,000023219,000023220,000023221,6000001190,000023229,000023230,6000001191,000023232,000023236,6000001192,000023238,000023243,000023244,000023245,000023249,000023250,3000000086,23253,000023257,000023258,6000001194,6000001195,000023269,000023274,6000001196,000023287,000023292,000023294,000023297,000023299,000023300,000023312,000023319,000023320,000023322,000023324,000023325,000023326,000023327,000023328,000023331,6000001202,000023337,000023338,000023339,5000000362,000023340,000023341,000023342,000023343,000023345,000023346,000023347,000023349,000023350,000023352,000023355,000023360,000023376,000023396,000023451,000023465,000023466,000023469,000023470,000023472,5000000363,000023478,000023479,000023480,000023482,000023483,000023484,000023486,000023488,000023489,000023492,000023494,4000000654,000023498,000022925,000023506,000023507,000023510,6000001217,000023513,000023515,000023520,000023521,000023524,000023528,000023532,000023536,6000001316,000025518,000026204,6000001390,000026947,000026948,4000000734,000027673,000027772,000027936,000027990,6000001487,000028108,000028118,000028129,000028130,000028131,000028132,000028133,5000000445'
# ...
```

### Building a lookup
There is a lookup class for Categories, and one for product Attributes.

{{< tabs name="lookup">}}

{{< tab name="Category" codelang="yaml">}}
custom:
  transformer:
    use: 'Kiboko\Component\Flow\Magento2\CategoryLookup'
    services:
      Kiboko\Component\Flow\Magento2\CategoryLookup:
        public: true
        arguments:
          - '@Monolog\Logger'
          - '@Kiboko\Magento\V2_3\Client' # Client to use depending on the Magento version.
                                          # Available clients are:
                                          # V2_1, V2_2, V2_3, V2_4
          - '@Symfony\Component\Cache\Psr16Cache'
          - 'category.%s'
          - '@Acme\Custom\LookupMapper' # Your custom mapper class
          - 'category_name' # Index of the category ID, in your line.

      Kiboko\Magento\V2_3\Client:
        factory:
          class: 'Kiboko\Magento\V2_3\Client' # Client
          method: 'create'
        arguments:
          - '@Http\Client\Common\PluginClient'
      Http\Client\Common\PluginClient:
        arguments:
          - '@GuzzleHttp\Client'
          - [ '@Http\Client\Common\Plugin\BaseUriPlugin', '@Http\Client\Common\Plugin\AuthenticationPlugin' ]
      GuzzleHttp\Client: ~
      Http\Client\Common\Plugin\BaseUriPlugin:
        arguments:
          - '@GuzzleHttp\Psr7\Uri'
      Http\Client\Common\Plugin\AuthenticationPlugin:
        arguments:
          - '@Http\Message\Authentication\Bearer'
      GuzzleHttp\Psr7\Uri:
        arguments:
          - 'http://example-magento.com' # URL of the website
      Http\Message\Authentication\Bearer:
        arguments:
          - '12345abcde' # Access token

      Symfony\Component\Cache\Psr16Cache:
        arguments:
          - '@Symfony\Component\Cache\Adapter\ApcuAdapter'
      Symfony\Component\Cache\Adapter\ApcuAdapter: ~

      # Your custom mapper class
      Acme\Custom\LookupMapper: ~

      Monolog\Logger:
        arguments:
          - 'app'
          - [ '@Monolog\Handler\StreamHandler' ]
      Monolog\Handler\StreamHandler:
        arguments:
          - 'var/dev.log' # Path to the log file
          - 300 # Log level. 300 for Warning, 200 for Info...
{{< /tab >}}

{{< tab name="Product attribute" codelang="yaml">}}
custom:
  transformer:
    use: 'Kiboko\Component\Flow\Magento2\Lookup'
    services:
      Kiboko\Component\Flow\Magento2\Lookup:
        public: true
        arguments:
          - '@Monolog\Logger'
          - '@Kiboko\Magento\V2_3\Client' # Client to use depending on the Magento version.
                                          # Available clients are:
                                          # V2_1, V2_2, V2_3, V2_4
          - '@Symfony\Component\Cache\Psr16Cache'
          - 'collection.%s' # Cache key
          - '@Acme\Custom\LookupMapper' # Your custom mapper class
          - 'Collection' # Index of the attribute ID, in your line.
          - 'qv_collection' # Attribute code

      Kiboko\Magento\V2_3\Client:
        factory:
          class: 'Kiboko\Magento\V2_3\Client' # Client
          method: 'create'
        arguments:
          - '@Http\Client\Common\PluginClient'
      Http\Client\Common\PluginClient:
        arguments:
          - '@GuzzleHttp\Client'
          - [ '@Http\Client\Common\Plugin\BaseUriPlugin', '@Http\Client\Common\Plugin\AuthenticationPlugin' ]
      GuzzleHttp\Client: ~
      Http\Client\Common\Plugin\BaseUriPlugin:
        arguments:
          - '@GuzzleHttp\Psr7\Uri'
      Http\Client\Common\Plugin\AuthenticationPlugin:
        arguments:
          - '@Http\Message\Authentication\Bearer'
      GuzzleHttp\Psr7\Uri:
        arguments:
          - 'http://example-magento.com' # URL of the website
      Http\Message\Authentication\Bearer:
        arguments:
          - '12345abcde' # Access token of the website

      Symfony\Component\Cache\Psr16Cache:
        arguments:
          - '@Symfony\Component\Cache\Adapter\ApcuAdapter'
      Symfony\Component\Cache\Adapter\ApcuAdapter: ~

      # Your custom mapper class
      Acme\Custom\LookupMapper: ~

      Monolog\Logger:
        arguments:
          - 'app'
          - [ '@Monolog\Handler\StreamHandler' ]
      Monolog\Handler\StreamHandler:
        arguments:
          - 'var/dev.log' # Path to the log file
          - 300 # Log level. 300 for Warning, 200 for Info...
{{< /tab >}}

{{< /tabs >}}

[Learn how to create your custom mapper class.](../custom/lookup_mapper)
