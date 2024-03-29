# sinoalice-nightmare-sequencer
**NOTE: This project will no longer be maintained due to SINoALICE Global ending service on 15 November 2023, and will likely serve little use going into the future. ~~Feel free to take the code and adapt it for JP use if you wish.~~ SINoALICE JP has announced it is ending service on January 15 2024, so this project is now officially dead**

A personal project to create a tool to plan nightmares in colosseum for the game SINoALICE.

Heavy inspiration taken from SINoaLICE Nightmare Planner by Eucellia, which can be found at this link:
~~https://sinoalicenightmare.herokuapp.com/~~ (No longer available due to heroku's removal of free tier plans)

## Overview
This is a web application which uses the SINoALICE datamines on GitHub to obtain nightmare data, and processes them before inserting it into the database.

This data is then retrieved by the frontend website to display as a planning tool, in which nightmares may be clicked to plot them onto a timeline chart, in a similar way a how tasks would be displayed on a gantt chart.

The main goals of this project is to provide a simple auto-updating planning tool for colosseum, while also having good visibility of which nightmares need to be used.

## Instructions

### Environment Variables
Refer to the `example.env` file for the required environment variables. There are currently 4 variables required:
- SUPABASE_URL
    - URL for connecting to the database
- SUPABASE_KEY
    - Determines server side access level
- SUPABASE_CLIENT_KEY
    - Determines client side access level
- GOOGLE_ADS_ID
    - For google ads
- DAILY_UPDATE
    - Controls whether to schedule a daily update of nightmares or not. Can be "true" or "false"

### Database Setup

Note: This database was designed with PostgreSQL in mind, and hosted on [Supabase](https://supabase.com/).

A basic database diagram has also been provided in the `database` directory for a high level representation of the database structure.

#### SQL Scripts
To setup the database, run the SQL scripts in the `database` directory in the following order:
1. create_tables.sql
2. create_views.sql
3. initialise_data.sql
    - After running this script, you must start the development server to populate the database before moving to the next step.
4. classify_skills.sql
    - (Optional) Check the `art_unique_id` of the rows in the `pure_colo_skills` table and if there are any not tagged correctly, insert the correct tags into the `skill_tag_relations` table using the `art_unique_id` and `sub_tag_id`.

### Running the development server
1. Navigate to the folder `sinoalice-nightmare-sequencer` in this repository
2. Install dependencies with `npm install`
3. Run the following command to start server: `npm run dev`
4. The web app will be accessible through a web browser at `http://localhost:3000/`

### Running the production build
1. Navigate to the folder `sinoalice-nightmare-sequencer` in this repository
2. Install dependencies: `npm install`
2. Run the following command to build the client side files: `npm run build`
3. Run the following command to start the production server: `npm run start`
4. The web app will be accessible at port 3000, or at the port specified when starting the server

## Screenshots
Screenshots of the final product:
![Initial Page](/screenshots/initial.PNG)
![Plotted Nightmares](/screenshots/plotted_nms.PNG)
![JP Nightmares](/screenshots/jp_names.PNG)
![About Tab](/screenshots/about.PNG)
