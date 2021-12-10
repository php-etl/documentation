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
  filesystem:
    path: foo
  composer:
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
  http_api:
    path: /foo
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
Build this satellite by running

`bin/satellite build the-config.yaml`

Then start a server in the path foo/

`php -S localhost:8000 foo/main.php`

POST requests can then be executed to `http://localhost:8000/foo/hello` and `http://localhost:8000/foo/events/products`.

### Adding JSON Web Token (JWT) Authorization

JWT can be used to restrict requests.

```yaml
satellite:
# ...
   composer:
      require:
         - "tuupola/slim-jwt-auth"
# ...
   http_api:
      authorization:
         jwt:
            secret: 'mysecret'
```

With this config, each requests must contain the header __Authorization__:
|header|value|
|-|-|
|`Authorization`|`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6Ik`[...]|

The string after "Bearer" is the token containing the secret. This site can be used to generate a token: [https://jwt.io](https://jwt.io)

### Adding Basic HTTP Authorization

```yaml
satellite:
# ...
   composer:
      require:
         - "tuupola/slim-basic-auth"
# ...
   http_api:
      authorization:
         basic:
           - user: john
             password: mypassword
            - user: bill
             password: otherpassword
```

The `basic` node is an array, and can contain multiple user/password pairs.

With this config, each requests must contain the header __Authorization__:
|header|value|
|-|-|
|`Authorization`|`Basic am9objpteXBhc3N3b3Jk`|

The string after "Basic" is the combination `user:password` [encoded in Base64](https://www.base64encode.org/).
