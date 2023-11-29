import sys
import os
import argparse  
script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.append(script_dir)
from intermediate_audio_capture import AudioCapture
import pyaudiowpatch as pyaudio

def get_default_input_device(p_audio: pyaudio.PyAudio):
    try:
        default_input_device_info = p_audio.get_default_input_device_info()
        return default_input_device_info
    except OSError:
        raise print("Default input device not found. Please check your microphone settings.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Audio Capture Script")
    parser.add_argument("--memory_id", type=str, help="Memory ID for audio capture", default="0")
    args = parser.parse_args()

    p = pyaudio.PyAudio()
    target_device = get_default_input_device(p)

    audio_capture = AudioCapture(target_device=target_device, type="microfone", memory_id=args.memory_id)
    audio_capture.record()