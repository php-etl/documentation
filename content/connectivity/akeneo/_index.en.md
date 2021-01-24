---
title: "Akeneo connectivity"
date: 2021-01-22T09:23:54+01:00
lastmod: 2021-01-22T09:23:54+01:00
weight: ""
draft: false
---

### Goal

The packages listed below aims at the integration of [Akeneo PIM](https://www.akeneo.com) into the [ETL Pipeline](../../components/pipeline) 
and [Satellite](../../components/satellite) stacks.

The tools built for Akeneo is composed of ETL capacities and data processing functions to be used in
[Fast Map](../../components/fast-map).

### The Akeneo plugin for ETL Pipeline

This plugin will enable Akeneo connectivity to the [ETL Pipeline](../../components/pipeline), in order to
read and write from and to Akeneo PIM. This integration is compatible with both
[Akeneo Enterprise Edition client](https://github.com/akeneo/api-php-client-ee)
and the [Akeneo Community Edition client](https://github.com/akeneo/api-php-client).

[See detailed documentation](plugin)

### The Akeneo expression functions

This plugin will extend the Fast Map data processing library with new functions dedicated to Akeneo-specific
data formats and concepts.

[See detailed documentation](expression-language)
