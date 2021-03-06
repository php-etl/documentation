---
title: "Akeneo expression language functions"
date: 2021-01-24T09:23:54+01:00
draft: false
description: "Functions for manipulating Akeneo API data"
---

{{< feature-state for_mw_version="0.1" state="alpha" >}}

### Goal

This library implements functions for manipulating Akeneo API data through the
[Symfony Expression Language](https://symfony.com/doc/current/components/expression_language.html).

### Installation

```
composer require php-etl/akeneo-expression-language
```

### Usage

{{< tabs name="basic_definition" >}}

{{< tab name="YAML" codelang="yaml"  >}}
- fastmap:
    expression_language:
    - 'Kiboko\Component\ExpressionLanguage\Akeneo\AkeneoFilterProvider'
    map:
    - field: '[title]'
      expression: 'filter(input["title"], scope("print", "mobile", "web"), first())'
{{< /tab >}}

{{< tab name="PHP" codelang="php"  >}}
<?php

use Symfony\Component\ExpressionLanguage\ExpressionLanguage;
use Kiboko\Component\ExpressionLanguage\Akeneo\AkeneoFilterProvider;

$input = [
    [
        'locale' => 'en_US',
        'scope' => 'mobile',
        'data' => 'Lorem ipsum dolor sit amet',
    ],
    [
        'locale' => 'fr_CA',
        'scope' => 'web',
        'data' => 'Lorem ipsum dolor sit amet',
    ],
    [
        'locale' => 'fr_CA',
        'scope' => 'marketplace',
        'data' => 'Lorem ipsum dolor sit amet',
    ],
    [
        'locale' => 'fr_FR',
        'scope' => 'print',
        'data' => 'Lorem ipsum dolor sit amet',
    ],
    [
        'locale' => 'en_GB',
        'scope' => 'mobile',
        'data' => 'Lorem ipsum dolor sit amet',
    ],
];
$expression = 'filter(input, scope("print", "mobile", "web"), first())';

$interpreter = new ExpressionLanguage(null, [new AkeneoFilterProvider()]);
$interpreter->evaluate($expression, ['input' => $input]);
{{< /tab >}}

{{< /tabs >}}

### Functions reference

#### Attribute data manipulation

Akeneo has a specific data format that would make cumbersome the data mapping
if there were no dedicated tools. In this matter the Expression Language functions
for Akeneo gives you more control over what you wish to synchronize.

There are two functions that have to be used in order to filter or extract data
from your Akeneo attributes:

* `filter ( data , ...filter )`: filter the available values for an attribute
* `attribute ( data , ...filter )`: extract the most accurate value

Those functions needs som companions in order to be useful. Those companions
will help you to apply filtering depending on your business logic.

##### Filter by locale

`locale ( string ...locale )`

This filter will extract only the locales that match the provided locale codes,
with no reordering.

`filter(input["data"]["description"], locale("fr_CA", "fr_FR"))`

{{< tabs name="locale" >}}

{{< tab name="Filter Result" codelang="json"  >}}
[
    {
        "locale": "fr_FR",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_CA",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_FR",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    }
]
{{< /tab >}}

{{< tab name="Data Source" codelang="json"  >}}
[
    {
        "locale": "fr_FR",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "en_US",
        "scope": "mobile",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_CA",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_FR",
        "scope": "print",
        "data": "Lorem ipsum dolor sit amet",
    },
]
{{< /tab >}}

{{< /tabs >}}

##### Filter by scope

`scope ( string ...scope )`

This filter will extract only the scopes that match the provided scope codes,
with no reordering.

`filter(input["data"]["description"], scope("web", "print"))`

{{< tabs name="scope" >}}

{{< tab name="Filter Result" codelang="json"  >}}
[
    {
        "locale": "fr_FR",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_CA",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_FR",
        "scope": "print",
        "data": "Lorem ipsum dolor sit amet"
    }
]
{{< /tab >}}

{{< tab name="Data Source" codelang="json"  >}}
[
    {
        "locale": "fr_FR",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "en_US",
        "scope": "mobile",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_CA",
        "scope": "print",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_FR",
        "scope": "print",
        "data": "Lorem ipsum dolor sit amet",
    },
]
{{< /tab >}}

{{< /tabs >}}

##### Take the first available value by scopes

`coalesce ( string ...scope )`

This filter will extract the first value tat matches a scope in the provided scope codes.

`filter(input["data"]["description"], coalesce("web", "print"))`

{{< tabs name="coalesce" >}}

{{< tab name="Filter Result" codelang="json"  >}}
[
    {
        "locale": "fr_FR",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    }
]
{{< /tab >}}

{{< tab name="Data Source" codelang="json"  >}}
[
    {
        "locale": "fr_FR",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "en_US",
        "scope": "mobile",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_CA",
        "scope": "print",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_FR",
        "scope": "print",
        "data": "Lorem ipsum dolor sit amet",
    },
]
{{< /tab >}}

{{< /tabs >}}

##### Combining results filter

`anyOf ( ...filters )`

This filter will combine several filters into one result, applying an OR  
to every specified filter. It will result in a list where **at least one**
filter is true.

`filter(input["data"]["description"], anyOf(scope("web"), locale("fr_FR")))`

{{< tabs name="anyOf" >}}

{{< tab name="Filter Result" codelang="json"  >}}
[
    {
        "locale": "fr_FR",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_FR",
        "scope": "print",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_CA",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    }
]
{{< /tab >}}

{{< tab name="Data Source" codelang="json"  >}}
[
    {
        "locale": "fr_FR",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "en_US",
        "scope": "mobile",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_CA",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_FR",
        "scope": "print",
        "data": "Lorem ipsum dolor sit amet",
    },
]
{{< /tab >}}

{{< /tabs >}}

##### Excluding results filter

`allOf ( ...filters )`

This filter will combine several filters into one result, applying an AND  
to every specified filter. It will result in a list where **all** filters are true.

`filter(input["data"]["description"], allOf(scope("web"), locale("fr_FR")))`

{{< tabs name="allOf" >}}

{{< tab name="Filter Result" codelang="json"  >}}
[
    {
        "locale": "fr_FR",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    }
]
{{< /tab >}}

{{< tab name="Data Source" codelang="json"  >}}
[
    {
        "locale": "fr_FR",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "en_US",
        "scope": "mobile",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_CA",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_FR",
        "scope": "print",
        "data": "Lorem ipsum dolor sit amet"
    }
]
{{< /tab >}}

{{< /tabs >}}

##### Extracting a slice of the values list

`slice ( int offset , int length )`

This filter will extract `length` values, starting at `offset`. 

`filter(input["data"]["description"], slice(1, 2))`

{{< tabs name="slice" >}}

{{< tab name="Filter Result" codelang="json"  >}}
[
    {
        "locale": "en_US",
        "scope": "mobile",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_CA",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    }
]
{{< /tab >}}

{{< tab name="Data Source" codelang="json"  >}}
[
    {
        "locale": "fr_FR",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "en_US",
        "scope": "mobile",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_CA",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_FR",
        "scope": "print",
        "data": "Lorem ipsum dolor sit amet"
    }
]
{{< /tab >}}

{{< /tabs >}}

##### Extracting the beginning of the values list

`head ( int length )`

This filter will extract `length` values, starting at the beginning. 

`filter(input["data"]["description"], head(2))`

{{< tabs name="head" >}}

{{< tab name="Filter Result" codelang="json"  >}}
[
    {
        "locale": "fr_FR",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "en_US",
        "scope": "mobile",
        "data": "Lorem ipsum dolor sit amet"
    }
]
{{< /tab >}}

{{< tab name="Data Source" codelang="json"  >}}
[
    {
        "locale": "fr_FR",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "en_US",
        "scope": "mobile",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_CA",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_FR",
        "scope": "print",
        "data": "Lorem ipsum dolor sit amet"
    }
]
{{< /tab >}}

{{< /tabs >}}

##### Extracting the end of the values list

`tail ( int length )`

This filter will extract `length` values, starting at the end. 

`filter(input["data"]["description"], tail(2))`

{{< tabs name="tail" >}}

{{< tab name="Filter Result" codelang="json"  >}}
[
    {
        "locale": "fr_CA",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_FR",
        "scope": "print",
        "data": "Lorem ipsum dolor sit amet"
    }
]
{{< /tab >}}

{{< tab name="Data Source" codelang="json"  >}}
[
    {
        "locale": "fr_FR",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "en_US",
        "scope": "mobile",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_CA",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_FR",
        "scope": "print",
        "data": "Lorem ipsum dolor sit amet"
    }
]
{{< /tab >}}

{{< /tabs >}}

##### Extracting the values list, after an offset

`offset ( int offset )`

This filter will extract all the values after the `offset` position. 

`filter(input["data"]["description"], offset(1))`

{{< tabs name="offset" >}}

{{< tab name="Filter Result" codelang="json"  >}}
[
    {
        "locale": "en_US",
        "scope": "mobile",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_CA",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_FR",
        "scope": "print",
        "data": "Lorem ipsum dolor sit amet"
    }
]
{{< /tab >}}

{{< tab name="Data Source" codelang="json"  >}}
[
    {
        "locale": "fr_FR",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "en_US",
        "scope": "mobile",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_CA",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_FR",
        "scope": "print",
        "data": "Lorem ipsum dolor sit amet"
    }
]
{{< /tab >}}

{{< /tabs >}}

##### Extracting the first value from the list

`first ( )`

This filter will extract the first value of the list. 

`filter(input["data"]["description"], first())`

{{< tabs name="first" >}}

{{< tab name="Filter Result" codelang="json"  >}}
[
    {
        "locale": "fr_FR",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    }
]
{{< /tab >}}

{{< tab name="Data Source" codelang="json"  >}}
[
    {
        "locale": "fr_FR",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "en_US",
        "scope": "mobile",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_CA",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_FR",
        "scope": "print",
        "data": "Lorem ipsum dolor sit amet"
    }
]
{{< /tab >}}

{{< /tabs >}}

##### Extracting the last value from the list

`last ( )`

This filter will extract the last value of the list. 

`filter(input["data"]["description"], first())`

{{< tabs name="first" >}}

{{< tab name="Filter Result" codelang="json"  >}}
[
    {
        "locale": "fr_FR",
        "scope": "print",
        "data": "Lorem ipsum dolor sit amet"
    }
]
{{< /tab >}}

{{< tab name="Data Source" codelang="json"  >}}
[
    {
        "locale": "fr_FR",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "en_US",
        "scope": "mobile",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_CA",
        "scope": "web",
        "data": "Lorem ipsum dolor sit amet"
    },
    {
        "locale": "fr_FR",
        "scope": "print",
        "data": "Lorem ipsum dolor sit amet"
    }
]
{{< /tab >}}

{{< /tabs >}}

#### Dates management with `dateTime` and `dateTimeZone`

In order to generate date objects, two functions has been created:

`dateTime ( string date, [ string format ] )`

`dateTimeZone ( string date, string timezone [ string format ] )`

The results will be [`\DateTimeImmutable` PHP objects](https://www.php.net/manual/fr/class.datetimeimmutable.php).
