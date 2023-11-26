import sys
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.append(script_dir)
import uvicorn
import signal
import asyncio
import requests



async def shutdown_server(server):
    print("Shutting down server...")
    await requests.post("http://localhost:8000/stop_capture")
    await server.shutdown()

def signal_handler(server, sig, frame):
    print('Signal received, shutting down...')
    # Run the shutdown process in an asyncio event loop

    loop = asyncio.get_event_loop()
    loop.run_until_complete(shutdown_server(server))
    loop.close()

if __name__ == "__main__":
    config = uvicorn.Config("server:app", host="127.0.0.1", port=8000, reload=True)
    server = uvicorn.Server(config)

    # Bind the signal handlers
    signal.signal(signal.SIGINT, lambda s, f: signal_handler(server, s, f))
    signal.signal(signal.SIGTERM, lambda s, f: signal_handler(server, s, f))

    # Run the server
    try:
        server.run()
    except KeyboardInterrupt:
        # Trigger FastAPI shutdown event
        asyncio.run(shutdown_server())