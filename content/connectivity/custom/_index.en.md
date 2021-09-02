---
title: "Custom connector"
date: 2021-01-22T09:23:54+01:00
draft: false
type: "plugins"
logo: "custom"
description: "Read transform and write files in any format
"
---

- [Definition](#definition)
- [Installation](#installation)
- [Definition](#usage)
  - [Reading from a custom file](#reading-from-a-custom-file)
  - [Transform to a custom file](#transform-to-a-custom-file)
  - [Writing to a custom file](#writing-to-a-custom-file)
- [Precisions](#precisions)

---

## Definition

The custom plugin allows you to use your own source code in your [pipelines](https://php-etl.github.io/documentation/components/pipeline/),
allowing you to connect tools that are not supported by the standard distribution.

## Installation

```
composer require php-etl/custom-plugin
```

## Usage

You have to create a yml file which contains all the plugin configuration.

Example of a config file.

### Reading from a custom file

{{< tabs name="basic_definition_read" >}}

{{< tab name="YAML" codelang="yaml"  >}}
satellite:
  pipeline:
    steps:
      - custom:
          extractor:
            services:
              App\Extractor:
                arguments:
                  $client: '@App\Http\Client'
                  $decrypt: '@App\Security\Decrypt'
              App\Http\Client: ~
              App\Security\Decrypt:
                arguments:
                  $cipher: '%cipher%'
            use: 'App\Extractor'
            parameters:
              cipher: '14588F18B77FA61EE237D2435A567'
{{< /tab >}}

{{< /tabs >}}

### Transform to a custom file

{{< tabs name="basic_definition_transform" >}}

{{< tab name="YAML" codelang="yaml"  >}}
satellite:
  pipeline:
    steps:
      - custom:
          transformer:
            services:
              App\Transformer: 
                arguments:
                  $logger: '@Psr\Log\LoggerInterface'
            use: 'App\Transformer'
{{< /tab >}}

{{< /tabs >}}

### Writing to a custom file

{{< tabs name="basic_definition_write" >}}

{{< tab name="YAML" codelang="yaml"  >}}
satellite:
  pipeline:
    steps:
      - custom:
          loader:
            services:
              App\Security\Encrypt:
                arguments:
                  $cipher: '%cipher%'
              App\Loader:
                arguments:
                  $client: '@App\Http\Client'
                  $encrypt: '@App\Security\Encrypt'
              App\Http\Client: ~
            use: 'App\Loader'
{{< /tab >}}

{{< /tabs >}}

## Precisions

* `services:`
  A service is a class that allows you to have a solid structure to organize functionalities,
  these services are stored in an easily accessible [container](https://symfony.com/doc/current/service_container.html#manually-wiring-arguments).
  The service container relies on the [DependencyInjection](https://symfony.com/doc/current/components/dependency_injection.html) injecting the dependencies needed by the service.
  You can define arguments to "request" a service from the container by specifying the type of an argument.
  Service formats can be xml, json, fastmap, csv or any custom format
  
* `use:`
  define the name of the service used.
  
* `parameters:`
  provides the parameters that the service uses,
  We can define parameters that act as a reusable configuration value.
  Parameters can be of: (string, boolean, array, binary parameters and PHP constants).







