---
title: "PHP Objects"
date: 2021-26-01T15:21:02+02:00
draft: false
---

### The `docker` section

In this section you will be able to specify the base docker image on which the
satellite will be built. We recommend either the official PHP images based on
Alpine Linux.

### The `filesystem` section

In this section you will be able to specify the system file on which the
satellite will be built.

### The `composer` section

This section makes you able to specify some parameters that will be transmitted
to composer at build time.

### The `runtime` section 
This section will create the Pipeline that corresponds to your config.

Thanks to our package, 3 runtimes are avaible : 
- http-api
- http-hook
- pipeline

### Examples

#### Using http-api
```php

use Kiboko\Component\ETL\Satellite\Adapter\Docker;

$dockerfile = new Docker\Dockerfile(
    new Docker\Dockerfile\From('kiboko/php:7.4-cli'),
    new Docker\Dockerfile\Workdir('/var/www/html/')
);

$dockerfile->push(
    new Docker\PHP\Composer(),
    new Docker\PHP\ComposerInit(),
    new Docker\PHP\ComposerMinimumStability('dev'),
    new Docker\PHP\ComposerRequire('psr/http-message:^1.0@dev'),
    new Docker\PHP\ComposerRequire('psr/http-factory:^1.0@dev'),
    new Docker\PHP\ComposerRequire('psr/http-server-handler:^1.0@dev'),
    new Docker\PHP\ComposerRequire('middlewares/uuid:dev-master'),
    new Docker\PHP\ComposerRequire('middlewares/base-path:dev-master'),
    new Docker\PHP\ComposerRequire('middlewares/request-handler:dev-master'),
    new Docker\PHP\ComposerRequire('middlewares/fast-route:dev-master'),
    new Docker\PHP\ComposerRequire('nyholm/psr7:^1.0@dev'),
    new Docker\PHP\ComposerRequire('nyholm/psr7-server:dev-master'),
    new Docker\PHP\ComposerRequire('laminas/laminas-httphandlerrunner:1.2.x-dev');
);

$satellite = new Docker\Satellite(
    'foo/satellite:bar',
    $dockerfile
);

$httpApi= new Runtime\HttpApi();
$httpApi->build();
```

In this example, the URL `/foo/hello` will show all the data render by the function `hello.php` and the url `/foo/events/products` 
will show the result of the `products.php` located in the events folder.

#### Using http-hook
```php
use Kiboko\Component\ETL\Satellite\Adapter\Docker;

$dockerfile = new Docker\Dockerfile(
    new Docker\Dockerfile\From('kiboko/php:7.4-cli'),
    new Docker\Dockerfile\Workdir('/var/www/html/')
);

$dockerfile->push(
    new Docker\PHP\Composer(),
    new Docker\PHP\ComposerInit(),
    new Docker\PHP\ComposerMinimumStability('dev'),
    new Docker\PHP\ComposerRequire('psr/http-message:^1.0@dev'),
    new Docker\PHP\ComposerRequire('psr/http-factory:^1.0@dev'),
    new Docker\PHP\ComposerRequire('psr/http-server-handler:^1.0@dev'),
    new Docker\PHP\ComposerRequire('middlewares/uuid:dev-master'),
    new Docker\PHP\ComposerRequire('middlewares/base-path:dev-master'),
    new Docker\PHP\ComposerRequire('middlewares/request-handler:dev-master'),
    new Docker\PHP\ComposerRequire('middlewares/fast-route:dev-master'),
    new Docker\PHP\ComposerRequire('nyholm/psr7:^1.0@dev'),
    new Docker\PHP\ComposerRequire('nyholm/psr7-server:dev-master'),
    new Docker\PHP\ComposerRequire('laminas/laminas-httphandlerrunner:1.2.x-dev');
);

$satellite = new Docker\Satellite(
    'foo/satellite:bar',
    $dockerfile
);

$httpHook= new Runtime\HttpHook();
$httpHook->build();
```

In this example, the URL `/bar/hello` will show all the data render by the function `hello.php`.

#### Using Pipeline
```php
use Kiboko\Component\ETL\Satellite\Adapter\Docker;

$dockerfile = new Docker\Dockerfile(
    new Docker\Dockerfile\From('kiboko/php:7.4-cli'),
    new Docker\Dockerfile\Workdir('/var/www/html/')
);

$dockerfile->push(
    new Docker\PHP\Composer(),
    new Docker\PHP\ComposerInit(),
    new Docker\PHP\ComposerMinimumStability('dev'),
    new Docker\PHP\ComposerRequire('php-etl/pipeline:@dev'),
    new Docker\PHP\ComposerRequire('php-etl/fast-map:@dev')
);

$satellite = new Docker\Satellite(
    'foo/satellite:bar',
    $dockerfile
);

$pipeline= new Runtime\Pipeline();
$pipeline->build();
```

In this example, the config create a pipeline that the Satellite will use.
