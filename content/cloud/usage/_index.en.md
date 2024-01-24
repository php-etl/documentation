---
title: "Usage"
date: 2024-01-12T14:52:40+01:00
draft: true
---

Gyroscops also allows you to have your satellites stored in the cloud.

Thanks to the cloud executable provided by the package `php-etl/satellite`,
you can manage your satellites quickly and easily thanks to command lines.

## Requirements

Before you start, make sure you have installed the utility in your project.

If you haven't already done so, simply run this command:

```shell
composer require php-etl/satellite:'*'
```

## Log into the API

The `login` command is used to establish a connection with the Gyroscops API, allowing access to the various functionalities.
Before executing this command, make sure you have the necessary identification information to hand.

```shell
bin/cloud login
```

> The service may ask you to select your organization and your workspace.

### Options
- `-u`, `--url`: Base URL of the cloud instance [default: "https://app.gyroscops.com"]
- `--beta`: Shortcut to set the cloud instance to https://beta.gyroscops.com
- `--ssl`|`--no-ssl`: Enable or disable SSL
- `--help`:  Display help for the given command

See the following sections of this documentation for details of the various commands.

## Create your satellite

The `create` command is used to create a satellite associated with your account.

```shell
php bin/cloud create <path/to/satellite.yaml>
```

### Options
- `-u`, `--url`: Base URL of the cloud instance [default: "https://app.gyroscops.com"]
- `--beta`: Shortcut to set the cloud instance to https://beta.gyroscops.com
- `--ssl`|`--no-ssl`: Enable or disable SSL
- `--help`:  Display help for the given command

Once you have created your satellite, you can access its configuration from the interface by following these steps:

- Enter the following URL in the address bar: https://app.gyroscops.com (or https://beta.gyroscops.com)
- Log in with your credentials

## Update your satellite

The `update` command is used to update a given satellite.

```shell
php bin/cloud update <path/to/satellite.yaml>
```

### Options
- `-u`, `--url`: Base URL of the cloud instance [default: "https://app.gyroscops.com"]
- `--beta`: Shortcut to set the cloud instance to https://beta.gyroscops.com
- `--ssl`|`--no-ssl`: Enable or disable SSL
- `--help`:  Display help for the given command

## Remove your satellite

The `remove` command is used to remove a given satellite.

```shell
php bin/cloud remove <path/to/satellite.yaml>
```

### Options
- `-u`, `--url`: Base URL of the cloud instance [default: "https://app.gyroscops.com"]
- `--beta`: Shortcut to set the cloud instance to https://beta.gyroscops.com
- `--ssl`|`--no-ssl`: Enable or disable SSL
- `--help`:  Display help for the given command

## Other commands

In addition to the main commands we have already explored, this command line utility offers a number of additional features. 
These commands can be useful in a variety of situations. 

For a list of these commands, use the following command:

```shell
bin/cloud list
```
