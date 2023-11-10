from intermediate_audio_capture import AudioCapture

if __name__ == "__main__":
    audio_capture = AudioCapture(device_index=None, type="microfone")  # Default device for microphone
    audio_capture.record()