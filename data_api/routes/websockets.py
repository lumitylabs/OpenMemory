from fastapi import APIRouter, WebSocket
from typing import List
import json
router = APIRouter()
active_websockets: List[WebSocket] = []

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_websockets.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except Exception:
        active_websockets.remove(websocket)

async def notify_websockets(data):
    json_data = json.dumps(data)
    for ws in active_websockets:
        await ws.send_text(json_data)