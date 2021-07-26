---
title: "System Requirements"
date: 2020-07-12T15:21:02+02:00
draft: false
---

### Contents of this documentation

In this documentation, we will make sure all your system and application dependencies are correct, 
before you start using *Middleware*.

### Prepare your dependencies in Docker

We will use Logstash, Elasticsearch and Kibana as a logging platform.
 
As those systems are complex to instakll and out-of-scope of this documentation, we will use Docker to start those services.

#### Logstash

Logstash is a tool whose primary goal is to consume logging from other applications, optionally apply transformations to
it and then transfer it to a log storage.

In your project, create a file named `.docker/logstash/logstash.yml` with the following contents:

```yaml
pipeline:
  batch:
    delay: 50
    size: 125
```

To configure a logging pipeline for logstash, we will create a second file named `.docker/logstash/pipeline/tcp.conf` with the following content:

```
input {
  tcp {
     port => 5044
     host => "0.0.0.0"
     codec => json
  }
}

filter {
  date {
    match => [ "timeMillis", "UNIX_MS" ]
  }
}

output {
  elasticsearch {
    hosts => "elasticsearch:9200"
  }
}
```

Now, you will need to add a new logstash service in your `docker-compose.yaml` file:

```yaml
services:
  logstash:
    image: docker.elastic.co/logstash/logstash:7.12.1
    volumes:
      - ./.docker/logstash/logstash.yml:/usr/share/logstash/config/logstash.yml
      - ./.docker/logstash/pipeline:/usr/share/logstash/pipeline/
    restart: unless-stopped
    depends_on:
      - elasticsearch
```

#### ElasticSearch

ElasticSearch is a Document oriented database, whose main usage are logs storage and search indexation. We will use if for both.

In your project, create a file named `.docker/elasticsearch/elasticsearch.yml` with the following contents:

```yaml
cluster.name: 'hackathon-cluster'
bootstrap.memory_lock: true
discovery.type: 'single-node'

http.host: '0.0.0.0'
http.port: 9200

# Uncomment the following lines for a production cluster deployment
#transport.host: 0.0.0.0
#discovery.zen.minimum_master_nodes: 1

http.cors.enabled : true
http.cors.allow-origin : "*"
http.cors.allow-methods : OPTIONS, HEAD, GET, POST, PUT, DELETE
http.cors.allow-headers : X-Requested-With,X-Auth-Token,Content-Type, Content-Length
cluster.routing.allocation.disk.threshold_enabled: false

```

Now, you will need to add a new elasticsearch service and a dedicated volume in your `docker-compose.yaml` file:

```yaml
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.12.1
    ports:
      - ${ELASTICSEARCH_PORT:-9200}:9200
    environment:
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - elasticsearch:/usr/share/elasticsearch/data
      - ./.docker/elasticsearch/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
    restart: unless-stopped

volumes:
  elasticsearch:
    driver: local
```

#### Kibana

Kibana is web interface for ElasticSearch storage, capable of building graphic representations of aggregation searches.

In your project, create a file named `.docker/kibana/kibana.yml` with the following contents:

```yaml
server.port: 5601
server.host: "0.0.0.0"
elasticsearch.hosts: "http://elasticsearch:9200"
```

Now, you will need to add a new kibana service in your `docker-compose.yaml` file:

```yaml
services:
  kibana:
    image: docker.elastic.co/kibana/kibana:7.12.1
    ports:
      - ${KIBANA_PORT:-5601}:5601
    environment:
      - monitoring.elasticsearch.hosts=http://elasticsearch:9200
    volumes:
      - ./.docker/kibana/kibana.yml:/usr/share/kibana/config/kibana.yml
    restart: unless-stopped
    depends_on:
      - elasticsearch
```

### RabbitMQ

RabbitMQ is a message queue service, handling storage, routing and concurrency handling between consumers.

In your project, create a file named `.docker/amqp/Dockerfile` with the following contents:

```dockerfile
FROM rabbitmq:3.7-management-alpine

RUN set -ex\
    && apk update \
    && apk upgrade \
    && apk add --no-cache --virtual .build-deps \
        zip \
        curl \
    && curl https://dl.bintray.com/rabbitmq/community-plugins/3.7.x/rabbitmq_delayed_message_exchange/rabbitmq_delayed_message_exchange-20171201-3.7.x.zip > $RABBITMQ_HOME/plugins/rabbitmq_delayed_message_exchange-20171201-3.7.x.zip \
    && unzip $RABBITMQ_HOME/plugins/rabbitmq_delayed_message_exchange-20171201-3.7.x.zip -d $RABBITMQ_HOME/plugins \
    && rm $RABBITMQ_HOME/plugins/rabbitmq_delayed_message_exchange-20171201-3.7.x.zip \
    && apk del .build-deps

RUN rabbitmq-plugins enable --offline rabbitmq_delayed_message_exchange
RUN rabbitmq-plugins enable --offline rabbitmq_consistent_hash_exchange
RUN rabbitmq-plugins enable --offline rabbitmq_management
```

Now, you will need to add a new amqp service in your `docker-compose.yaml` file:

```yaml
services:
  amqp:
    build:
      context: .docker/amqp/
    ports:
      - ${AMQP_PORT:-15672}:15672
    environment:
      - RABBITMQ_DEFAULT_USER=${AMQP_USER:-kiboko}
      - RABBITMQ_DEFAULT_PASS=${AMQP_PASSWORD:-password}
    restart: unless-stopped
```

### Redis

Redis is a NoSQL database service.

In your project, create a file named `.docker/redis/Dockerfile` with the following contents:

```dockerfile
FROM redis:5-alpine

COPY redis.conf /usr/local/etc/redis/redis.conf

CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]
```
In your project, create a file named `.docker/redis/redis.conf` with the following contents:

```apacheconf
bind 0.0.0.0
port 6379

protected-mode yes

tcp-backlog 511
timeout 0
tcp-keepalive 300

daemonize no
supervised upstart

pidfile /var/run/redis_6379.pid

loglevel notice
logfile ""

databases 16

always-show-logo yes

save 900 1
save 300 10
save 60 10000

stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb

dir ./

replica-serve-stale-data yes
replica-read-only yes
repl-diskless-sync no
repl-diskless-sync-delay 5
repl-disable-tcp-nodelay no
replica-priority 100

lazyfree-lazy-eviction no
lazyfree-lazy-expire no
lazyfree-lazy-server-del no
replica-lazy-flush no

appendonly no
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
aof-load-truncated yes
aof-use-rdb-preamble yes

lua-time-limit 5000

slowlog-log-slower-than 10000
slowlog-max-len 128

latency-monitor-threshold 0

notify-keyspace-events ""

hash-max-ziplist-entries 512
hash-max-ziplist-value 64
list-max-ziplist-size -2
list-compress-depth 0
set-max-intset-entries 512
zset-max-ziplist-entries 128
zset-max-ziplist-value 64
hll-sparse-max-bytes 3000
stream-node-max-bytes 4096
stream-node-max-entries 100
activerehashing yes
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit replica 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60
hz 10
dynamic-hz yes
aof-rewrite-incremental-fsync yes
rdb-save-incremental-fsync yes
```

Now, you will need to add a new amqp service in your `docker-compose.yaml` file:

```yaml
services:
  redis:
    build:
      context: .docker/redis/
    restart: unless-stopped
    ports:
      - ${REDIS_PORT:-6379}:6379
```
