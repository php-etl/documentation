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

This plugin is already integrated into the Satellite package, so you can't require it with the composer.

## Usage

When you configure your pipeline, you can add the configuration of this feature to your step configuration.

First, you must use the `rejection` option.

```yaml
rejection:
  # ...
```

### With RabbitMQ

This feature supports sending to RabbitMQ instances.

#### Basic configuration

To enable a connection to your RabbitMQ application, you need at least 3 options which are `host`, `vhost` and `topic`.

- `host`: the name of your host name
- `vhost`: the virtual host of your RabbitMQ instance
- `topic`: the name of the queue to which the rejects will be sent

```yaml
rejection:
  destinations:
    - rabbitmq:
        host: rabbitmq.example.com
        vhost: /
        topic: foo.rejects
```

#### Additional options

This feature additionally takes some options that can be used when configuring to your instance.

- `user`: the username of your user
- `password`: the password of your user
- `port`: the port that your RabbitMQ application uses
- `exchange`: the name of the exchange to be used

```yaml
rejection:
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
