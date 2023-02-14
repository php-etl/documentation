---
title: "Installation"
date: 2021-10-12T15:21:02+02:00
draft: false
type: "getting-started"
shortDescription: Getting started
weight: 2
---

The first thing you have to do is to create a folder in which you will put your project.
In a terminal, type the following command:

```shell
mkdir my_project_directory && cd my_project_directory
```

After creating your project, you will have to initialize your project and add all the dependencies you need.

```shell
composer init
```

> Notice: You must choose `dev` as the value for the `minimum-stability` option.

> When asked if you want to define your require and require-dev dependencies interactively, answer `no`.

In the auto-generated `composer.json` file, add the following lines at the end :

```json
{
  // ...
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
}
```

The most important thing you need to add to your project is our compiler :

```shell
composer require php-etl/satellite
```
