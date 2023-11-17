from intermediate_audio_capture import AudioCapture
import pyaudiowpatch as pyaudio

def get_default_input_device(p_audio: pyaudio.PyAudio):
    try:
        default_input_device_info = p_audio.get_default_input_device_info()
        return default_input_device_info
    except OSError:
        raise print("Default input device not found. Please check your microphone settings.")

if __name__ == "__main__":
    p = pyaudio.PyAudio()
    target_device = get_default_input_device(p)
    audio_capture = AudioCapture(target_device=target_device, type="microfone")
    audio_capture.record()