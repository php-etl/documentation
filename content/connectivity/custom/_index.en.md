---
title: "Custom connector"
date: 2021-01-22T09:23:54+01:00
draft: false
type: "plugins"
icon: "ti-settings"
description: "Read transform and write files in any format"
weight: 3
---

- [What is it ?](#definition)
- [Installation](#installation)
- [Usage](#usage)
  - [Building an extractor](#building-an-extractor)
  - [Building a transformer](#building-a-transformer)
  - [Building a loader](#building-a-loader)
- [Usage examples](#usage-examples)
  - [Example of an extractor](#example-of-an-extractor)
  - [Example of a transformer](#example-of-a-transformer)
  - [Example of a loader](#example-of-a-loader)
---

## Definition

The custom plugin allows you to use your own source code in your [pipelines](https://php-etl.github.io/documentation/components/pipeline/),
allowing you to connect tools that are not supported by the standard distribution.

## Installation

This plugin is already integrated into the Satellite package, so you can’t require it with the composer.

## Usage

Unlike other plugins, the configuration is the same whether it is an extractor, a transformer or a loader.

First you need to [determine your services](../../feature/services) in your pipeline or workflow and then use the `use` 
option which allows you to define which service to use.

### Building an extractor

```yaml
custom:
  extractor:
    use: 'App\Class\Bar'
    services:
      App\Class\Bar: ~
```

### Building a transformer

```yaml
custom:
  transformer:
    use: 'App\Class\Bar'
    services:
      App\Class\Bar:
        factory: 
          class: App\Class\Bar
          method: extract
        arguments:
          - '@foo'
```

### Building a loader

```yaml
custom:
  loader:
    use: 'App\Class\Bar'
    services:
      App\Class\Bar:
        calls:
          - withUsername: [ 'admin' ]
```

## Usage examples

Some examples of pipeline with Magento to extract, FastMap to transform and ZohoCRM to load data

### Example of an extractor

```yaml
custom:
  extractor:
    use: 'App\Component\Flow\Magento2\CustomerExtractor'
    services:
      App\Component\Flow\Magento2\CustomerExtractor:
        arguments:
          - '@Monolog\Logger'
          - ['@firstname_filter_group_1', '@firstname_filter_group_2']
        public: true
      firstname_filter_group_1:
        class: App\Component\Flow\Magento2\FilterGroup
        calls:
          - withFilter: [ '@firstname_filter_1' ]
      firstname_filter_1:
        class: App\Component\Flow\Magento2\Filter
        arguments:
          - 'firstname'
          - 'nlike'
          - '%bm01.cc'
      firstname_filter_group_2:
        class: App\Component\Flow\Magento2\FilterGroup
        calls:
          - withFilter: [ '@firstname_filter_2' ]
      firstname_filter_2:
        class: App\Component\Flow\Magento2\Filter
        arguments:
          $field: 'firstname'
          $conditionType: 'nlike'
          $value: '%.xyz'
      Monolog\Logger:
        arguments:
          - 'app'
          - [ '@Monolog\Handler\StreamHandler' ]
      Monolog\Handler\StreamHandler:
        arguments:
          - 'var/dev.log'
          - 300
```

You can write the arguments of your service in 2 different ways.
You can list them with a '-' but you need to respect the order of the arguments in the constructor,
or you can simply name the arguments by their variable name in the constructor.

#### Filter class constructor :
```php
class Filter
{
  public function __construct(
      public string $field,
      public string $conditionType,
      public string $value,
  ) {
  }
}
```

### Example of a transformer
```yaml
custom:
  transformer:
    use: 'App\CachedAttributeLookup'
    services:
      PDO:
        arguments:
          - 'mysql:host=127.0.0.1;port=3306;dbname=lacelier'
          - 'user'
          - 'password'
      App\CachedAttributeLookup:
        arguments:
          - '@PDO'
          - 'SELECT * FROM color WHERE region=:region AND code=:code'
          - '@Cache\Adapter\Apcu\ApcuCachePool'
          - 'color'
          - '@App\ColorLookupMapper'
        public: true
      App\ColorLookupMapper: ~
      Cache\Adapter\Apcu\ApcuCachePool: ~
      Symfony\Component\Cache\Adapter\ApcuAdapter: ~
```

### Example of a loader
```yaml
custom:
  loader:
    use: 'App\Component\Flow\ZohoCRM\ContactLoader'
    services:
      App\Component\Flow\ZohoCRM\ContactLoader:
        arguments:
          - '@App\Component\Flow\ZohoCRM\Client\Client'
          - '@Monolog\Logger'
        public: true
      GuzzleHttp\Client: ~
      GuzzleHttp\Psr7\HttpFactory: ~
      App\Component\Flow\ZohoCRM\Client\AuthenticationMiddleware:
        arguments:
          - '@GuzzleHttp\Client'
          - '@GuzzleHttp\Psr7\HttpFactory'
          - '@GuzzleHttp\Psr7\HttpFactory'
          - '%env(ZOHO_OAUTH_HOST)%'
          - '%env(ZOHO_CLIENT_ID)%'
          - '%env(ZOHO_CLIENT_SECRET)%'
          - '%env(ZOHO_ACCESS_TOKEN)%'
          - '%env(ZOHO_REFRESH_TOKEN)%'
      App\Component\Flow\ZohoCRM\Client\Client:
        arguments:
          - '%env(ZOHO_BASE_HOST)%'
          - '@App\Component\Flow\ZohoCRM\Client\AuthenticationMiddleware'
          - '@GuzzleHttp\Psr7\HttpFactory'
          - '@GuzzleHttp\Psr7\HttpFactory'
          - '@GuzzleHttp\Psr7\HttpFactory'
      Monolog\Logger:
        arguments:
          - 'app'
          - [ '@Monolog\Handler\StreamHandler' ]
      Monolog\Handler\StreamHandler:
        arguments:
          - 'var/dev.log'
          - 300
```
