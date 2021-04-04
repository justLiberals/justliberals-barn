# justLiberals 11ty

[justLiberals] is a lightweight, static site using node.js and 11ty. It is the face of justLiberals: a group of Liberals that believes things can be done better.

## Tech

justLiberals uses a number of open source projects to work properly:

- [node.js] - Javascript runtime
- [11ty] - static site generator

## Installation, Development and Testing

Want to contribute? Great!

Download Git and Github desktop. Fork the `justLiberals.org.uk` repo, and download a clone of your own repo. Default installation destination on Windows is `C:/User/[YOUR NAME]/Documents/Github/justLiberals.org.uk`.

Open the project in an editor, such as Notepad++ or Atom. Follow the guide below to test your fork locally.

### Local Testing on Windows

1. justLiberals requires [Node.js](https://nodejs.org/) v10+ to run. Ensure your systems meets this. To check installation version, open command prompt, and run
``` sh
node -v
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If you are presented with a version number that is newer than v10, skip to step 2.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If the version number is older than v10, or you receive:

```sh
'node' is not recognized as an internal or external command, operable program or batch file.
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Download and install [Node.js] with default installation settings.

2. Once Node.js is installed, open **Node.js command prompt** and navigate to the directory where your `justLiberals.org.uk` fork is. This command will most likely be:

```sh
cd Documents/Github/justLiberals.org.uk
```

3. Run the following command:

```sh
npm install
```

4. When it finishes, the last line will likely say that it is has found vulnerabilities. To fix these, run:

```sh
npm audit fix
```

4. Run the follow command to export a shell variable of the content key:

```sh
SET GHOST_CONTENT_API_KEY=453ce55fdf796124b4a158b334
```

5. Start the node server by running:

```sh
npm start
```

6. Once you see the the Access URLs, open up a browser and type in `http://localhost:8080` into the address bar. This should serve you your own local clone of the justLiberals website. When making changes to the source code, save the files, and refresh your browser window - changes will be updated automatically.

7. To come back and test the site anytime, open up command prompt, cd to the justLiberals directory, and just run:
```sh
npm start
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Finally, open up your browser and navigate to the localhost URL again.

### Local Testing on Linux

1. Open up the terminal and run:
```sh
npm install
```
2. Then, run:
```sh
npm start
```
3. You'll receive a complaint about a missing variable. To fix this, run:
```sh
export GHOST_CONTENT_API_KEY=453ce55fdf796124b4a158b334
```
4. Open your browser, and navigate to the localhost address to see your local version of the site runing.

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen)

   [justLiberals]: https://justliberals.org.uk
   [node.js]: https://nodejs.org/en/download/
   [11ty]: https://www.11ty.dev
