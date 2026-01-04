Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Iniciando Frontend ROMA" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "C:\Users\annyb\OneDrive\Documentos\PROJETO CARBONE\projeto-carbone"
Set-Location $projectPath

Write-Host "Verificando Node.js..." -ForegroundColor Gray
$nodeVersion = node --version
Write-Host "Node.js versao: $nodeVersion" -ForegroundColor Green
Write-Host ""

Write-Host "Iniciando Vite..." -ForegroundColor Gray
Write-Host "Acesse: http://localhost:5173/login" -ForegroundColor Green
Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Iniciar o Vite
npm run dev

Write-Host ""
Write-Host "Servidor encerrado." -ForegroundColor Red
Read-Host "Pressione Enter para fechar"
