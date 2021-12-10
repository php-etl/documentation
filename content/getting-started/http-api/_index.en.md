---
title: "HTTP API"
date: 2020-07-12T15:21:02+02:00
draft: true
type: "component"
logo: "pipeline"
description: "Data stream processing at high rate and low memory consuming"
weight: 1
---

```yaml
satellite:
  #  docker:
  #    from: php:8.0-fpm-alpine
  #    workdir: /var/www/html
  #    tags:
  #      - kiboko/satellite:foo
  #      - kiboko/satellite:bar
  filesystem:
    path: foo
  composer:
    #    from-local: true
    require:
      - "middlewares/uuid:dev-master"
      - "middlewares/base-path:dev-master"
      - "middlewares/request-handler:dev-master"
      - "middlewares/fast-route:dev-master"
      - "laminas/laminas-diactoros"
      - "laminas/laminas-httphandlerrunner"
      - "nyholm/psr7-server"
      - "nyholm/psr7"
      - "php-etl/pipeline"
      - "php-etl/satellite"
      - "php-etl/api-runtime"
      - "php-etl/mapping-contracts"
      - "tuupola/slim-jwt-auth"
      - "tuupola/slim-basic-auth"
  http_api:
    path: /foo
    authorization:
      jwt:
        secret: 'spaghetti'
      basic:
        - user: bob
          password: pass
        - user: bill
          password: lol
    routes:
      - route: /hello
        expression: 'input["_items"]'
        pipeline:
          steps:
            - fastmap:
                map:
                  - field: '[sku]'
                    copy: '[sku]'
                  - field: '[name]'
                    copy: '[name]'
                  - field: '[staticValue]'
                    constant: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur mollis efficitur justo, id facilisis elit venenatis et. Sed fermentum posuere convallis. Phasellus lectus neque, bibendum sit amet enim imperdiet, dignissim blandit nisi. Donec nec neque nisi. Vivamus luctus facilisis nibh id rhoncus. Vestibulum eget facilisis tortor. Etiam at cursus enim, vitae mollis ex. Proin at velit at erat bibendum ultricies. Duis ut velit malesuada, placerat nisl a, ultrices tortor.'
            - csv:
                loader:
                  file_path: output.csv
                  delimiter: ','
                  enclosure: '"'
                  escape: '\'
                logger:
                  type: stderr
      - route: /events/products
        expression: 'input["_items"]'
        pipeline:
          steps:
            - fastmap:
                map:
                  - field: '[sku]'
                    copy: '[sku]'
                  - field: '[name]'
                    copy: '[name]'
                  - field: '[staticValue]'
                    constant: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur mollis efficitur justo, id facilisis elit venenatis et. Sed fermentum posuere convallis. Phasellus lectus neque, bibendum sit amet enim imperdiet, dignissim blandit nisi. Donec nec neque nisi. Vivamus luctus facilisis nibh id rhoncus. Vestibulum eget facilisis tortor. Etiam at cursus enim, vitae mollis ex. Proin at velit at erat bibendum ultricies. Duis ut velit malesuada, placerat nisl a, ultrices tortor.'
            - csv:
                loader:
                  file_path: output.csv
                  delimiter: ','
                  enclosure: '"'
                  escape: '\'
                logger:
                  type: stderr
```

### Adding JSON Web Token (JWT) Authorization

```yaml
satellite:
# ...
   http_api:
      authorization:
         jwt:
            secret: 'mysecret'
```

### Adding Basic HTTP Authorization

```yaml
satellite:
# ...
   http_api:
      authorization:
         basic:
           - user: john
             password: mypassword
```
