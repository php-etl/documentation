---
title: "Workflow"
date: 2021-08-10T10:16:41+02:00
draft: false
---

# Workflow

- [Installation](#installation)
- [Usage](#usage)
    
---

## Installation

``` 
composer require php-etl/workflow
```

## Usage

To define your workflow, you need to specify the `jobs` you need, that is to say your different pipelines.
Please see the [Pipeline documentation](../pipeline) to know how a pipeline should be configured.

```yaml
workflow:
  jobs:
    - pipeline:
        # ...
    - pipeline:
        # ...
```

The `name` option allows you to name your job.

```yaml
workflow:
  jobs:
    - name: 'Pipeline 1'
      pipeline: 
        # ...
```
