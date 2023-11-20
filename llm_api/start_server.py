import uvicorn
import signal
import asyncio

async def shutdown_server(server):
    # Gracefully shutdown the server
    await server.shutdown()

def signal_handler(server, sig, frame):
    print('Signal received, shutting down...')
    # Run the shutdown process in an asyncio event loop
    loop = asyncio.get_event_loop()
    loop.run_until_complete(shutdown_server(server))
    loop.close()

if __name__ == "__main__":
    config = uvicorn.Config("server:app", host="127.0.0.1", port=8004, reload=True)
    server = uvicorn.Server(config)

    # Bind the signal handlers
    signal.signal(signal.SIGINT, lambda s, f: signal_handler(server, s, f))
    signal.signal(signal.SIGTERM, lambda s, f: signal_handler(server, s, f))

    # Run the server
    server.run()