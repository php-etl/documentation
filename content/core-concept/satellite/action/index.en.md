---
title: "Action"
date: 2023-07-06T15:06:20+02:00
draft: false
weight: 4
---

{{< feature-state for_mw_version="0.1" state="alpha" >}}

- [What is it for?](#what-is-it-for)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Advanced Usage](#advanced-usage)
    - [Using expressions](#using-expressions)
    - [Adding logger](#adding-logger)
    - [Adding state](#adding-state)

---

> An action is a process that enables a task to be carried out before, during or at the end of the execution of a workflow.
> For example, an action can be used to retrieve or upload files to an SFTP server.

## What is it for?

This package provides a process capable of executing actions.

## Installation

```shell
composer require php-etl/action:'*'
```

## Basic usage

At present, actions can only be used within a workflow. It is therefore not currently possible to launch an action on its own.

```yaml
workflow:
  jobs:
    job-1:
      action: # ...
```

We've made sure that you can use your own actions.

You need to implement the `Kiboko\Contract\Action\Interface` and in the `execute` method, you simply write your script.

```php
<?php 

namespace App;

final readonly class MyCustomAction implements ActionInterface
{
    public function execute(): void
    {
        // write your script here
    }
}
```

Once you've written your action, you need to use it in your Satellite using the custom action plugin like this.

```yaml
workflow:
  jobs:
    job-1:
      action:
        custom:
          use: 'App\MyCustomAction'
          services:
            App\MyCustomAction: ~
```

To find out more about how to use services, visit [declaring services](../../../feature/services).

## Advanced usage

### Using expressions

It's possible to use expressions in your pipeline using the `expression_language` option. To use these expressions,
you need to use our customised Providers which provide the different expressions. For more information, please visit
the [detailed documentation](../../../feature/expression-language) of the language expressions.

```yaml
action:
  expression_language:
    - 'Kiboko\Component\Satellite\ExpressionLanguage\Provider'
```

### Adding logger

It's possible to add a `logger` at each action of a workflow.

For more details, go to the [detailed logger documentation](../../../feature/logger).

```yaml
satellite:
  # ...
  workflow:
    jobs:
      job-1:
        action:
        # ...
        logger:
          channel: pipeline
          destinations:
            - elasticsearch:
                level: warning
                hosts:
                  - http://user:password@elasticsearch.example.com:9200
```

### Adding state

It's possible to add a `state` at each action of a workflow.

For more details, go to the [detailed state documentation](../../../feature/state)

```yaml
satellite:
# ...
   workflow:
    jobs:
      job-1:
        action:
        # ...
        state:
          destinations:
            - rabbitmq:
                host: rabbitmq.example.com
                vhost: /
                topic: foo.rejects
```

> As you can see, actions are only able to manage the logs and states of their processes,
> but cannot deal with rejects that are contrary to pipelines.
