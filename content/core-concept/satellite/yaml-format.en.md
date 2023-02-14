---
title: "The YAML configuration format"
date: 2020-07-12T15:21:02+02:00
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
```yaml
satellite:
  image: kiboko/php:7.4-fpm
  composer:
#    from-local: true
    require:
      - "psr/http-message:^1.0@dev"
      - "psr/http-factory:^1.0@dev"
      - "psr/http-server-handler:^1.0@dev"
      - "middlewares/uuid:dev-master"
      - "middlewares/base-path:dev-master"
      - "middlewares/request-handler:dev-master"
      - "middlewares/fast-route:dev-master"
      - "nyholm/psr7:^1.0@dev"
      - "nyholm/psr7-server:dev-master"
      - "laminas/laminas-httphandlerrunner:1.2.x-dev"
  runtime:
    type: http-api
    path: /foo
    routes:
      - path: /hello
        function: hello.php
      - path: /events/products
        function: events/products.php
```

In this example, the URL `/foo/hello` will show all the data render by the function `hello.php` and the url `/foo/events/products` 
will show the result of the `products.php` located in the events folder.

#### Using http-hook
```yaml
satellite:
  image: kiboko/php:7.4-fpm
  composer:
#    from-local: true
    require:
      - "psr/http-message:^1.0@dev"
      - "psr/http-factory:^1.0@dev"
      - "psr/http-server-handler:^1.0@dev"
      - "middlewares/uuid:dev-master"
      - "middlewares/base-path:dev-master"
      - "middlewares/request-handler:dev-master"
      - "middlewares/fast-route:dev-master"
      - "nyholm/psr7:^1.0@dev"
      - "nyholm/psr7-server:dev-master"
      - "laminas/laminas-httphandlerrunner:1.2.x-dev"
  runtime:
    type: http-hook
    path: /bar/hello
    function: hello.php
```

In this example, the URL `/bar/hello` will show all the data render by the function `hello.php`.

#### Using Pipeline
```yaml
satellite:
  image: kiboko/php:7.4-cli
  composer:
#    from-local: true
    autoload:
      psr-4:
        "Pipeline\\": ""
    require:
      - "php-etl/pipeline:@dev"
      - "php-etl/fast-map:@dev"
  runtime:
    type: pipeline
    steps:
    - extract: Pipeline\FooExtractor
    - transform: Pipeline\FastMapTransformer
      array:
      - field: '[sku]'
        copy: '[sku]'
      - field: '[title]'
        expression: 'input["sku"] ~" | "~ input["name"]'
      - field: '[name]'
        copy: '[name]'
      - field: '[staticValue]'
        constant: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur mollis efficitur justo, id facilisis elit venenatis et. Sed fermentum posuere convallis. Phasellus lectus neque, bibendum sit amet enim imperdiet, dignissim blandit nisi. Donec nec neque nisi. Vivamus luctus facilisis nibh id rhoncus. Vestibulum eget facilisis tortor. Etiam at cursus enim, vitae mollis ex. Proin at velit at erat bibendum ultricies. Duis ut velit malesuada, placerat nisl a, ultrices tortor.'
      - field: '[descriptions]'
        class: 'Pipeline\\Usage'
        expression: 'input'
        object:
        - field: 'usage'
          expression: '"Usage: " ~ input["usage"]'
        - field: 'warning'
          copy: '[warning]'
        - field: 'notice'
          copy: '[notice]'
    - load: Pipeline\BarLoader
```

In this example, the config create a pipeline that the Satellite will use.
