---
title: "Bare-metal Installation"
date: 2020-07-12T15:21:02+02:00
draft: false
shortDescription: Lorem Ipsum
---

### Contents of this documentation

What we will consider as a *bare-metal* installation, is an installation of at least one component of the middleware in
a vanilla PHP application, without the use of a specific framework.

This process will make use of the *Composer* command all along. Even if Composer is a de-facto standard, please make
sure your application can work with composer.

### Prerequisites

Please check page of [Manual installation](../manual) and ensure your system can work with **Middleware**.
This page will help you install Logstash, ElasticSearch and Kibana in a quick walkthrough.

#### PHP dependencies

We will use the *Satellite* CLI tool, which is responsible in transforming your YAML or JSON pipeline configuration 
files into runnable PHP code.

In your project directory run the following:

`composer require php-etl/satellite`

This command will import the `satellite` command in your project, depending on your framework, you may find it in
different directories:
* bare-metal: `vendor/bin/satellite`
* Symfony: `bin/satellite`
