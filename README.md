# udacity-neighborhood-map
**Neighborhood Map** app as part of Udacity's FullStack Nanodegree

The following 'MAIN' files are contained in this project:

* **packages.json** - The YARN generated dependency ile.
	* Yarn PKG Manager - https://yarnpkg.com

## Installation:
#### System Requirements:
1. Python 2 (e.g. 2.7.x)
	* Intallation of python on Debian-based machines (e.g. Ubuntu):
		* ```sudo apt-get install python```
			* This command will vary on *nix distribution you use.
			  Please refer to you OS documention if you get stuck!
		* Installation of python can be verified with the command:
			* ```python --version```
2. NodeJS ver 6.10.x
	* Installation of node on Debian-based machines (e.g. Ubuntu):
		* ```curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -```
		* ```sudo apt-get install -y nodejs```
		* For other distros reference Node installation notes:
			* https://nodejs.org/en/download/package-manager/
		* Installation of NodeJS can be verfied with the command:
			* ```node --version```	
3. Yarn PGK Manager (latest)
	* Installation of Yarn on Debian-based machines (e.g. Ubuntu):
		* ```curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -```
		* ```echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list```
		* ```sudo apt-get update && sudo apt-get install yarn```
		* For other distros reference Yarn installation notes:
			* https://yarnpkg.com/en/docs/install
		* Installation of Yarn can be verified with the command:
			* ```yarn --version```

#### Obtaining the Code:
* Clone the repository from GitHub
```
git clone https://github.com/nathandh/udacity-neighborhood-map.git
```

#### Install required packages via Yarn PKG manager
* ```cd udacity-neighborhood-map```
* ```yarn install```

#### Launching the Church Map app
* The Church Map app only works if launched through a web server setup.
* Feel free to setup in any web server application of your choosing:
	* e.g. (Nginx, Apache, etc...).
* Python's SimpleHTTPServer is one quick and easy option to launch the app on 'localhost' to get started.
	* Launching with Python's built-in web server can be done as follows:
		* ```cd udacity-neighborhood-map```
		* ```python -m SimpleHTTPServer 9090```
			* Note: 9090 is an example port; choose whicher port you like (e.g. 8000)
		* Load ```map.html``` into your browser to view the application:
			* If you setup via localhost and python SimpleHTTPServer as above:
				* ```http://127.0.0.1:9090/map.html```

## Api's used in the Neighborhood Map
1. Google Map API for Javascript
2. Wikipedia API to add extra InfoWindow information for map markers

#### License:
Licensed for use under the MIT License
