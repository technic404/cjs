@echo off
setlocal

:: Prompt for input
set /p userInput="Enter version number: "

:: Remove the build folder if it exists, then create a new one
if exist build (
    rd /s /q build
)
mkdir build

:: Copy the ./cmd folder to ./build/cmd
xcopy /e /i /y cmd build\cmd >nul

:: Remove the ./build/cmd/node_modules folder
if exist build\cmd\node_modules (
    rd /s /q build\cmd\node_modules
)

:: Remove the ./build/cmd/package-lock.json file
if exist build\cmd\package-lock.json (
    del /q build\cmd\package-lock.json 
)

:: Copy c.js to ./build/c.js
copy c.js build\c.js >nul

:: Create a zip archive with the contents of the build folder
powershell Compress-Archive -Path build\* -DestinationPath "build\cjs-v%userInput%.zip" -Force

echo Archive cjs-v%userInput%.zip has been created.