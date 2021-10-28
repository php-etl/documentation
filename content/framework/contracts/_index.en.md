---
title: "Contracts"
date: 2020-07-12T15:21:02+02:00
draft: false
type: "dev_guide"
icon: "ti-medall"
description: "Code contracts for building compatible pipelines in the middleware"
---

{{< feature-state for_mw_version="0.1" state="alpha" >}}

### Code contracts

#### Introduction

Code contracts are a set of abstraction interfaces made to help you build compatible code between all your pipelines, using common semantics.

#### Installation

Contracts are provided as separate packages, so you can install only the ones your projects really need:

```shell script
composer require php-etl/contracts
composer require php-etl/configurator-contracts
composer require php-etl/discovery-contracts
composer require php-etl/function-contracts
composer require php-etl/mapping-contracts
composer require php-etl/messenger-contracts
composer require php-etl/pipeline-contracts
composer require php-etl/reporting-contracts
```

#### Usage

The abstractions in those packages are useful to achieve loose coupling and interoperability.
By using the provided interfaces as type hints, you are able to build any implementations that match the contracts.
It could be a native Gyroscops component, or another package provided by the PHP community at large.

#### Design principles

* Contracts are split by domain, each into their own sub-namespaces
* Contracts are small and consistent sets of PHP interfaces

#### Package `php-etl/contracts`

This package is a meta-package, containing all the packages described in the next paragraphs.

#### Package `php-etl/configurator-contracts`

This package is for packages describing their own .

See [Configurator Contracts](configurator)

#### Package `php-etl/discovery-contracts`

This package is for packages built for discovering the structure of the data and the API endpoints.

Get more info at [the Discovery documentation](../discovery)

#### Package `php-etl/function-contracts`

This package is for packages built for declaring and executing serverless functions/lambda in the cloud.

Get more info at [the Satellite documentation](../satellite)

#### Package `php-etl/mapping-contracts`

This package is for packages built for declaring data mapping and data transformation.

Get more info at [the Fast Map documentation](../fast-map)

#### Package `php-etl/messenger-contracts`

This package is for packages built for declaring application messaging services.

#### Package `php-etl/pipeline-contracts`

This package is for packages built for declaring data pipelines, using the Extract-Transform-Load pattern.

Get more info at [the Pipeline documentation](../pipeline)

#### Package `php-etl/reporting-contracts`

This package is for packages built for managing logging and reporting of execution states and results.

Get more info at [the Dashboard documentation](../dashboard)
