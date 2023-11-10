from multiprocessing import Process
import os

def run_script(script_name):
    os.system(f'python {script_name}.py')

if __name__ == "__main__":
    scripts = ["sensors/system_audio_capture", "sensors/microphone_audio_capture", "sensors/screenshot_capture"] #"sensors/audio_processor",

    processes = []

    for script in scripts:
        p = Process(target=run_script, args=(script,))
        p.start()
        processes.append(p)

    for p in processes:
        p.join()
