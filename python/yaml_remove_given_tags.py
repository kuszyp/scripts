"""
A script that recursively removes all occurences of a given tag in the yaml files. The name of the tag to remove and the path to the yaml files are passed as a parameters to the script.
"""

import os
import yaml
import argparse


def remove_key_from_dictionary(data, key_to_remove):
    """
    Recursively removes the given key from a nested doctionary
    """
    if isinstance(data, dict):
        if key_to_remove in data:
            del data[key_to_remove]
        for key, value in data.items():
            remove_key_from_dictionary(value, key_to_remove)
    elif isinstance(data, list):
        for item in data:
            remove_key_from_dictionary(item, key_to_remove)


def process_yaml_file(file_path, key_to_remove):
    """
    Reads, removes the key from the YAML file and write the modified content back
    """
    with open(file_path, "r") as file:
        try:
            data = yaml.safe_load(file)
            if data:
                remove_key_from_dictionary(data, key_to_remove)

            with open(file_path, "w") as file:
                yaml.safe_dump(data, file)

            print(f"Processed and updated: {file_path}")
            print(f"Removed key: {key_to_remove}")
        except yaml.YAMLError as e:
            print(f"Error processing {file_path}: {e}")


def process_directory(directory, key_to_remove):
    """
    Recursively process all YAML files in the directory
    """
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".yaml") or file.endswith(".yml"):
                file_path = os.path.join(root, file)
                process_yaml_file(file_path, key_to_remove)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Remove a specific YAML tag from files in a directory"
    )
    parser.add_argument("directory", type=str, help="Path to the directory to process")
    parser.add_argument("tag", type=str, help="The YAML tag (key) to remove")

    args = parser.parse_args()

    directory_path = args.directory
    key_to_remove = args.tag

    process_directory(directory_path, key_to_remove)
    print("Processing completed")
