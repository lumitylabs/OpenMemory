import json
from model.sensor_config import SensorConfig

config_file = "config.json"

def load_or_create_config():
    try:
        with open(config_file, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        default_config = {
            "sensors": SensorConfig().__dict__,
            "selected_memory": {"id": 0, "name": "default"}
        }
        with open(config_file, "w") as file:
            json.dump(default_config, file)
        return default_config