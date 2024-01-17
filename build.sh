#!/bin/sh

if [ ! -f src/emulators_ts/ts-md5/dist/md5.js ]; then
    npm install src/emulators_ts/ts-md5
fi

browserify src/emulators_ts/TI-30XPrio/main/a/bin/TI30XPrioSmartview.js --standalone TIExamCalc > build/ti30xprio/js/ti30xpriosmartview-min.js
browserify src/emulators_ts/TI-30XPro/main/a/bin/TI30XProSmartview.js --standalone TIExamCalc > build/ti30xpro/js/ti30xprosmartview-min.js
browserify src/emulators_ts/TI-30XPlus/main/a/bin/TI30XPlusSmartview.js --standalone TIExamCalc > build/ti30xplus/js/ti30xplussmartview-min.js
