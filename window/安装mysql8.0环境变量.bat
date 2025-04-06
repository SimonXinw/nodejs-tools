@echo off
set "MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 8.0\bin"

REM 检查路径是否已存在
echo %PATH% | find /I "%MYSQL_BIN%" >nul
if %errorlevel%==0 (
    echo ✅ MySQL 路径已存在于 PATH 中。
) else (
    setx PATH "%PATH%;%MYSQL_BIN%" /M
    echo ✅ 成功添加 MySQL 路径到系统 PATH。
)

echo.
echo ⚠️ 请重新打开命令提示符以使更改生效。
pause
