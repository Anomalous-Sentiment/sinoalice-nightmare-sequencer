# sinoalice-nightmare-plotter
A personal project to create a tool to plan nightmares in colosseum for the game SINoALICE.

Heavy inspiration taken from SINoaLICE Nightmare Planner by Eucellia, which can be found at this link:
https://sinoalicenightmare.herokuapp.com/


## Instructions

### Running the development server
1. Navigate to the root of this repository
2. Run the following command: `npm run dev`
3. The web app will be accessible through a web browser at `http://localhost:3000/`

### Running the production build with Docker
1. Navigate to the root of this repository
2. Run the following command to build the docker image: `docker build -t nm-plotter .`
3. Run the following command to start the docker container from the image: `docker run -p 3000:3000 nm-plotter`
4. The web app will be accessible through a web browser at `http://localhost:3000/`