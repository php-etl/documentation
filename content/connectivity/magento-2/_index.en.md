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

```yaml
custom:
  extractor:
    use: 'Kiboko\Component\Flow\Magento2\CustomerExtractor'
    services:
      Kiboko\Component\Flow\Magento2\CustomerExtractor:
        public: true
        arguments:
          - '@Monolog\Logger'
          - '@Kiboko\Magento\V2_1\Client' # Client to use depending on the Magento version.
                                          # Available clients are:
                                          # V2_1, V2_2, V2_3, V2_4
          - 500 # Page size
          - [] # Optional filter groups

      Kiboko\Magento\V2_1\Client:
        factory:
          class: 'Kiboko\Magento\V2_1\Client'
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
```yaml
# ...
      Kiboko\Component\Flow\Magento2\CustomerExtractor:
        public: true
        arguments:
          - '@Monolog\Logger'
          - '@Kiboko\Magento\V2_1\Client'
          - 500
          - [ '@date_filter_group', '@id_filter_group' ]
          # updated_at >= 1985-10-26 11:25:00 AND (entity_id = 12 OR entity_id = 64)
          
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
          - withFilter: [ '@id_to_check', '@id_that_doesnt_work' ]
      id_to_check:
        class: Kiboko\Component\Flow\Magento2\Filter
        arguments:
          - 'entity_id'
          - 'eq'
          - '12'   
      id_that_doesnt_work:
        class: Kiboko\Component\Flow\Magento2\Filter
        arguments:
          - 'entity_id'
          - 'eq'
          - '64'
# ...
```

### Building a lookup
There is a lookup class for Categories, and one for product attributes.

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
          - '@Acme\Magento\LookupMapper' # Your custom mapper class
          - 'category_name' # Index of the search criteria.
                            # In the case of the CategoryLookup, it should be the category ID.
                            # Here we temporarily store the category id in this field.
                            # LookupMapper will then replace it with the actual name.

      Kiboko\Magento\V2_3\Client:
        factory:
          class: 'Kiboko\Magento\V2_3\Client'
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
      Acme\Magento\LookupMapper: ~

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
          - '@Acme\Magento\LookupMapper' # Your custom mapper class
          - 'Collection' # Index of the search criteria.
          - 'qv_collection' # attribute code

      Kiboko\Magento\V2_3\Client:
        factory:
          class: 'Kiboko\Magento\V2_3\Client'
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
      Acme\Magento\LookupMapper: ~

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

Next, you will need to create the `LookupMapper`, a class that implements `Kiboko\Contract\Mapping\CompiledMapperInterface`.
Its purpose is to merge the result of the lookup back into the line.

In the case of a CategoryLookup, the line has a field `category_name` that contains the category ID.
We want to replace that ID with the actual category name that the lookup has found.

`$output` is your line, and `$input` is the result of the Magento lookup.

```php
<?php

declare(strict_types=1);

namespace Acme\Magento;

use Kiboko\Contract\Mapping\CompiledMapperInterface;

class LookupMapper implements CompiledMapperInterface
{
    public function __invoke($input, $output = null)
    {
        $output['category_name'] = $input->getName();

        return $output;
    }
}
```
