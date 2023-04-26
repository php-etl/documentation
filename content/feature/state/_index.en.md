---
title: "State"
date: 2021-10-12T15:53:46+02:00
draft: false
type: "feature"
weight: 5
---

- [What is it for?](#what-is-it-for)
- [Installation](#installation)
- [Usage](#usage)
    - [With RabbitMQ](#basic-usage)
    - [Using a service](#using-a-service)
---

## What is it for?

The state feature allows you to manage the states advancement of your pipeline.

## Installation

This plugin is already integrated into the Satellite package, so you can't require it with the composer.

## Usage

When you configure your pipeline, you can add the configuration of this feature to your step configuration.

First, you must use the `state` option.

```yaml
state:
  # ...
```

### With RabbitMQ

This feature supports sending to RabbitMQ instances.

#### Basic configuration

To enable a connection to your RabbitMQ application, you need at least 3 options which are `host`, `vhost` and `topic`.

- `host`: this is the name of your host name
- `vhost`: this is the virtual host of your RabbitMQ instance
- `topic`: this is the name of the queue to which the rejects will be sent

```yaml
state:
  destinations:
    - rabbitmq:
        host: rabbitmq.example.com
        vhost: /
        topic: foo.rejects
```

#### Additional options

This feature additionally takes some options that can be used when configuring to your instance.

- `user`: this is the username of your user
- `password`: this is the password of your user
- `port`: this is the port that your RabbitMQ application uses
- `exchange`: this is the name of the exchange to be used

```yaml
state:
  destinations:
    - rabbitmq:
        host: rabbitmq.example.com
        port: 5672
        user: 'guest'
        password: 'guest'
        vhost: /
        topic: foo.rejects
        exchange: 'amq.direct'
```

### Using a service

It's possible to use a service that has been previously defined in the pipeline or the workflow configuration.

To use a service, you just have to write the name of your service preceded by a `@`.

```yaml
state:
  destinations:
    - '@App\Service\Bar'
```

> Warning : In the case where the states of your steps must all be sent to the same instance with a unique manager,
> you must use services.
