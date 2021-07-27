---
title: "Fast Map"
date: 2020-07-12T15:21:02+02:00
draft: false
type: "plugins"
logo: "fastmap"
description: "Data transformation and serialization, with compiled and static mappers"
---

{{< feature-state for_mw_version="0.1" state="alpha" >}}

### Definition of a Mapping

A mapping is an operation that associates each element of a source of data into 
a new format of the same data. By this operation, it is possible to transform
the way the data is represented.

### The Abstract Mapping Tree

The _abstract mapping tree_ is a representation of the mapping to apply to your
data, in order to transform its representation. It is an internal representation
build for a computer to understand how it will have to change the data representation
during the mapping operation.

### Components included

#### The `php-etl/fast-map` component

This component is in charge of representing the Abstract Mapping Tree, and transforming
it into compiled PHP code. This compiled PHP code is the actual code that will do the 
mapping, in an optimized way.
 
#### The `php-etl/fast-map-config` component
This component allows you to configure your mapper according to the type of data you want to input.

If you need to config your mappers, we advise you to use the yml config which will generate a php code usable by the fast-map-config.
This code will then be converted into a machine code that can be used by the fast map package.

### Installation

```shell
composer require php-etl/fast-map-plugin
```

### Configuration
{{< tabs name="basic_definition" >}}

{{< tab name="YAML" codelang="yaml"  >}}
fastmap:
  map:
    - field: 'products'
      class: 'Model\\Product'
      expression: 'merge( input["items"], input["shippings"] )'
      collection:
        - field: 'sku'
          copy: '[sku]'
        - field: 'price'
          expression: 'input["price"]'
          class: 'Model\\Price'
          object:
            - field: 'amount'
              expression: 'input["value"]'
            - field: 'currency'
              expression: 'input["currency"]'
{{< /tab >}}

{{< tab name="PHP" codelang="php"  >}}
<?php

use Kiboko\Component\FastMapConfig\CompositeBuilder;
use Kiboko\Component\FastMapConfig\ObjectBuilder;
use Kiboko\Component\FastMap\Compiler;
use Kiboko\Component\FastMap\PropertyAccess\EmptyPropertyPath;
use Symfony\Component\ExpressionLanguage\ExpressionFunction;
use Model\Product;
use Model\Price;

$mapper = (new ObjectBuilder(Order::class, null, $interpreter))
 ->children()
     ->collection('products', 'merge( input["items"], input["shippings"] )', Product::class)
         ->children()
             ->copy('sku', '[sku]')
             ->object('price', 'input["price"]', Price::class)
                 ->children()
                     ->expression('amount', 'input["value"]')
                     ->expression('currency', 'input["currency"]')
                 ->end()
             ->end()
         ->end()
     ->end()
 ->end()
 ->getMapper();
{{< /tab >}}

{{< /tabs >}}
