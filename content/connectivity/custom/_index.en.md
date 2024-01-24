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

### Building an extractor

In the example given, we explain how to configure a custom extractor with the `Bar` class located in the `App\Class` namespace.

Here's a more detailed explanation:

```yaml
custom:
  extractor:
    use: 'App\Class\Bar' # This line specifies the extractor class you want to use.
    services:
      App\Class\Bar: ~ # Here, we declare the service associated with the Bar class with the syntax App\Class\Bar: ~. This simply indicates that we want to use the default parameters for this service.
```

For more details about service configurations, please visit the [declaring-services](../../feature/services) documentation.

### Building a transformer

In the example given, we explain how to configure a custom extractor with the `Bar` class located in the `App\Class` namespace.

Here's a more detailed explanation:

```yaml
custom:
  transformer:
    use: 'App\Class\Bar' # This line specifies the extractor class you want to use.
    services:
      App\Class\Bar: # Here, we declare the service associated with the Bar class.
        factory: # This section indicates that the service must be created by calling the extract method of the App\Class\Bar class.
          class: App\Class\Bar
          method: extract
        arguments: # The arguments to be passed to the extract method. In this example, the @foo symbol indicates that the foo service should be injected as an argument. Make sure that the foo service is configured correctly elsewhere in your pipeline.
          - '@foo'
      foo: ~
```

For more details about service configurations, please visit the [declaring-services](../../feature/services) documentation.

### Building a loader

In the example given, we explain how to configure a custom extractor with the `Bar` class located in the `App\Class` namespace.

Here's a more detailed explanation:

```yaml
custom:
  loader:
    use: 'App\Class\Bar' # This line specifies the extractor class you want to use.
    services:
      App\Class\Bar: # Here, we declare the service associated with the Bar class.
        calls: # This section indicates that specific method calls must be made to the service instance.
          - withUsername: [ 'admin' ] # This means that a method call named withUsername must be made to the instance of the Bar class, with the username "admin" passed as an argument.
```

For more details about service configurations, please visit the [declaring-services](../../feature/services) documentation.
