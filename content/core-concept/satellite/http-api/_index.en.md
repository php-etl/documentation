---
title: "HTTP API"
date: 2023-08-28T11:14:02+02:00
draft: false
type: "component"
logo: "pipeline"
description: "Data stream processing at high rate and low memory consuming"
weight: 5
---

- [What is it ?](#what-is-it-)
- [Installation](#installation)
- [Basic usage](#basic-usage)
- [Advanced usage](#advanced-usage)
  - [Adding JWT Authorization](#adding-json-web-token-jwt-authorization)
  - [Adding Basic HTTP Authorization](#adding-basic-http-authorization)

---

## What is it ?

This package allows you to create an API that will serve multiple endpoints.

The goal is to be able to send data to these endpoints, to process it in a series of steps.

## Basic usage

To define your HTTP API, you need to specify a root `path`, and one or multiple `routes` under that root:

```yaml
version: '0.3'
satellites:
  my_satellite:
    label: 'Example of an api'
    filesystem:
      path: build
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
      name: 'My HTTP API' # Optional
      path: /my-api
      routes:
        - route: /transform
          name: 'A route to transform my products' # Optional
          method: 'post'  # Optional. Default: "post"
                          # Possible values: "get", "post", "put", "delete", "patch", "head"
          expression: 'input'
          pipeline:
            steps:
              - fastmap:
                  map:
                    - field: '[sku]'
                      copy: '[product_name]'
                    - field: '[id]'
                      copy: '[product_code]'
              - csv:
                  loader:
                    file_path: 'output.csv'
```

After [building](../../../getting-started/compilation) the satellite, start a server in the path `build/`:

```bash
bin/satellite run:api build/
```

You can then send POST requests containing the data to process to `http://localhost:8000/my-api/transform`

```yaml
# input:
[
  { product_name: 'test_1', product_code: 861 },
  { product_name: 'test_2', product_code: 862 }
]

# response:
{"message":{"accept":4,"reject":0,"error":0},"server":"my-computer.local"}
  
# output.csv:
sku;id
test_1;861
test_2;862
```

## Advanced usage

### Adding JSON Web Token (JWT) Authorization

```yaml
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

With this config, each requests will need the header __Authorization__:
|header|value|
|-|-|
|`Authorization`|`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6Ik`[...]|

The string after "Bearer" is the token, generated from the secret phrase. This site can be used to generate a token from your own secret: [https://jwt.io](https://jwt.io)

### Adding Basic HTTP Authorization

```yaml
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

With this configuration, each requests will need the header __Authorization__:
|header|value|
|-|-|
|`Authorization`|`Basic am9objpteXBhc3N3b3Jk`|

The string after "Basic" is the combination `user:password` encoded in Base64.
