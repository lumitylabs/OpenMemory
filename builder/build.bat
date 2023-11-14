set "SOURCE_DIR=.."
set "DEST_DIR=./build"
if not exist "%DEST_DIR%" mkdir "%DEST_DIR%"

call electron-packager "../launcher" openmemory --platform=win32 --arch=x64 --out "./build"
copy .\addons\install.bat .\build\openmemory-win32-x64\
copy .\addons\requirements.txt .\build\openmemory-win32-x64\
copy .\addons\config.json .\build\openmemory-win32-x64\
copy .\addons\start.bat .\build\

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

robocopy "%SOURCE_DIR%/client" "%DEST_DIR%/client" /E /XD temp data model\chroma /XF *.gguf *.db *.db-journal *.sqlite-journal *.sqlite3-journal *.wal *.shm *.pyc config.json last_processed_record.json last_synced_record.json
robocopy "%SOURCE_DIR%/data_api" "%DEST_DIR%/data_api" /E /XF *.gguf *.db *.db-journal *.sqlite-journal *.sqlite3-journal *.wal *.shm *.pyc
robocopy "%SOURCE_DIR%/llm_api" "%DEST_DIR%/llm_api" /E /XF *.gguf *.db *.db-journal *.sqlite-journal *.sqlite3-journal *.wal *.shm *.pyc

pause