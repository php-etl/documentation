---
title: "Bare-metal Installation"
date: 2020-07-12T15:21:02+02:00
draft: false
shortDescription: Lorem Ipsum
---

### Contents of this documentation

What we will consider as a *bare-metal* installation, is an installation of at least one component of the middleware in
a vanilla PHP application, without the use of a specific framework.

This process will make use of the *Composer* command all along. Even if Composer is a de-facto standard, please make
sure your application can work with composer.

### Prerequisites

Please check page of [System Requirements](/system-requirements) and ensure your system can work with **Middleware**.
This page will help you install Logstash, ElasticSearch and Kibana in a quick walkthrough.

#### PHP dependencies

We will use the *Satellite* CLI tool, which is responsible in transforming your YAML or JSON pipeline configuration 
files into runnable PHP code.

In your project directory run the following:

`composer require php-etl/satellite`

This command will import the `satellite` command in your project, depending on your framework, you may find it in
different directories:
* bare-metal: `vendor/bin/satellite`
* Symfony: `bin/satellite`

### Prepare your pipelines

Create a `src/my-example-pipeline` directory and add this content to a `pipeline.yaml` file inside:

```yaml
satellite:
  filesystem:
    path: build
  composer:
    require:
      - "php-etl/pipeline:^0.3"
      - "php-etl/fast-map:^0.2"
      - "php-etl/csv-flow:^0.2"
      - "monolog/monolog"
      - "elasticsearch/elasticsearch"
  pipeline:
    steps:
    - csv:
        extractor:
          file_path: 'foo.csv'
      logger:
        channel: pipeline
        destinations:
          - elasticsearch:
              level: warning
              hosts:
                - elasticsearch.example.com:9200
    - fastmap:
        expression_language:
          - 'Kiboko\Component\ExpressionLanguage\Akeneo\AkeneoFilterProvider'
        conditional:
          - condition: 'input["family"] === "clothing"'
            map:
              - field: '[code]'
                copy: '[identifier]'
              - field: '[family]'
                copy: '[family]'
              - field: '[translations][en_US]'
                expression: 'input'
                map:
                  - field: '[name]'
                    expression: 'attribute(input["values"]["variation_name"], locale("en_US"), scope("ecommerce"))'
                  - field: '[slug]'
                    expression: 'input["identifier"]'
                  - field: '[description]'
                    expression: 'attribute(input["values"]["description"], locale("en_US"), scope("ecommerce"))'
                  - field: '[composition]'
                    expression: 'attribute(input["values"]["composition"], locale(null), scope(null))'
                  - field: '[wash_temperature]'
                    expression: 'attribute(input["values"]["wash_temperature"], locale(null), scope(null))'
                  - field: '[care_instructions]'
                    expression: 'attribute(input["values"]["care_instructions"], locale(null), scope(null))'
                  - field: '[material]'
                    expression: 'attribute(input["values"]["material"], locale(null), scope(null))'
          - condition: 'input["family"] === "led_tvs"'
            map:
              - field: '[code]'
                copy: '[identifier]'
              - field: '[family]'
                copy: '[family]'
              - field: '[translations][en_US]'
                expression: 'input'
                map:
                  - field: '[name]'
                    expression: 'attribute(input["values"]["variation_name"], locale("en_US"), scope("ecommerce"))'
                  - field: '[slug]'
                    expression: 'input["identifier"]'
                  - field: '[description]'
                    expression: 'attribute(input["values"]["description"], locale("en_US"), scope("ecommerce"))'
          - condition: 'input["family"] === "accessories"'
            map:
              - field: '[code]'
                copy: '[identifier]'
              - field: '[family]'
                copy: '[family]'
              - field: '[translations][en_US]'
                expression: 'input'
                map:
                  - field: '[name]'
                    expression: 'attribute(input["values"]["variation_name"], locale("en_US"), scope("ecommerce"))'
                  - field: '[slug]'
                    expression: 'input["identifier"]'
                  - field: '[composition]'
                    expression: 'attribute(input["values"]["composition"], locale(null), scope(null))'
                  - field: '[material]'
                    expression: 'attribute(input["values"]["material"], locale(null), scope(null))'
          - condition: 'true'
            map:
              - field: '[code]'
                copy: '[identifier]'
              - field: '[family]'
                copy: '[family]'
      logger:
        channel: pipeline
        destinations:
          - elasticsearch:
              level: warning
              hosts:
                - elasticsearch.example.com:9200
    - sylius:
        loader:
          type: products
          method: create
        client:
          api_url: 'http://localhost'
          client_id: '414yc7d9mnk044ko4wswgw80o8ssw80gssos488kk8ogss40ko'
          secret: '4k8ee6n44m4gkkg0coc8o4w4coscw0w4cg0wg8sc0wsk0sw8gs'
          username: 'api'
          password: 'sylius-api'
      logger:
        channel: pipeline
        destinations:
          - elasticsearch:
              level: warning
              hosts:
                - elasticsearch.example.com:9200
    - stream:
        loader:
          destination: 'stdout'
      logger:
        channel: pipeline
        destinations:
          - elasticsearch:
              level: warning
              hosts:
                - elasticsearch.example.com:9200
```
