from flask import Flask, send_from_directory, request
import os
import signal
import threading

current_directory = os.path.dirname(os.path.abspath(__file__))
static_path = os.path.join(current_directory, "dist")

app = Flask(__name__, static_folder=static_path)
shutdown_event = threading.Event()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

def signal_handler(signum, frame):
    print('Signal received, shutting down...')
    shutdown_event.set()

def monitor_shutdown():
    shutdown_event.wait()
    func = request.environ.get('werkzeug.server.shutdown')
    if func is not None:
        func()

if __name__ == '__main__':
    # Bind the signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    # Start the shutdown monitor thread
    monitor_thread = threading.Thread(target=monitor_shutdown)
    monitor_thread.start()

    # Run the Flask app
    app.run(use_reloader=True, port=5182, threaded=True)

    # Wait for the monitor thread to finish
    monitor_thread.join()