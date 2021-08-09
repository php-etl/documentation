---
title: "FTP"
date: 2021-08-09T14:55:05+02:00
draft: false
---

# FTP Plugin

> FTP, File Transfert Protocol, est un protocole utilisé pour transférer des fichiers d'un ordinateur à un serveur ou d'un 
> serveur à un ordinateur.

## What is it ?

The FTP plugin allows you to upload files on one or many servers.

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
ftp:
  loader:
    servers:
      - host: 'http://localhost'
        port: 21 # The default ftp port
        username: 'root'
        password: 'root' 
        base_path: /
```

It's possible to activate the passive mode when connecting to a server with the `passive_mode` option.

```yaml
ftp:
  loader:
    servers:
      - # ...
        passif_mode: true
```

#### Configuring your files

Next, you need to determine the specific path of each file you are going to upload and its content.

```yaml
ftp:
  loader:
    put:
      - path: my/file/path
        content: 'my_content'
```

It's possible to upload only those files that meet a condition using the `if` option.
 
```yaml
ftp:
  loader:
    put:
      - # ...
        if: '@=input["image"] !== null'
```

### Sample configuration

```yaml
ftp:
  loader:
    servers:
      - host: 'http://localhost'
        port: 21 # The default ftp port
        username: 'root'
        password: 'root' 
        base_path: /
  put:
    - path: my/file/path
      content: 'my_content'
```
