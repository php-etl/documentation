---
title: "Execution"
date: 2023-02-14T15:33:44+01:00
draft: true
weight: 5
---

Once your PHP code is generated, you only need to execute it.

However, depending on the adapter you have chosen in your configuration, the way to do it is different.

## If you built inside the filesystem

```shell
# php <path-to-the-generated-satellite>
php build/main.php
```

This command will run your satellite service located in a directory. The execution of your service may take several minutes,
so please wait until the execution is completed.

## If you built as a Docker image

```shell
# docker run --rm -ti <generated-satellite-docker-image-name>
docker run --rm -ti foo/satellite-name:latest
```

This command will run your satellite service located in a Docker image. The execution of your service may take several minutes,
so please wait until the execution is completed.

