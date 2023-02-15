---
title: "Execution"
date: 2023-02-14T15:33:44+01:00
draft: true
weight: 5
---

Once your PHP code is generated, it can be executed right away.

n the following paragraphs, you will find the method for executing the satellites depending on 
the [adapter](http://localhost:1313/documentation/core-concept/satellite#setting-up-the-adapter) you have chosen.

## If you built inside the filesystem

```shell
# php <path-to-the-generated-satellite>
php bin/satellite run:pipeline build/
```

This command will run your satellite service located in a directory. The execution of your service may take several minutes,
so please wait until the execution is completed.

## If you built as a Docker image

```shell
# docker run --rm -ti <generated-satellite-docker-image-name>
docker run --rm -ti foo/satellite-name:latest
```

This command will run your satellite service you have previously built as a Docker image you named `foo/satellite-name:latest`.
