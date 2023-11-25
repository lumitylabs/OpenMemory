import json

from model.load_or_create_config import load_or_create_config
config_file = "data_config.json"

def update_config(key, value):
    config = load_or_create_config()
    if key == "selected_memory":
        config[key] = value
    else:
        config["sensors"][key] = value
    with open(config_file, "w") as file:
        json.dump(config, file)