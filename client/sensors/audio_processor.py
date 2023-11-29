import os
import numpy as np
import time
from datetime import datetime
from faster_whisper import WhisperModel
import logging
import sys
import noisereduce as nr
import librosa
import argparse
current_directory = os.path.dirname(os.path.abspath(__file__))
parent_directory = os.path.dirname(current_directory)

current_dir = os.path.dirname(os.path.realpath(__file__))

sys.path.append(parent_directory)
from model.database_manager import DatabaseManager


db_manager = DatabaseManager()


os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"
logging.basicConfig(level=logging.INFO)
min_probability = 0.7
class AudioProcessor:
    def __init__(self, model_size="large-v2", device="cuda"):
        self.type = type
        self.model_whisper = WhisperModel(model_size, device=device)
        #self.model_whisper.feature_extractor.mel_filters = self.model_whisper.feature_extractor.get_mel_filters(self.model_whisper.feature_extractor.sampling_rate, self.model_whisper.feature_extractor.n_fft, n_mels=128)
        

        self.folder_path = f"temp/audio/{self.type}"
        self.processed_files = set()

    def process_and_delete(self, types, memory_id=None):
        try:
            for type in types:
                folder_path = os.path.join(current_dir, f"../temp/audio/{type}")
                processed_files = set()
                if os.path.exists(folder_path): 
                    new_files = [f for f in os.listdir(folder_path) if f.endswith(".npy") and f not in processed_files]
                    for filename in new_files:
                        file_path = os.path.join(folder_path, filename)
                        
                        parts = filename.split('-')
                        date_str = parts[0][0:8]
                        date_time_obj = datetime.strptime(date_str, '%Y%m%d')
                        date_str_new_format = date_time_obj.strftime('%m%d%Y')
                        time_str = parts[0][8:14]
                        time_str = time_str[:2] + ':' + time_str[2:4] + ':' + time_str[4:]
                        rate = parts[1]
                        channels = parts[2]
                        proc = parts[3].split('(')[1].split(')')[0]
                        mem_id = parts[4].replace(".npy","")
                        if memory_id is not None and mem_id != memory_id:
                            print("skip:" + mem_id)
                            continue

                        audio_chunk = np.load(file_path)
                        transcribed_text = self.process_audio(audio_chunk, rate, channels)
                        if transcribed_text != "":
                            self.save_to_db(mem_id, date_str_new_format, time_str, transcribed_text, type, proc)
                        
                        os.remove(file_path)
                        processed_files.add(filename)
                else:
                    print(current_dir)
                    print("folder not found")
            time.sleep(5)
        except Exception as e:
            logging.error(f"An error occurred: {e}")
    
    def process_audio(self, audio_chunk, rate, channels):
        try:
            audio_chunk = librosa.resample(audio_chunk, orig_sr=int(rate)*int(channels), target_sr=16000)
            low_noise = nr.reduce_noise(y=audio_chunk, sr=16000,
                prop_decrease=1, 
                time_constant_s=6, 
                freq_mask_smooth_hz=500, 
                time_mask_smooth_ms=16, 
                thresh_n_mult_nonstationary=5, 
                sigmoid_slope_nonstationary=1, 
                n_std_thresh_stationary=5,
                use_torch=True)
            segments, info = self.model_whisper.transcribe(low_noise, vad_filter=True)
            if info.language_probability < min_probability:
                return ""
            text = "".join(segment.text for segment in segments)
            return text
        except:
            print("whisper error, trying on cpu")
            self.model_whisper = WhisperModel("large-v2", device="cpu",compute_type="float32")

    def save_to_db(self, mem_id, date_str, time_str, text, type, proc):
        db_manager.insert_audio_transcription(mem_id, date_str, time_str, type, text, proc)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Process audio files.')
    parser.add_argument('--memory_id', nargs='?', default=None, help='Memory ID to filter files.')
    args = parser.parse_args()

    types = ["system", "microfone"]
    processor = AudioProcessor()
    processor.process_and_delete(types, memory_id=args.memory_id)