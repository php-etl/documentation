---
title: "Execution"
date: 2023-02-14T15:33:44+01:00
draft: false
weight: 5
---

Once your PHP code is generated, it can be executed right away.

In the following paragraphs, you will find the method for executing the satellites depending on 
the [adapter](http://localhost:1313/documentation/core-concept/satellite#setting-up-the-adapter) you have chosen.

## If you built inside the filesystem

Runs the pipeline that was compiled under `src/build/`:

```shell
php bin/satellite run:pipeline src/build/
```

This command will run your satellite service located in a directory. The execution of your service may take several minutes,
so please wait until the execution is completed.

After compilation, check that `src/build/output.csv` has been created.

## If you built as a Docker image

```shell
docker run --rm -ti foo/satellite-name:latest
```

This command will run your satellite service you have previously built as a Docker image you named `foo/satellite-name:latest`.
