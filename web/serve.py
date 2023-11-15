from flask import Flask, send_from_directory
import os
current_directory = os.path.dirname(os.path.abspath(__file__))
static_path = os.path.join(current_directory, "dist")

app = Flask(__name__, static_folder=static_path)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(use_reloader=True, port=5182, threaded=True)
