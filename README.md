# TMA Grid Plugin

Girder plugin for TMA grid.

# How to install the plugin?

For installing the plugin you will need to run the following command

```bash
pip install tma_viewer
```

# Development

## Before installing and running the plugin:

Be sure to have the following technologies installed with the required version:

- NodeJS `12.22.x`
  - You can install `nvm ` for easy node version management
- Girder
- HistomicsUI
  - It needs to be installed as a plugin
  - You'll need to follow the installation guide in the [plugin's repository](https://github.com/DigitalSlideArchive/HistomicsUI#installation)
- Python
- PIP
- Docker
  - With the CLI commands enabled (for running `docker` and `docker-compose`)

## Plugin Structure:

```bash
   tma_viewer
    |-> web_client
	     |-> stylesheets
	     tmaTable.styl # CSS Styles for the TMA table
	     |-> templates
	     tmaTable.pug # TMA table template
	     |-> views
		     |-> body
			     TMAView.js # Main view of the plugin
		     |-> widget
			     HierachyWidget.js # Extended version of girder widget
	     main.js
	     routes.js
	     package.json
	     package-lock.json
    __init__.py # Girder plugin initialisation
	setup.py # Plugin setup
	docker-compose.ymk # Docker compose for local development
```

## Local Development:

For local development you'll need to follow some steps:

**1.** Make sure you have the right `node` version installed locally, we recommend to use `nvm` for managing `node` versions:

```bash
> nvm use 14.21.3
> pyenv use 3.9.18
```

**2.** In other terminal, in the root folder, run `docker`, it will create a container running `mongodb` :

```bash
> docker-compose up
```

**3.** Once the container is running, in other terminal run:

```bash
> girder build --dev
```

**4.** Then, finally, serve the plugin:

```bash
> GIRDER_MONGO_URI='mongodb://localhost:51467/girder' girder serve --dev
```

- _You'll need to specify the URL where docker is running, for that use_

If you want to watch the changes when you are coding use the following command:

- _For ubuntu and MAC users_:

```bash
> sudo ls tma_viewer/web_client/**/*.js | entr -r -s 'girder build --dev --no-reinstall && GIRDER_MONGO_URI='mongodb://localhost:51467/girder' girder serve --dev'
```

> _This command will listen to any change that you do in the web_client .js files and build & serve again the project without re-installing node modules._

## Deploy using the official digital slide archive docker repository

**1.** Clone the official DSA docker repository:
https://github.com/DigitalSlideArchive/digital_slide_archive.git

**2.** Go to the devops folder and run `docker-compose`:

```bash
> cd devops/dsa
> DSA_USER=$(id -u):$(id -g) docker-compose up
```

**3.** Execute the following commands:

```bash
# Go inside the container
> docker exec -it dsa-girder-1 /bin/bash
# Once inside the container, go to the opt folder where the plugins are located
> cd ..
# Download the plugin
> git clone https://github.com/steveneschrich/histomics-tma-grid.git
# Go to the plugin folder
> cd histomics-tma-grid
# Build the plugin using girder
> girder build --mode=production
# Install the plugin
> pip install .
# Exit the container
> exit
# Restart the dsa-girder container
> docker-compose restart dsa-girder-1
```
