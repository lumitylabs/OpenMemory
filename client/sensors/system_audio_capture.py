from intermediate_audio_capture import AudioCapture
import pyaudiowpatch as pyaudio

from config_manager import read_config, update_config

def get_default_wasapi_device(p_audio: pyaudio.PyAudio):        
        
        try: # Get default WASAPI info
            wasapi_info = p_audio.get_host_api_info_by_type(pyaudio.paWASAPI)
        except OSError:
            raise print("Looks like WASAPI is not available on the system")
            
        # Get default WASAPI speakers
        sys_default_speakers = p_audio.get_device_info_by_index(wasapi_info["defaultOutputDevice"])
        
        if not sys_default_speakers["isLoopbackDevice"]:
            for loopback in p_audio.get_loopback_device_info_generator():
                if sys_default_speakers["name"] in loopback["name"]:
                    return loopback
                    break
            else:
                raise print("Default loopback output device not found.\n\nRun `python -m pyaudiowpatch` to check available devices")
            

if __name__ == "__main__":
    p = pyaudio.PyAudio()
    target_device = get_default_wasapi_device(p)
    audio_capture = AudioCapture(target_device=target_device, type="system")
    audio_capture.record()