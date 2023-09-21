---
title: "Lookup mapper"
date: 2023-07-31T12:07:47+02:00
draft: false
type: "plugins"
icon: "ti-settings"
description: "Learn how to write a custom mapper"
weight: 1
---

A lookup mapper is a class that implements `Kiboko\Contract\Mapping\CompiledMapperInterface`.

Its purpose is to merge the result of the lookup back into your line.

`$output` is your line, and `$input` is the result of the lookup.

```php
<?php

declare(strict_types=1);

namespace Acme\Custom;

use Kiboko\Contract\Mapping\CompiledMapperInterface;

class LookupMapper implements CompiledMapperInterface
{
    public function __invoke($input, $output = null)
    {
        $output['actual_customer_id'] = $input['id'];

        return $output;
    }
}
```