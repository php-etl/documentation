---
title: "SFTP"
date: 2021-08-09T14:55:05+02:00
draft: false
type: "plugins"
icon: "ti-cloud-up"
description: "Transfer files to a remote secured SFTP location"
weight: 6
---

- [What is it ?](#what-is-it-)
- [Installation](#installation)
- [Usage](#usage)
    - [Building a loader](#building-a-loader)
    - [Sample configuration](#sample-configuration)
---

> FTP, File Transfer Protocol, is a protocol used to transfer files from a computer to a server or from a server to a 
> computer.

## What is it ?

The SFTP plugin aims at integrating the files uploader into the [Pipeline stack](https://github.com/php-etl/pipeline).

## Installation

This plugin is already integrated into the Satellite package, so you can't require it with the composer.

## Usage

Unlike the other plugins, the FTP plugin can only be used to load data.

### Building a loader

To build a loader, you need to define a list of servers to which files will be sent and choose which files will be sent.

#### Configuring your servers

Each server must have a `host`, a `port` (optional, use port 21 by default), the `username` and `password` to connect to the 
server and the `base_path` of the server where the files will be sent. 

```yaml
sftp:
  loader:
    servers:
      - host: 'http://localhost'
        port: 21
        username: 'root'
        password: 'root' 
        base_path: /
```

It's possible to activate the passive mode when connecting to a server with the `passive_mode` option.

```yaml
sftp:
  loader:
    servers:
      - # ...
        passif_mode: true
```

#### Configuring your files

Next, you need to determine the specific path of each file you are going to upload and its content.

```yaml
sftp:
  loader:
    put:
      - path: my/file/path
        content: 'my_content'
```

It's possible to upload only those files that meet a condition using the `if` option.
 
```yaml
sftp:
  loader:
    put:
      - # ...
        if: '@=input["image"] !== null'
```

### Sample configuration

```yaml
sftp:
  loader:
    servers:
      - host: 'http://localhost'
        port: 21
        username: 'root'
        password: 'root' 
        base_path: /
  put:
    - path: my/file/path
      content: 'my_content'
```
