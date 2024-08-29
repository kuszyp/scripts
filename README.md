# scripts

## About

Scripts for automating daily work mainly with Kubernetes (k8s) and WSO2 products

## Table on Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Contributing](#contributing)
4. [License](#license)

## Installation

## Usage

Before running any of the scripts below, please ensure that you are on the right k8s context

### get_secrets.sh

First parameter `namespace` specifies the name of the namespace from which we want to retrieve the secrets.
Second parameter `directory_to_save` is the destination where the secrets will be saved.
The list of the secrets to download is hardcoded inside the script.

```bash
sh get_secrets.sh test-namespace ~/tmp/secrets/copy 
```

### backup_ciam_db.sb

The script creates a backup file of WSO2 databases and saves it locally.
First parameter `namespace` specifies the name of the namespace where the database pod is.
Second parameter `output_directory` is the destination where the backup file will be saved.
List of databases to backup, `username` and `port` are hardcoded in the script. The database `password` and `pod` name are extracted automatically by the script.

## Contributing

## License

This project is licensed under the [MIT License](LICENSE).

