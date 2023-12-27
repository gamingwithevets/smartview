This repository aims to recreate the original source tree of the SmartView emulators. All code present here is 100% **NOT** mine.

## The provided build
The provided built JavaScript code was a `min.js` file, obfuscated with [obfuscator.io](https://obfuscator.io) and encrypted with AES-128-CBC. You can easily decrypt it with this Linux command:
```
openssl aes-128-cbc -d -in <input> -out <output> -iv AB2CD182AC895CD79645BBD0AEF33365 -K CA10B9BB2906DA2166D5470ED3E180D3
```
There's a [free deobfuscator](https://obf-io.deobfuscate.io/) online specifically for deobfuscating scripts obfuscated with obfuscator.io.
Unfortunately, most variable names were lost during the obfuscation. This project aims to restore those variable names and make the code readable again, as well as restore the original source tree of the emulator.

## Building
Currently, there's no way to actually make a build yet. However, it is known that the emulator was built with node.js and uses the modules `base64-js`, `buffer`, `ieee754` and `ts-md5` (included in this repo).
