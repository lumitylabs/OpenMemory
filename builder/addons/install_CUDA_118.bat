@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

:: Define variables
SET PythonExecutable=python_embedding\python.exe
SET OpenMemoryExe=openmemory.exe
SET OpenMemoryExePath=%CD%\%OpenMemoryExe%
SET OpenMemoryLinkPath=%CD%\..\openmemory.lnk
SET OpenMemoryDesktopLinkPath=%USERPROFILE%\Desktop\openmemory.lnk
SET OpenChatModelFile=..\llm_api\model\model.gguf
SET OpenChatModelURL=https://huggingface.co/TheBloke/Starling-LM-7B-alpha-GGUF/resolve/main/starling-lm-7b-alpha.Q4_K_M.gguf?download=true

:: Check if Python is installed
IF NOT EXIST "%PythonExecutable%" (
    echo Python executable not found in python_embedding folder.
    goto endScript
)

:: Install required packages
echo Installing required packages...
"%PythonExecutable%" -m pip install llama-cpp-python --prefer-binary --extra-index-url=https://jllllll.github.io/llama-cpp-python-cuBLAS-wheels/AVX2/cu118
"%PythonExecutable%" -m pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

:run
:: Check if OpenChat model file exists
IF NOT EXIST "%OpenChatModelFile%" (
    echo OpenChat model file not found. Downloading...
    call curl -Lk "%OpenChatModelURL%" > "%OpenChatModelFile%" || ( echo. && echo Openchat failed to download. && goto endScript )
)

:: Create shortcuts for openmemory.exe if it exists
IF EXIST %OpenMemoryExe% (
    echo Set oWS = WScript.CreateObject^("WScript.Shell"^) > create_shortcut.vbs
    echo sLinkFile = "%OpenMemoryLinkPath%" >> create_shortcut.vbs
    echo Set oLink = oWS.CreateShortcut^(sLinkFile^) >> create_shortcut.vbs
    echo oLink.TargetPath = "%OpenMemoryExePath%" >> create_shortcut.vbs
    echo oLink.WorkingDirectory = "%CD%" >> create_shortcut.vbs
    echo oLink.Save >> create_shortcut.vbs

    echo Set oWS = WScript.CreateObject^("WScript.Shell"^) > create_desktop_shortcut.vbs
    echo sLinkFile = "%OpenMemoryDesktopLinkPath%" >> create_desktop_shortcut.vbs
    echo Set oLink = oWS.CreateShortcut^(sLinkFile^) >> create_desktop_shortcut.vbs
    echo oLink.TargetPath = "%OpenMemoryExePath%" >> create_desktop_shortcut.vbs
    echo oLink.WorkingDirectory = "%CD%" >> create_desktop_shortcut.vbs
    echo oLink.Save >> create_desktop_shortcut.vbs

    cscript //nologo create_shortcut.vbs
    cscript //nologo create_desktop_shortcut.vbs

    del create_shortcut.vbs
    del create_desktop_shortcut.vbs

    CMD /C START "" %OpenMemoryExe%
    GOTO endScript
)

:endScript
echo Script execution complete.
exit
ENDLOCAL
