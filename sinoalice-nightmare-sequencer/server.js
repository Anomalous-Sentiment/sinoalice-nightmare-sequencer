const express = require('express')
const next = require('next')
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'

require('dotenv').config()

const app = next({ dev })
const handle = app.getRequestHandler()


const supabaseJs = require('@supabase/supabase-js')
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = supabaseJs.createClient(supabaseUrl, supabaseKey)

const utility = require('./utilityFunctions')
const timedFunctions = require('./timedFunctions')



app.prepare().then(() => {
  const server = express()


  server.get('/api/nightmares', async(req, res) => {

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


  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)

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
})