import pyaudiowpatch as pyaudio
import numpy as np
import os
import time
from datetime import datetime
import subprocess
import psutil
from pycaw.pycaw import AudioUtilities

current_dir = os.path.dirname(os.path.realpath(__file__))

def get_audio_emitting_processes():
    sessions = AudioUtilities.GetAllSessions()
    emitting_processes = []
    for session in sessions:
        if session.Process and session.State == 1:  # Verifica se o processo está ativo
            volume = session.SimpleAudioVolume.GetMasterVolume()
            if volume > 0:  # Verifica se o volume está acima de 0
                try:
                    process_name = psutil.Process(session.ProcessId).name()
                    emitting_processes.append(f"{process_name} (PID: {session.ProcessId})".replace('.exe',""))
                except Exception as e:
                    emitting_processes.append(f"Process ID: {session.ProcessId}, unable to retrieve name. Error: {e}")
    
    return emitting_processes


class AudioCapture:
    def __init__(self, target_device: dict, type, memory_id, threshold=450, buffer_size=1024):
        self.p = pyaudio.PyAudio()
        self.stream = self.p.open(format=pyaudio.paInt16, channels=target_device["maxInputChannels"], rate=int(target_device["defaultSampleRate"]), 
                                  input=True, frames_per_buffer=buffer_size, input_device_index=target_device["index"])
        self.threshold = threshold
        self.buffer_size = buffer_size
        self.accumulated_audio = np.array([], dtype=np.float32)
        self.time_below_threshold = 0
        self.recording = False
        self.elapsed_time = 0
        self.type = type
        self.memory_id = memory_id
        self.keep_running = True
        self.channels = target_device["maxInputChannels"]
        self.rate = int(target_device["defaultSampleRate"])

    def record(self):
        print("Started recording...")
        self.initial_process_names = set()
        try:
            while self.keep_running:
                start_time = time.time()
                audio_data = np.frombuffer(self.stream.read(self.buffer_size), dtype=np.int16).astype(np.float32)
                current_volume = np.abs(audio_data).mean()
                #if current_volume >= self.threshold:
                #    print(f"Current Volume: {current_volume}")  # Debug print

                if current_volume >= self.threshold and not self.recording:
                    self.recording = True
                    self.time_below_threshold = 0
                    if not self.initial_process_names:
                        self.initial_process_names = set(self.get_process_names().split(','))

                if self.recording:
                    self.accumulated_audio = np.concatenate((self.accumulated_audio, audio_data))

                    if current_volume < self.threshold:
                        if self.time_below_threshold == 0:
                            self.time_below_threshold = time.time()
                        elif time.time() - self.time_below_threshold >= 1:
                            self.save_audio()
                    else:
                        self.time_below_threshold = 0

                    self.elapsed_time += time.time() - start_time

                    if self.elapsed_time >= 30:
                        self.save_audio()
        except KeyboardInterrupt:
            self.keep_running = False
        finally:
            self.stream.stop_stream()
            self.stream.close()

    def get_process_names(self):
        process_output = get_audio_emitting_processes()
        process_names = []

        for process_info in process_output:
            parts = process_info.split(' (PID: ')
            blacklist = ["python", "svchost"]
            if len(parts) == 2 and parts[0] not in blacklist:
                process_name = parts[0]
                process_names.append(process_name)

        if not process_names:
            return 'system' if not self.initial_process_names else ','.join(self.initial_process_names)

        return ','.join(process_names)


    def save_audio(self):
        print("Saving audio...")  
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        folder_path = os.path.join(current_dir, f"../temp/audio/{self.type}")
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)

        filename = timestamp
        

        current_process_names = set(self.get_process_names().split(','))
        all_process_names = self.initial_process_names.union(current_process_names)
        concatenated_process_names = ','.join(all_process_names)
        filename += f'-{self.rate}'
        filename += f'-{self.channels}'
        if self.type == 'system':
            filename += f"-({concatenated_process_names})"
        else:
            filename += f"-({self.type})"
        filename += f"-{self.memory_id}"
        file_path = os.path.join(folder_path, f"{filename}.npy")
        np.save(file_path, self.accumulated_audio)
        self.accumulated_audio = np.array([], dtype=np.float32)
        self.time_below_threshold = 0
        self.recording = False
        self.elapsed_time = 0
