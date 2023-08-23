---
title: "Environment Setup"
date: 2023-02-14T14:53:57+01:00
draft: false
weight: 1
---

Gyroscops is a command line application written in PHP. To be able to use the application, you will need to fulfill the following requirements:

### PHP 8.2 or higher

Before proceeding, make sure your computer has a PHP version higher than or equal to 8.2 installed.

For more information on how to install PHP, go to the [official documentation](https://www.php.net/manual/en/install.php).

### Composer 2

After installing PHP, you must ensure that Composer 2 is installed on your machine.

For more information on how to install Composer, go to the [official documentation](https://getcomposer.org/download/).

### Docker (optional)

Gyroscops offers you the possibility to build your configurations as images that you can use in a dockerized environment.
That's why you may also need Docker.

For more information on how to install Docker, go to the [official documentation](https://docs.docker.com/get-docker/).

## Before v0.6.6 of `php-etl/satellite`:

### JQ

Jq, a JSON processor, is also required for satellites to generate their composer.json files.

For more information on how to install jq, go to the [official documentation](https://stedolan.github.io/jq/download/).
