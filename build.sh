#!/bin/sh

cd src/emulators_ts

if [ ! -f ts-md5/dist/md5.js ]; then
    cd ts-md5
    npm install .
    cd ..
fi

cd ../..
browserify src/emulators_ts/TI-30XPrio/main/a/bin/TI30XPrioSmartview.js --standalone TIExamCalc > build/ti30xprio/js/ti30xpriosmartview-min.js
#browserify src/emulators_ts/TI-30XPro/main/a/bin/TI30XProSmartview.js --standalone TIExamCalc > build/ti30xpro/js/ti30xprosmartview-min.js
