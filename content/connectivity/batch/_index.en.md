---
title: "Batch"
date: 2023-06-22T12:00:02+02:00
draft: false
type: "plugins"
description: "Fork a single line into multiple lines, or merge multiple lines into one."
weight: 13
---

- [What is it?](#what-is-it)
- [Installation](#installation)
- [Usage](#usage)
    - [Forking a line](#forking-a-line)
    - [Merging multiple lines](#merging-multiple-lines)
---

## What is it?

The Batch plugin can split a single line of data into multiple ones, or can merge multiple lines into a single one.

## Installation

This plugin is already integrated into the Satellite package, so you can’t require it with composer.

## Usage

### Forking a line

`fork` splits data into multiple lines.

In the following example, we have one line containing 2 fields: an `id`, and `images` which contains multiple values.
Instead we want to have multiple lines, each containing a single `image` along with the `id`.

Our example input looks like this:
```json
[{"images": ["one.jpg", "two.jpg", "three.jpg"], "id": 15}]
```

We'll use the "fork" option to split the lines for each value under `images`:

{{< tabs name="fork" >}}

{{< tab name="YAML configuration" codelang="yaml" >}}
batch:
  fork:
    foreach: '@=input["images"]'
    do: '@={ id: input["id"], image: item }'
{{< /tab >}}

{{< tab name="interpreted code" codelang="php" >}}
$results = [];
foreach ($input["images"] as $key => $item) {
    $results[] = ["id" => $input["id"], "image" => $item];
}
{{< /tab >}}
{{< /tabs >}}

The result will be: 
```json
[{"id": 15, "image": "one.jpg"}]
[{"id": 15, "image": "two.jpg"}]
[{"id": 15, "image": "three.jpg"}]
```

### Merging multiple lines

`merge` concatenates many lines traversing the pipeline into fewer lines.

This can be useful if the targeted API can handle many batches of data in a single payload, like Akeneo for example.

Our example input looks like this:
```json
[{"foo": "bar"}]
[{"lorem": "ipsum"}]
[{"ga": "bu"}]
[{"zo": "meu"}]
[{"bla": "bli"}]
```

We'll use the "merge" option. `size` dictates the maximum number of lines to concatenate:

{{< tabs name="fork" >}}

{{< tab name="YAML configuration" codelang="yaml" >}}
batch:
  merge:
    size: 2
{{< /tab >}}
{{< /tabs >}}

When the number of item reaches `size`, the merge will be applied to the next lines, and so on.

The output will be:
```json
[{"foo": "bar"},{"lorem": "ipsum"}]
[{"ga": "bu"},{"zo": "meu"}]
[{"bla": "bli"}]
```