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

To create a new project, you will need to initialize composer. Open your console terminal and run this command:

```shell
composer init
```

> Notice: You must choose `dev` as the value for the `minimum-stability` option.

Composer will create a `composer.json` file, you will need to add the following lines:

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

In order to install the satellite compiler, run the following in your console:

```shell
composer require php-etl/satellite
```

This command will add the `php-etl/satellite` package. It is the compiler of Gyroscops.

Once the compiler installed, you may need to add some plugins. Check out [the plugins list](../../connectivity) to know which one you may need.

Example, if you need the Akeneo Plugin:
```shell
composer require "php-etl/akeneo-expression-language:*" "php-etl/akeneo-plugin:*"
```

## Start creating your micro-service

Now that you have set up your project, go to [Creating Satellites](../satellite).

## Running the pipeline

Once you have completed your configuration, you will be able to compile your satellites:

```shell
# php bin/satellite build <path-to-your-config-file>
php bin/satellite build path/to/project/satellite.yaml
```

> Notice: You will need to run this command every time you change your configuration files.

This command will build your satellite service, either inside a Docker image or inside a filesystem directory.

### If you built inside the filesystem

```shell
# php <path-to-the-generated-satellite>
php path/to/project/build/folder/
```

This command will run your satellite service located in a directory. The execution of your service may take several minutes, 
so please wait until the execution is completed.

### If you built as a Docker image

```shell
# docker run --rm -ti <generated-satellite-docker-image-name>
docker run --rm -ti foo/satellite-name:latest
```

This command will run your satellite service located in a Docker image. The execution of your service may take several minutes, 
so please wait until the execution is completed.
