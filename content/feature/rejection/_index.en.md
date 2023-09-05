---
title: "Rejection"
date: 2021-10-12T14:54:48+02:00
draft: false
type: "feature"
weight: 4
---

- [What is it for?](#what-is-it-for)
- [Installation](#installation)
- [Usage](#usage)
  - [With RabbitMQ](#basic-usage)

---

## What is it for?

The rejection feature allows you to manage the rejections that may occur in your project.

## Installation

This plugin is already integrated into the Satellite package, so you can't require it with composer.

## Usage

When you configure your pipeline, you can add the configuration of this feature to your step configuration.

First, you must use the `rejection` option.

```yaml
- example_step:
    foo: bar
  rejection:
    # ...
```

### With RabbitMQ

This feature supports sending to RabbitMQ instances. For this feature to work you will need to install [`bunny/bunny`](https://packagist.org/packages/bunny/bunny):

```shell
composer require bunny/bunny
```

#### Basic configuration

To enable a connection to your RabbitMQ application, you need at least 4 options which are `host`, `vhost`, `topic` and `port`.

- `host`: the name of your host name
- `vhost`: the virtual host of your RabbitMQ instance
- `topic`: the name of the queue to which the rejects will be sent
- `port`: the port that your RabbitMQ application uses

```yaml
- example_step:
    # ...
  rejection:
    destinations:
      - rabbitmq:
          host: rabbitmq.example.com
          vhost: /
          topic: foo.rejects
          port: 5672
```

#### Additional options

This feature additionally takes some options that can be used when configuring to your instance.

- `user`: the username of your user
- `password`: the password of your user
- `exchange`: the name of the exchange to be used

```yaml
- example_step:
    # ...
  rejection:
    destinations:
      - rabbitmq:
          host: rabbitmq.example.com
          vhost: /
          topic: foo.rejects
          port: 5672
          user: 'guest'
          password: 'guest'
          exchange: 'amq.direct'
```
