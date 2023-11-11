import os
import numpy as np
import time
from datetime import datetime
from faster_whisper import WhisperModel
import logging
import sys
import noisereduce as nr
current_directory = os.path.dirname(os.path.abspath(__file__))
parent_directory = os.path.dirname(current_directory)

current_dir = os.path.dirname(os.path.realpath(__file__))

sys.path.append(parent_directory)
from model.database_manager import DatabaseManager


db_manager = DatabaseManager()


os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"
# Initialize logging
logging.basicConfig(level=logging.INFO)
min_probability = 0.7
class AudioProcessor:
    def __init__(self, model_size="large-v3", device="cuda"):
        self.type = type
        self.model_whisper = WhisperModel(model_size, device=device)
        #self.model_whisper.feature_extractor.mel_filters = self.model_whisper.feature_extractor.get_mel_filters(self.model_whisper.feature_extractor.sampling_rate, self.model_whisper.feature_extractor.n_fft, n_mels=128)
        

        self.folder_path = f"temp/audio/{self.type}"
        self.processed_files = set()

    def process_and_delete(self, types):
        #while True:
        try:
            for type in types:
                folder_path = os.path.join(current_dir, f"../temp/audio/{type}")
                processed_files = set()
                if os.path.exists(folder_path):  # Check if folder exists
                    new_files = [f for f in os.listdir(folder_path) if f.endswith(".npy") and f not in processed_files]
                    for filename in new_files:
                        file_path = os.path.join(folder_path, filename)
                        
                        # Extract date_str, time_str, and proc from the filename
                        date_str = filename[0:8]
                        date_time_obj = datetime.strptime(date_str, '%Y%m%d')
                        date_str_new_format = date_time_obj.strftime('%m%d%Y')
                        time_str = filename[8:14]
                        time_str = time_str[:2] + ':' + time_str[2:4] + ':' + time_str[4:]
                        proc = filename.split('-(')[1].split(')')[0]
                        
                        audio_chunk = np.load(file_path)
                        transcribed_text = self.process_audio(audio_chunk)
                        print(transcribed_text)
                        if transcribed_text != "":
                            self.save_to_db(date_str_new_format, time_str, transcribed_text, type, proc)
                        
                        os.remove(file_path)
                        processed_files.add(filename)
                else:
                    print(current_dir)
                    print("folder not found")
            time.sleep(5)
        except Exception as e:
            logging.error(f"An error occurred: {e}")
    
    def process_audio(self, audio_chunk):
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
        print("prob:" + info.language_probability.__str__())
        if info.language_probability < min_probability:
            return ""
        #text = "".join(word.word for segment in segments for word in segment.words)
        text = "".join(segment.text for segment in segments)
        return text

    def save_to_file(self, text, type):
        date_str = datetime.now().strftime("%m%d%Y")
        dir_path = os.path.join(current_dir, f"../data/audio/{type}")
        dt_string = datetime.now().strftime("%H:%M:%S")
        if not os.path.exists(dir_path):
            os.makedirs(dir_path)
        with open(f"{dir_path}/{date_str}.srt", "a", encoding='utf-8') as f:
            f.write(f"{dt_string}|{type}|{text}\n")

    def save_to_db(self, date_str, time_str, text, type, proc):
        db_manager.insert_audio_transcription(date_str, time_str, type, text, proc)

if __name__ == "__main__":
    types = ["system", "microfone"]
    processor = AudioProcessor()
    processor.process_and_delete(types)