const express = require('express')
const cors = require('cors')
const app = express()
const port = parseInt(process.env.PORT, 10) || 3001
require('dotenv').config()
const utility = require('./utilityFunctions')
const timedFunctions = require('./timedFunctions')

// Import the functions you need from the SDKs you need
const firebase = require("firebase/app");
//const firebaseAnalytics = require("firebase/analytics");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
//const analytics = firebaseAnalytics.getAnalytics(firebaseApp);

app.use(cors())

app.get('/', async(req, res) => {

  const dbRequests = [];
  //Get all nightmares
  const nightmareRequest = supabase
  .from('allnightmaredetails')
  .select()

  //Get all element/attributes
  const elementRequest = supabase
  .from('element_attributes')
  .select()

  //Get the general categories
  const generalTagRequest = supabase
  .from('general_major_relationships')
  .select()

  //Get the major categories
  const majorTagRequest = supabase
  .from('major_sub_relationships')
  .select()

  //Get all rarities
  const rarityRequest = supabase
  .from('rarities')
  .select()

    //Get all rarities
    const pureSkillsRequest = supabase
    .from('pure_colo_skill_names')
    .select()

  dbRequests.push(nightmareRequest, elementRequest, generalTagRequest, majorTagRequest, rarityRequest, pureSkillsRequest);

  console.time('DB Requests Timer')
  //Wait or all concurrent requests to complete and get their returned values
  let [{data: allNightmares}, {data: allAttributes}, {data: generalTags}, {data: majorTags}, {data: allRarities}, {data: pureSkills}] = await Promise.all(dbRequests);
  console.timeEnd('DB Requests Timer')


  //Return the values obtained from the database
  return res.status(200).json({nightmares: allNightmares, attributes: allAttributes, general_tags: generalTags, major_tags: majorTags, rarities: allRarities, base_skills: pureSkills});
})




app.listen(port, async() => {
  console.log(`App listening on port ${port}`)

  try {
    //Update Database
    utility.updateDatabase()

    //Set timer for calling function daily
    timedFunctions.scheduleUpdates()

  }
  catch(error)
  {
    console.log(error)
  }

})



