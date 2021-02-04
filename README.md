
# :earth_africa: Interactive World Happiness Visualization
The World Happiness Report is a landmark survey of the state of global happiness, including over 150 countries. Every year, a new report is published that gives countries a happiness ranking based on a number of factors. However, the report consists over 200 pages and can for some readers be unclear. 

This interactive web application aims to clearify the world happiness ranking among countries by combinding the world happiness data from the year 2015 up and including 2020, with easy to use and understandable charts and maps built with [D3](https://github.com/d3/d3) and [THREE.js](https://github.com/mrdoob/three.js/).

[Live link](https://world-happiness.leonardomathon.nl)

# Table of contents
1. [ Installation ](https://github.com/leonardomathon/interactive-world-happiness-visualization#wrench-installation)<br/>
&ensp;[Install system dependencies](https://github.com/leonardomathon/interactive-world-happiness-visualization#installing-system-dependecies)
&ensp;[Install dependencies](https://github.com/leonardomathon/interactive-world-happiness-visualization#installing-dependencies)
&ensp;[Run project](https://github.com/leonardomathon/interactive-world-happiness-visualization#running-the-project)
2.  [Usage](https://github.com/leonardomathon/interactive-world-happiness-visualization#arrow_right-usage)
3. [Technologies used](https://github.com/leonardomathon/interactive-world-happiness-visualization#technologies)
4. [Acknowledgments](https://github.com/leonardomathon/interactive-world-happiness-visualization#acknowledgments)


# :wrench: Installation
The following instructions walks you through the installation process. For this installation process, it is assumed you have basic experience with a terminal or the windows command prompt. 

## Install via releases
Installing the application is as simple as downloading the [latest release](https://github.com/leonardomathon/interactive-world-happiness-visualization/releases) and unzipping the files in a directory of choice. You can now run the `index.html` in your preferred browser. 

## Installing system dependecies
You can also build the project yourself. The following steps will walk you through this process.

### Node.js
In order to run this project, you must have [Node.js](https://github.com/nodejs/node) installed.  We recommend installing the long time support version of Node, v14.15.x, since previous Node versions might not work.
> You can check your if Node is succesfully installed by running the command `node -v` inside a terminal window or command prompt.

### NPM
To install the required packages, use must ensure that you have NPM installed. NPM comes typically bundled with Node, meaning once Node.js is installed, NPM will also be installed. 
> You can check your if NPM is succesfully installed by running the command `npm -v` inside a terminal window or command prompt.

## Installing dependencies
### Clone the repo
You can clone the repo with the command `git clone https://github.com/leonardomathon/interactive-world-happiness-visualization`. This will create a directory with the name of this repo and start downloading.

### Install dependencies
Once the cloning process has completed, navigate to the cloned repository and open a terminal or command prompt. To install all the required dependencies, use the command `npm install`. If succesful, this will create a folder called `node_modules`, containing all of the dependencies

## Running the project

### Run project (live server)
If everything went right, you are now able to start the project using `npm run start` in the project root. This initializes webpack and will start a live server at `localhost:8080`. 

### Build project
Alternatively, you can use the command `npm run build` in the project root. This command starts the build process, which bundles all the source files and spits out a static `.html` file, together with two `.js` files containing all our written code, as well as all the dependencies used. The static `.html` file can be found at `dist/index.html` and can easily be opened using a modern webbrowser.

# :arrow_right: Usage
TODO


# Technologies
This project is mainly build with [webpack](https://github.com/webpack/webpack) for bundling javascript files and assets, [D3](https://github.com/d3/d3) for drawing and displaying graphs,  and [THREE.js](https://github.com/mrdoob/three.js/), a lightweigt, 3D librabry with a default WebGL renderer, used to render the main world globe. Other noticable dependencies are [Hotkeys.js](https://github.com/jaywcjlove/hotkeys), a library for capturing keyboard inputs, [jsPanel4](https://github.com/Flyer53/jsPanel4), a library to create floating panels, hints, modals and other kinds of windows and [Tailwind](https://github.com/tailwindlabs/tailwindcss), a utility-first CSS framework.


# Acknowledgments
This application was developed by a team of 3 CS master students, namely:

 - [Jorg Bekelaar](https://github.com/jorgbekelaar)
 - [Leonardo Mathon](https://github.com/leonardomathon)
 - [Vince Verspeek](https://github.com/VinceVerspeek)

 It was developed as part of the course `2IMV20 - Visualization`, taught at Eindhoven University of Technology. 
