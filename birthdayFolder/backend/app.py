from flask import Flask, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='/')
CORS(app)  # Enable CORS for frontend communication

# Serve frontend
@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

# Serve images
@app.route('/images/<path:filename>')
def serve_images(filename):
    return send_from_directory(os.path.join('images'), filename)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
