setlocal

:: Definindo diretórios
set "SOURCE_DIR=.."
set "DEST_DIR=./build"
set "PYTHON_DIR=%DEST_DIR%\openmemory-win32-x64\python_embedding"
set "PYTHON_VERSION=3.11.0"  ; Ajuste para a versão desejada do Python
set "PYTHON_URL=https://www.python.org/ftp/python/%PYTHON_VERSION%/python-%PYTHON_VERSION%-embed-amd64.zip"

:: Criando pacote com Electron
pushd %CD%
cd ../launcher
call npm run build
popd
if not exist "%DEST_DIR%" mkdir "%DEST_DIR%"
call electron-packager "../launcher" openmemory --platform=win32 --arch=x64 --out "./build"

:: Copiando arquivos necessários
copy .\addons\install_CUDA_118.bat .\build\openmemory-win32-x64\
copy .\addons\install_CUDA_121.bat .\build\openmemory-win32-x64\
copy .\addons\requirements.txt .\build\openmemory-win32-x64\
copy .\addons\config.json .\build\openmemory-win32-x64\
copy .\addons\setup_CUDA_118.bat .\build\
copy .\addons\setup_CUDA_121.bat .\build\

:: Salvando o diretório atual
set "CURRENT_DIR=%CD%"

:: Mudando para o diretório web e rodando npm run build
cd /d %SOURCE_DIR%\web
call npm run build

:: Voltando para o diretório original
cd /d %CURRENT_DIR%

:: Copiando a pasta dist para o destino
if not exist "%DEST_DIR%\web\dist" mkdir "%DEST_DIR%\web\dist"
xcopy /E /I "%SOURCE_DIR%\web\dist" "%DEST_DIR%\web\dist"
copy .\addons\serve.py .\build\web

:: Executando operações de robocopy
robocopy "%SOURCE_DIR%/client" "%DEST_DIR%/client" /E /XD temp data model\chroma /XF *.gguf *.db *.db-journal *.sqlite-journal *.sqlite3-journal *.wal *.shm *.pyc config.json last_processed_record.json last_synced_record.json
robocopy "%SOURCE_DIR%/data_api" "%DEST_DIR%/data_api" /E /XF *.gguf *.db *.db-journal *.sqlite-journal *.sqlite3-journal *.wal *.shm *.pyc
robocopy "%SOURCE_DIR%/llm_api" "%DEST_DIR%/llm_api" /E /XF *.gguf *.db *.db-journal *.sqlite-journal *.sqlite3-journal *.wal *.shm *.pyc
if not exist "%SOURCE_DIR%/client/data/screencapture" mkdir "%SOURCE_DIR%/client/data/screencapture"

:: Baixando e extraindo Python Embeddable
curl -L %PYTHON_URL% -o python_embed.zip
7z x python_embed.zip -o"%PYTHON_DIR%"
del python_embed.zip

:: Modificando o arquivo .pth para reconhecer pacotes instalados globalmente
echo import site >> "%PYTHON_DIR%\python%PYTHON_VERSION:~0,1%%PYTHON_VERSION:~2,2%._pth"

:: Instalando Pip
curl https://bootstrap.pypa.io/get-pip.py -o "%PYTHON_DIR%\get-pip.py"
"%PYTHON_DIR%\python.exe" "%PYTHON_DIR%\get-pip.py"

:: Instalando dependências do Python usando o caminho completo para pip
"%PYTHON_DIR%\Scripts\pip.exe" install -r .\addons\requirements.txt

pause