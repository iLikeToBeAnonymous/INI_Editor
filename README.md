# INI_Editor
Purpose-built INI GUI editor for my needs.
**Warning:** _This is not a turnkey tool for editing INI files._ <br>It's primarily my playing around with things. 
It also has some built-in examples of how to turn HTML inputs directly into a formatted JSON file.


## Building/make

#### Using electron forge:

1. [To add to an existing project](https://www.electronforge.io/import-existing-project):
   - `npx @electron-forge/cli@latest import`
   If this doesn't work, you can attempt:
   
   ```node
   npm install -D @electron-forge/cli
   npx electron-forge import
   ```
