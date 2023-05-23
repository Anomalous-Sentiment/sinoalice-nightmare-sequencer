//import {fetch} from 'node-fetch'
const scraper = require('./scraper.js')
const supabaseJs = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = supabaseJs.createClient(supabaseUrl, supabaseKey)


module.exports = 
{
    updateDatabase
}

// The main overarching function that usees all other functions to process the data
async function updateDatabase()
{
    try {
      // Get jp art list json

      // Get en art list json

      // get jp card list json

      // get en card list json

      // Construct a json obj with en skill ranks as keys and jp skill ranks as values (To convert en skill ranks into their equivalent jp version)

      // Construct a pure colo skill list with en and jp art lists (using unique_art_id, en name, and jp name)

      // Format jp card list into a form suitable to insert into db

      // Format en card list into a form suitable to insert into db (use the rank json obj to help)
      }
      catch(err)
      {
        console.log(err)
      }
}
