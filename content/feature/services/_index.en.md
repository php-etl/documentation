---
title: "Declaring services"
date: 2021-10-12T17:28:06+02:00
draft: false
weight: 1
---

- [What is it for?](#what-is-it-for)
- [Installation](#installation)
- [Usage](#usage)
  - [Defining your arguments](#defining-your-arguments)
  - [Making the service public](#making-the-service-public)
  - [Using method calls](#using-method-calls)
  - [Using factories](#build-a-factory)
  - [Using a service as an argument](#using-a-service-as-an-argument)

---

## What is it for?

Based on Symfony services, it is possible to inject objects into your pipeline or workflow.
To learn more about services, please visit the
[official Symfony documentation](https://symfony.com/doc/current/service_container.html).

## Installation

This plugin is already integrated into the Satellite package, so you can't require it with the composer.

## Usage

If you are using a very simple service, you can define it as follows:

```yaml
services:
  App\Foo\Bar: ~
```

### Defining your arguments

```yaml
services:
  App\Foo\Bar:
    arguments:
      - 'my-file.csv' # it's a string argument
      - { host: "localhost", port: '8000' } # it's an array argument
      - 1234 # it's a integer argument
```

In this example, the `App\Foo\Bar` service will have 3 parameters that will be passed into the 
`__construct` method of your class (in the order of writing).

### Making the service public

If you need to make a service public, use the `public` option which you set to `true`.

```yaml
services:
  App\Foo\Bar:
    # ...
    public: true
```

### Using method calls

To understand what calls are, go to the [official call documentation](https://symfony.com/doc/current/service_container/calls.html).

```yaml
services:
  App\Foo\Bar:
    # ...
    calls:
      - withUsername: [ 'admin' ]
```

### Build a factory

To understand how to use and create factories, go to the [official call documentation](https://symfony.com/doc/current/service_container/factories.html).

```yaml
services:
  App\Foo\Bar:
    # ...
    factory:
      class: App\Class\Bar
      method: extract
    arguments:
      - '@foo'
```

### Using a service as an argument

It's possible to use a service as an argument when declaring a service by using the service name preceded by `@`.

```yaml
services:
  App\Foo\Foo:
    arguments:
      - '@App\Foo\Bar'
```
