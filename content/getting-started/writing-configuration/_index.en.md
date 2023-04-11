---
title: "Writing Configuration"
date: 2023-02-14T15:22:19+01:00
draft: false
weight: 3
---

Now that you have initialized your project and installed our compiler, you will be able to deepen your knowledge and use our different plugins.

The first thing to do is to create a configuration file in the place you want in your project, which we will call satellite.yaml.

To organize our project and avoid that our project becomes an Alibaba cave, we will create this file in a src folder.

In a terminal, enter the following command:

```shell
mkdir src && touch src/satellite.yaml
```

Then add this example configuration to your YAML file:

```yaml
version: '0.3'
satellites:
  csv_to_json:
    label: 'CSV to JSON'
    filesystem:
        path: build
    pipeline:
      steps:
        - csv:
            extractor:
              file_path: 'data/products.csv'
        - json:
            loader:
              file_path: 'output.json'

```

In our case, we will use a `csv` extractor and `json` loader, so we have to add the corresponding plugins to our project:

```shell
composer require php-etl/csv-plugin:'*' php-etl/json-plugin:'*'
```

Composer will install a version of the plugin that is compatible with the `php-etl/satellite` package you have previously installed.
Find the different versions of our plugins [here](https://packagist.org/?query=php-etl%2F).

> In a configuration file, paths start at the folder specified under `filesystem.path`. Here for example, the result will be `build/output.csv`.

For more information on how to write your configuration, please read [satellites](../satellite).
