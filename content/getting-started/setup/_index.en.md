---
title: "Setup"
date: 2021-10-12T15:21:02+02:00
draft: false
type: "getting-started"
shortDescription: Getting started
---

- [Technical requirements](#technical-requirements)
- [Create you project](#creating-your-project)
- [Start creating your micro-service](#start-creating-your-micro-service)
- [Running the pipeline](#running-the-pipeline)
    
---

## Technical requirements

Before creating your first middleware application you must :

- [Install Composer](https://getcomposer.org/download/) version 2
- Install PHP 8.0 or higher

## Creating your project

```shell
mkdir path/to/project
```

After creating a new blank project, open your console terminal and run these commands :

```shell
composer init
```

> Notice : You must choose `dev` as the value for the `minimum-stability` option.

In your `composer.json` file, add the following lines :

```json
"config": {
    "bin-dir": "bin"
},
"scripts": {
    "post-install-cmd": [
        "Kiboko\\Component\\Satellite\\ComposerScripts::postInstall"
    ],
    "post-update-cmd": [
        "Kiboko\\Component\\Satellite\\ComposerScripts::postUpdate"
    ]
}
```

```shell
composer require php-etl/satellite
```

This command will add the `php-etl/satellite` package, that is the core of the middleware, to your composer.json.

Then, choose the plugin(s) you need from [all our plugins](../../connectivity) and added it/them into your project.

```shell
composer require php-etl/akeneo-expression-language php-etl/akeneo-plugin
```

## Start creating your micro-service

Now that you have set up your project, go to [Creating Satellites](../satellite).

## Running the pipeline

Once you have completed your configuration, open a console terminal and run these commands :

```shell
# php bin/satellite build <path-to-your-config-file>
php bin/satellite build path/to/satellite.yaml
```

Warning: You must run this command every time you change your configuration. 

```shell
# php <path-to-the-generated-function-file>
php path/to/build/folder/
```

The first command will build your microservice and create a folder whose name is the value defined in the path of your
filesystem in which there is a generated function.php file.

The second command allows you to run your microservice. The execution of your microservice may take several minutes, 
so please wait until the execution is completed.
