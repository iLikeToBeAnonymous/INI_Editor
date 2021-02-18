# INI_Editor
Purpose-built INI GUI editor for my needs.
**Warning:** _This is not a turnkey tool for editing INI files._ <br>It's primarily my playing around with things. 
It also has some built-in examples of how to turn HTML inputs directly into a formatted JSON file.


## Building/make

### Using electron builder:

1. Make sure electron builder is installed globally:
   ```powershell
   npm install -g electron-builder@latest
   ```

2. Next, install it as a dev dependency in your project:
   ```powershell
   npm install -D electron-builder@latest
   ```

3. Edit your `package.json` to make it work with electron-builder. According to npmjs.com's [documentation on electron-builder](https://www.npmjs.com/package/electron-builder), you should modify the scripts section to include a `postinstall` script to "make sure your native dependencies are always matched \[to the\] electron version":
   ```node
   "postinstall": "electron-builder install-app-deps"
   ```

4. To the scripts section, add a general build command, which will build according to whatever the native system is (in theory):
   ```node
   "dist": "electron-builder"
   ```
   
   > As a side note, you can also make build commands which target specific build actions. For example, to build solely for windows, the build command in the scripts section could be something like:
   ```node
   "foo": "electron-builder --win"
   ```
