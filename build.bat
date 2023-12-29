@echo off
cd src\emulators_ts

if not exist ts-md5\dist\md5.js (
cd ts-md5
npm install .
cd..
)

cd ..\..
browserify src\emulators_ts\TI-30XPrio\main\a\bin\TI30XPrioSmartview.js --standalone TIExamCalc > build\ti30xprio\js\ti30xpriosmartview-min.js
::browserify src\emulators_ts\TI-30XPro/main\a\bin\TI30XProSmartview.js --standalone TIExamCalc > build\ti30xpro\js\ti30xprosmartview-min.js


