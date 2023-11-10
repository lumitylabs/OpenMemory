from intermediate_audio_capture import AudioCapture
import pyaudio


from config_manager import read_config, update_config

if __name__ == "__main__":
    p = pyaudio.PyAudio()
    
    # Load existing device index from config
    config = read_config()
    device_index = config.get('device_index')
    
    # If device index doesn't exist in config, ask the user
    if device_index is None:
        for i in range(p.get_device_count()):
            dev = p.get_device_info_by_index(i)
            print("Index:", i, "Name:", dev['name'])
        device_index = int(input("Enter the device index for system audio: "))
        
        # Update the config file
        update_config('device_index', device_index)
    
    audio_capture = AudioCapture(device_index=device_index, type="system")
    audio_capture.record()
