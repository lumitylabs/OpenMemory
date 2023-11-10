Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /K uvicorn server:app --reload"
