# INI_Editor
Purpose-built INI GUI editor for my needs.
**Warning:** _This is not a turnkey tool for editing INI files._ <br>It's primarily my playing around with things. 
It also has some built-in examples of how to turn HTML inputs directly into a formatted JSON file.

#### Using electron forge:

First, make sure electron-forge is installed globally:

```node
npm install -g electron-forge@latest
```

Next, install electron-forge as a dev-dependency in your project:

```node
npm install -D electron-forge@latest
```

1. [To add to an existing project](https://www.electronforge.io/import-existing-project):
   - `npx @electron-forge/cli@latest import`
1. However, that doesn't always work. 


## Building/make

#### Using electron forge:

1. [To add to an existing project](https://www.electronforge.io/import-existing-project):

	```Shell
	npx @electron-forge/cli@latest import
	```
2. If the process completes successfully, verify that you have what is needed to create a Debian package (`.deb`).[<sup>1</sup>](#1) 

	```console
    fakeroot --version && dpkg --version
    ```
    _This should return version info for both of these if they're installed._
3. Edit your `package.json` file's scripts section. The "scripts" section has a "make" entry (`"make": "electron-forge make"`). This means that the _make_ command will default to the current OS as being the target environment. It's better to specify, instead, so replace this entry with:

	```
  	"make-linux": "npx @electron-forge/cli make --platform linux --targets deb"
  	```
4. Unfortunately, when I attempted to run the command `npm run make-linux` (the command to compile the project into an installer), this threw `Error: Could not find module with name: deb`. I removed the `--targets deb` bit from the end, and it compiled successfully. However, it compiled both a `.deb` and a `.rpm` version instead of just a `.deb`. After looking at the `config.forge.makers[]` section of `package.json`, I tried copying the "name" section for the "maker-deb" entry. This worked, and the final result looked like this:
    
    ```json
    "make-linux": "npx @electron-forge/cli make --targets @electron-forge/maker-deb"
    ```



## REFERENCES

> <a id="1">[1]</a> 
> [https://www.turtle-techies.com/how-to-package-your-multiplatform-electron-app/](https://www.turtle-techies.com/how-to-package-your-multiplatform-electron-app/)
