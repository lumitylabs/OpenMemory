@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

:: Define variables
SET MinicondaInstaller=Miniconda3-py311_23.9.0-0-Windows-x86_64.exe
SET MinicondaURL=https://repo.anaconda.com/miniconda/%MinicondaInstaller%
SET ProjectFolder=miniconda
SET EnvironmentName=openmemory_env
SET RequirementsFile=requirements.txt
SET OpenMemoryExe=openmemory.exe
SET OpenChatModelFile=..\llm_api\model\openchat_3.5.Q5_K_M.gguf
SET OpenChatModelURL=https://huggingface.co/TheBloke/neural-chat-7B-v3-1-GGUF/resolve/main/neural-chat-7b-v3-1.Q4_K_M.gguf?download=true

:: Define Conda executable path
SET CondaExecutable=%CD%\%ProjectFolder%\condabin\conda.bat

:: Check if Miniconda is installed
IF NOT EXIST "%CondaExecutable%" GOTO installMiniconda

:: Check if the environment exists
CALL "%CondaExecutable%" env list | findstr /C:"%EnvironmentName%" >nul 2>&1
IF %ERRORLEVEL% NEQ 0 GOTO createEnvironment

:: Activate the environment and check if packages are installed
CALL "%CondaExecutable%" activate %EnvironmentName%
pip list | findstr /C:"torch" >nul 2>&1
IF %ERRORLEVEL% NEQ 0 GOTO installPackages

pip list | findstr /C:"llama-cpp-python" >nul 2>&1
IF %ERRORLEVEL% NEQ 0 GOTO installPackages



:run
:: Check if OpenChat model file exists
IF NOT EXIST "%OpenChatModelFile%" (
    echo OpenChat model file not found. Downloading...
    call curl -Lk "%OpenChatModelURL%" > "%OpenChatModelFile%" || ( echo. && echo Openchat failed to download. && goto endScript )
)
:: Run openmemory.exe if all conditions are met
IF EXIST %OpenMemoryExe% (
    CMD /C START "" %OpenMemoryExe%
    GOTO endScript
)

:installMiniconda
echo Downloading and Installing Miniconda...
call curl -Lk "%MinicondaURL%" > "%MinicondaInstaller%" || ( echo. && echo Miniconda failed to download. && goto endScript )
start /wait "" %MinicondaInstaller% /InstallationType=JustMe /RegisterPython=0 /S /D=%CD%\%ProjectFolder%
GOTO createEnvironment

:createEnvironment
echo Creating conda environment...
CALL "%CondaExecutable%" create -y -n %EnvironmentName% python=3.11
GOTO installPackages

:installPackages
CALL "%CondaExecutable%" activate %EnvironmentName%
IF EXIST %RequirementsFile% (
    echo Installing from requirements.txt...
    pip install -r %RequirementsFile%
)
echo Installing llama-cpp-python...
pip install llama-cpp-python --prefer-binary --extra-index-url=https://jllllll.github.io/llama-cpp-python-cuBLAS-wheels/AVX2/cu118
echo Installing PyTorch...
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

GOTO run

:endScript
echo Script execution complete.
exit
ENDLOCAL