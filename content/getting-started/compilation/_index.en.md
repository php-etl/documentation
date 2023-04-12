---
title: "Compilation"
date: 2023-02-14T15:33:38+01:00
draft: false
weight: 4
---

After checking and verifying that the configuration of your pipelines are correct, you will be able to compile your configuration.

In a terminal, write the following command :

```shell
php bin/satellite build src/satellite.yaml
```

In our case, the pipeline will be compiled under `src/build/`, the directory specified in `filesystem.path` of the configuration.

> Notice: You will need to run this command every time you change your configuration files.
