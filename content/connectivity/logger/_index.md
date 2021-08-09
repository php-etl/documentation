---
title: "Logger"
date: 2021-08-06T16:40:18+02:00
draft: false
---

# Logger
> A log is a type of file that stores a history of events.

In some cases you may need to identify why your Pipeline is failing, so we have set up a logger system that you can 
use in different steps of your pipeline.

## Installation

This plugin is already integrated into the Satellite package, so you can't require it with the composer.

## Usage 

### Setting your channel

First, you need to specify the name of your channel in which your logs will be written.

```yaml
logger:
channel: pipeline
```

### Setting one or more destinations

Next, you need to define the destination(s) for your logs. You can choose between several logging systems:
ElasticSearch, Logstash, Gelf, Syslog and Stream.

#### Using ElasticSearch 

> ElasticSearch is a search and analysis engine.

The first thing to set is the minimum [logging level](#the-different-levels-of-logs-in-php) at which this handler will be triggered using the
the `level` option.

Next, you need to set the various hosts for your ElasticSearch application.

```yaml
logger:
  # ...
  destinations:
    - elasticsearch:
        level: warning
        hosts:
          - http://user:password@elasticsearch.example.com:9200
```

#### Using Logstash

> Logstash is a software tool for collecting, analysing and storing logs.

When setting up your connection to Logstash, you should first set the name of your application
using the `application_name` option and the minimum [logging level](#the-different-levels-of-logs-in-php) at which this handler will be
with the `level` option.

Next, you need to set the protocol you want to use: [AMQP](#amqp-protocol-configuration) or [TCP](#tcp-protocol-configuration).

```yaml
logger:
  # ...
  destinations:
    - logstash:
        application_name: my_log_system
        level: warning
        tcp:
          host: logstash.example.com
          port: 100
```

#### Using a Stream

> A log stream is an application-specific collection of data that is used as a log.
> The data is written to and read from the log stream by one or more instances of the associated application.

To establish a connection to a stream, you need to establish a `path` and the minimum [logging level](#the-different-levels-of-logs-in-php) at which this 
handler will be triggered with the this handler will be triggered with the `level` option. 

```yaml
logger:
  # ...
  destinations:
    - stream:
        path: /my/path
        level: warning
```

#### Using Syslog
> Syslog, System Logging Protocol, is a standard protocol used to send system log files or event messages 
> to a dedicated server called syslog server.

#### Using GELF 
> The Graylog Extended Log Format (GELF) is a unique and convenient log format created to address all the shortcomings 
> of the traditional Syslog. This feature allows you to collect structured events from anywhere, 
> then compress and fragment them in a snap.

The first thing to do is to set the minimum [logging level](#the-different-levels-of-logs-in-php) at which this handler will be triggered using the `level` 
option.

Next, you need to set the protocol you want to use: [AMQP](#amqp-protocol-configuration) or [TCP](#tcp-protocol-configuration).

```yaml
logger:
  # ...
  destinations:
    - gelf:
        level: warning
        amqp:
          queue: my_queue_nama
          host: example.com
          port: 100
          login: foo
          password: password
```

### TCP protocol configuration

> TCP, Transmission Control Protocol, is a standardised protocol for the transmission of data between different 
> subscribers to a computer network.

The configuration for TCP is simple, you only need to set the `host` and `port` options on your system.

```yaml
tcp:
  host: example.com
  port: 100
```

### AMQP protocol configuration

> AMQP, Advanced Message Queuing Protocol, is a standardised transfer and framing protocol for the asynchronous, 
> secure and reliable transfer of messages.

For the AMQP protocol, you need to define the name of your `queue`, the `host` and `port` of your application, 
and the login credentials (`login` and `password`).

```yaml
amqp:
  queue: my_queue_nama
  host: example.com
  port: 100
  login: foo
  password: password
```

### The different levels of logs in PHP

`debug`, `info`, `notice`, `warning`, `error`, `critical`, `alert`, `emergency`
