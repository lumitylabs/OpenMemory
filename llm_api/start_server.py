import sys
import os
script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.append(script_dir)
import uvicorn
import signal
import asyncio

async def shutdown_server(server):
    await server.shutdown()

def signal_handler(server, sig, frame):
    print('Signal received, shutting down...')
    loop = asyncio.get_event_loop()
    loop.run_until_complete(shutdown_server(server))
    loop.close()

if __name__ == "__main__":
    config = uvicorn.Config("server:app", host="127.0.0.1", port=8004, reload=True)
    server = uvicorn.Server(config)

    signal.signal(signal.SIGINT, lambda s, f: signal_handler(server, s, f))
    signal.signal(signal.SIGTERM, lambda s, f: signal_handler(server, s, f))

    server.run()