@echo off
setlocal

:: Prompt for input
set /p userInput="Enter version number: "

echo Recreating build folder

if exist build (
    rd /s /q build
)
mkdir build

echo Copying ./cmd folder to ./build/cmd

xcopy /e /i /y cmd build\cmd >nul

echo Copying ./common folder to ./build common

xcopy /e /i /y common build\common >nul

echo Removing ./build/cmd/node_modules folder

if exist build\cmd\node_modules (
    rd /s /q build\cmd\node_modules
)

echo Removing ./build/cmd/package-lock.json file

if exist build\cmd\package-lock.json (
    del /q build\cmd\package-lock.json 
)

echo Copying c.js to ./build/c.js

copy c.js build\c.js >nul

echo Copying install.bat to ./build/install.bat

copy install.bat build\install.bat >nul

echo Creating zip archive with the contents of the build folder

powershell Compress-Archive -Path build\* -DestinationPath "build\cjs-v%userInput%.zip" -Force

echo Creating a zip archive with the contents of the cmd folder

powershell Compress-Archive -Path build\cmd\* -DestinationPath "build\cjs-cmd-v%userInput%.zip" -Force

echo Preapring source folder

mkdir build\source

move /y build\c.js build\source\c.js
move /y build\install.bat build\source\install.bat
move /y build\cmd build\source\cmd
move /y build\common build\source\common

echo Successfully finished