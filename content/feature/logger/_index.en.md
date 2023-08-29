---
title: "Logging"
date: 2021-08-06T16:40:18+02:00
draft: false
type: "feature"
icon: "ti-archive"
description: "Execution logging and error reporting"
weight: 3
---

- [What is it for?](#what-is-it-for)
- [Installation](#installation)
- [Usage](#usage)
    - [Setting your channel](#setting-your-channel)
    - [Setting one or more destinations](#setting-one-or-more-destinations)
        - [Using a Stream](#using-a-stream)
        - [Using ElasticSearch](#using-elasticsearch)
        - [Using Syslog](#using-syslog)
        - [Using GELF](#using-gelf)
        - [Using Logstash](#using-logstash)
    - [The different levels of logs in PHP](#usage)

---

> A log is a type of file that stores a history of messages.

## What is it for?

In some cases you may need to identify why your Pipeline is failing, so we have set up a logger system that you can 
use in different steps of your pipeline.



## Installation

This plugin is already integrated into the Satellite package, so you won't need to require it with composer.

## Usage 

### Setting your channel

First, you need to specify the name of your channel in which your logs will be written.

```yaml
- example_step:
  logger:
    channel: pipeline
```

### Setting one or more destinations

Next, you need to define the destination(s) for your logs. You can choose between several logging systems:
ElasticSearch, Logstash, Gelf, Syslog and Stream.

#### Using a Stream

> A log stream is an application-specific collection of data that is used as a log.
> The data is written to and read from the log stream by one or more instances of the associated application.

To establish a connection to a stream, you need to define a `path` and the minimum [logging level](#the-different-levels-of-logs-in-php) at which this 
handler will be triggered with the `level` option. 

```yaml
- example_step:
  logger:
    # ...
    destinations:
      - stream:
          path: var/example.log
          level: warning
```

#### Using ElasticSearch 

> ElasticSearch is a search and analysis engine.

The first thing to set is the minimum [logging level](#the-different-levels-of-logs-in-php) at which this handler will be triggered using the
the `level` option.

> Note: if you need to install a local ElasticStack environment, check the [Manual installation](../installation/manual) documentation.

Next, you need to set the various hosts for your ElasticSearch application.

```yaml
- example_step:
  logger:
    # ...
    destinations:
      - elasticsearch:
          level: warning
          hosts:
           - http://user:password@elasticsearch.example.com:9200
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

Next, you need to set the protocol you want to use: TCP or AMQP.

{{< tabs name="gelf" >}}

{{< tab name="TCP" codelang="yaml" >}}
- example_step:
  logger:
    # ...
    destinations:
      - gelf:
          level: warning
          tcp:
            host: gelf.example.com
            port: 100
{{< /tab >}}

{{< tab name="AMQP" codelang="yaml" >}}
- example_step:
  logger:
    # ...
    destinations:
      - gelf:
          level: warning
          amqp:
            queue: my_queue_name
            host: example.com
            port: 100
            login: foo
            password: password
{{< /tab >}}

{{< /tabs >}}

#### Using Logstash

> Logstash is a software tool for collecting, analysing and storing logs.

When setting up your connection to Logstash, you should first set the name of your application
using the `application_name` option and the minimum [logging level](#the-different-levels-of-logs-in-php) at which this handler will be
with the `level` option.

Next, you need to set the protocol you want to use: TCP or AMQP.

{{< tabs name="logstash" >}}

{{< tab name="TCP" codelang="yaml" >}}
- example_step:
  logger:
    # ...
    destinations:
      - logstash:
          application_name: my_log_system
          level: warning
          tcp:
            host: logstash.example.com
            port: 100
{{< /tab >}}

{{< tab name="AMQP" codelang="yaml" >}}
- example_step:
  logger:
    # ...
    destinations:
      - logstash:
          application_name: my_log_system
          level: warning
          amqp:
            queue: my_queue_name
            host: example.com
            port: 100
            login: foo
            password: password
{{< /tab >}}

{{< /tabs >}}

### The different levels of logs in PHP

`debug`, `info`, `notice`, `warning`, `error`, `critical`, `alert`, `emergency`
