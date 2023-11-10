import json
import os
import os
current_dir = os.path.dirname(os.path.realpath(__file__))

CONFIG_PATH =  os.path.join(current_dir, "../config.json")

def read_config():
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, 'r') as f:
            return json.load(f)
    return {}

def write_config(data):
    with open(CONFIG_PATH, 'w') as f:
        json.dump(data, f)

def update_config(key, value, only_if_none=False):
    config = read_config()
    if only_if_none:
        if config.get(key) is None:
            config[key] = value
    else:
        config[key] = value
    write_config(config)
