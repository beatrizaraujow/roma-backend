Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Iniciando Backend ROMA" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANTE: NAO FECHE ESTA JANELA!" -ForegroundColor Yellow
Write-Host ""

$projectPath = "C:\Users\annyb\OneDrive\Documentos\PROJETO CARBONE\projeto-carbone"
Set-Location $projectPath

Write-Host "Verificando Node.js..." -ForegroundColor Gray
$nodeVersion = node --version
Write-Host "Node.js versao: $nodeVersion" -ForegroundColor Green
Write-Host ""

Write-Host "Iniciando servidor na porta 3000..." -ForegroundColor Gray
Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Iniciar o servidor
node server.cjs

Write-Host ""
Write-Host "Servidor encerrado." -ForegroundColor Red
Read-Host "Pressione Enter para fechar"
