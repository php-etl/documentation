---
title: "Writing Configuration"
date: 2023-02-14T15:22:19+01:00
draft: true
weight: 3
---

Now that you have initialized your project and installed our compiler, you will be able to deepen your knowledge and use our different plugins.

The first thing to do is to create a `satellite.yaml` file.

In a terminal, enter the following command:

```shell
touch satellite.yaml
```

Then add this configuration to your YAML file:

```yaml
version: '0.3'
satellites:
  akeneo_to_csv:
    filesystem:
        path: build
    pipeline:
      steps:
        - akeneo:
            enterprise: true
            extractor:
              type: product
              method: all
            client:
              api_url: '@=env("AKENEO_URL")'
              client_id: '@=env("AKENEO_CLIENT_ID")'
              secret: '@=env("AKENEO_CLIENT_SECRET")'
              username: '@=env("AKENEO_USERNAME")'
              password: '@=env("AKENEO_PASSWORD")'
        - csv:
            loader:
              file_path: output.csv
              delimiter: ','
              enclosure: '"'
              escape: '\'
```

In our case, we use the csv and akeneo plugins, so we have to add the corresponding plugins to our project.

```shell
composer require php-etl/akeneo-plugin php-etl/csv-plugin
```

> Be careful to use a version that is compatible with the version of the `php-etl/satellite` package that you have previously installed.
> Find the different versions of our plugins [here](https://packagist.org/?query=php-etl%2F).

For more information on how to write your configuration, please read [satellites](../satellite).
