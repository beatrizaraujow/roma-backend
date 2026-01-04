@echo off
echo ========================================
echo    Iniciando Backend ROMA
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    echo Instale Node.js: https://nodejs.org
    pause
    exit /b 1
)

echo [2/2] Iniciando servidor...
echo.
echo Backend rodara em: http://localhost:3000
echo.
echo Pressione Ctrl+C para parar o servidor
echo ========================================
echo.

node server.js

pause
