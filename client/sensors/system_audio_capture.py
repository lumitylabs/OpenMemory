import sys
import os
script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.append(script_dir)
import argparse  # Import argparse for command-line parsing

from intermediate_audio_capture import AudioCapture
import pyaudiowpatch as pyaudio

from config_manager import read_config, update_config

def get_default_wasapi_device(p_audio: pyaudio.PyAudio):
    try: 
        wasapi_info = p_audio.get_host_api_info_by_type(pyaudio.paWASAPI)
    except OSError:
        raise print("Looks like WASAPI is not available on the system")
        
    sys_default_speakers = p_audio.get_device_info_by_index(wasapi_info["defaultOutputDevice"])
    
    if not sys_default_speakers["isLoopbackDevice"]:
        for loopback in p_audio.get_loopback_device_info_generator():
            if sys_default_speakers["name"] in loopback["name"]:
                return loopback
                break
        else:
            raise print("Default loopback output device not found.\n\nRun `python -m pyaudiowpatch` to check available devices")

if __name__ == "__main__":
    # Set up the argument parser
    parser = argparse.ArgumentParser(description="Audio Capture Script")
    parser.add_argument("--memory_id", type=str, help="Memory ID for audio capture", default="default_id")
    args = parser.parse_args()

    p = pyaudio.PyAudio()
    target_device = get_default_wasapi_device(p)

    # Pass the memory_id to AudioCapture
    audio_capture = AudioCapture(target_device=target_device, type="system", memory_id=args.memory_id)
    audio_capture.record()