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