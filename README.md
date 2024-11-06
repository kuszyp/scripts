# scripts

## About

Scripts for automating daily devops tasks. Some of them automate Kubernetes (k8s) and WSO2 tasks

## Table on Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Contributing](#contributing)
4. [License](#license)

## Installation

## Usage

### bash

Before running any of the scripts below, please ensure that you are on the right k8s context

| Name | Description | Params |
| :--- | :--- | :---: |
| `get_secrets.sh` | Download secrets from k8s namespace. The list of the secrets is hardcoded inside the script | `namespace` k8s namespace, `directory_to_save` destination where save the downloaded secrets |
| `backup_ciam_db.sh`  | Create backup file opf WSO2 databases and save it locally. List of databases to backup, `username` and `port` are hardcoded in the script. The database `password` and `pod` name are extracted automatically by the script. | `namespace` k8s namespace, `output_directory` destination where save the backup file |
| `yaml_parse_data.sh` | Read and manipulare yaml config using `jq` and `yq` libraries | |

### lua

### python

## Contributing

## License

This project is licensed under the [MIT License](LICENSE).
