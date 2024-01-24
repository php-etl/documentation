---
title: "Zoho CRM"
date: 2023-06-07T15:00:02+02:00
draft: false
type: "plugins"
description: "Read from and write to a Zoho CRM."
weight: 5
---

- [What is it?](#what-is-it)
- [Installation](#installation)
- [Usage](#usage)
    - [Building a loader](#building-a-loader)
    - [Building a lookup](#building-a-lookup)
---

## What is it?

This package includes classes to load data into Zoho CRM, using a [custom connector](../custom).

## Installation

```shell
composer require php-etl/zoho-crm-flow:'*'
```

## Usage

### Building a loader
The package includes the following loader classes: `ContactLoader`, `DealLoader`, `OrderLoader`, `ProductLoader`.

```yaml
custom:
  loader:
    use: 'Kiboko\Component\Flow\ZohoCRM\ContactLoader'
    services:
      Kiboko\Component\Flow\ZohoCRM\ContactLoader:
        public: true
        arguments:
          - '@Kiboko\Component\Flow\ZohoCRM\Client\Client'
          - '@Monolog\Logger'

      Kiboko\Component\Flow\ZohoCRM\Client\Client:
        arguments:
          - 'example-zoho.com' # URL of the website
          - '@Kiboko\Component\Flow\ZohoCRM\Client\AuthenticationMiddleware'
          - '@GuzzleHttp\Psr7\HttpFactory'
          - '@GuzzleHttp\Psr7\HttpFactory'
          - '@GuzzleHttp\Psr7\HttpFactory'
      Kiboko\Component\Flow\ZohoCRM\Client\AuthenticationMiddleware:
        arguments:
          - '@GuzzleHttp\Client'
          - '@GuzzleHttp\Psr7\HttpFactory'
          - '@GuzzleHttp\Psr7\HttpFactory'
          - 'accounts.example-zoho.com' # OAuth host
          - '200USADNWBAKRAFZASD' # Client id
          - 'e7c20hns0pxmzsa531hdt7c9' # Client secret
          - 'p2in89sjdgfnwoc3ehe8q00r' # Access token
          - 'n7g0a4xfqyemc61uertqplks' # Refresh token
      GuzzleHttp\Client: ~
      GuzzleHttp\Psr7\HttpFactory: ~

      Monolog\Logger:
        arguments:
          - 'app'
          - [ '@Monolog\Handler\StreamHandler' ]
      Monolog\Handler\StreamHandler:
        arguments:
          - 'var/dev.log' # Path to the log file
          - 300 # Log level. 300 for Warning, 200 for Info...
```

### Building a lookup
The package includes the following lookup classes, and each require a different criteria to search for corresponding entries.

| Entity to lookup | Class                                       | Search criteria |
|------------------|---------------------------------------------|-----------------|
| Contact          | Kiboko\Component\Flow\ZohoCRM\ContactLookup | Email           |
| Order            | Kiboko\Component\Flow\ZohoCRM\OrderLookup   | Subject + Store |
| Product          | Kiboko\Component\Flow\ZohoCRM\ProductLookup | Product code    |

```yaml
custom:
  transformer:
    use: 'Kiboko\Component\Flow\ZohoCRM\ContactLookup'
    services:
      Kiboko\Component\Flow\ZohoCRM\ContactLookup:
        public: true
        arguments:
          - '@Kiboko\Component\Flow\ZohoCRM\Client\Client'
          - '@Monolog\Logger'
          - '@Symfony\Component\Cache\Psr16Cache'
          - '@Acme\Custom\LookupMapper' # Your custom mapper class
          - 'customer_id' # Index of the search criteria, in your line.
                          # In the case of the ContactLookup, it should be an email.
                          # Here we temporarily store the customer email in this field.
                          # LookupMapper will then replace it with the actual ID.

      Kiboko\Component\Flow\ZohoCRM\Client\Client:
        arguments:
          - 'example-zoho.com' # URL of the website
          - '@Kiboko\Component\Flow\ZohoCRM\Client\AuthenticationMiddleware'
          - '@GuzzleHttp\Psr7\HttpFactory'
          - '@GuzzleHttp\Psr7\HttpFactory'
          - '@GuzzleHttp\Psr7\HttpFactory'
      Kiboko\Component\Flow\ZohoCRM\Client\AuthenticationMiddleware:
        arguments:
          - '@GuzzleHttp\Client'
          - '@GuzzleHttp\Psr7\HttpFactory'
          - '@GuzzleHttp\Psr7\HttpFactory'
          - 'accounts.example-zoho.com' # OAuth host
          - '200USADNWBAKRAFZASD' # Client id
          - 'e7c20hns0pxmzsa531hdt7c9' # Client secret
          - 'p2in89sjdgfnwoc3ehe8q00r' # Access token
          - 'n7g0a4xfqyemc61uertqplks' # Refresh token
      GuzzleHttp\Client: ~
      GuzzleHttp\Psr7\HttpFactory: ~

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
```

[Learn how to create your custom mapper class.](../custom/lookup_mapper)
