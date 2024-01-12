---
title: "Usage"
date: 2024-01-12T14:52:40+01:00
draft: true
---

Gyroscops also allows you to have your satellites stored in the cloud.

Thanks to the cloud executable provided by the package `php-etl/satellite`,
you can manage your satellites quickly and easily.

## Login to the API

The first thing you need to do is connect to the Cloud API. Without this first step, you won't be able to do anything.

```shell
bin/cloud login
```

> The service may ask you to select your organization and your workspace.

To see the arguments and options expected by the command, you can run the command :

```shell
bin/cloud login --help
```

## Create your satellite

```shell
php bin/cloud create path/to/satellite.yaml
```

Once done, you will be able to control your satellite execution through the Gyroscops Cloud interface.

## Other commands

To see the list of other commands available, you can run the following command:

```shell
bin/cloud list
```
