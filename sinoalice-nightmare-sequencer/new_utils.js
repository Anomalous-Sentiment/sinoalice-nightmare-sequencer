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
      // https://raw.githubusercontent.com/sinoalice-datamine/data/master/JP/art_mst_list.json
      const jpArtPromise = fetch('https://raw.githubusercontent.com/sinoalice-datamine/data/master/JP/art_mst_list.json').then(res => res.json())

      // Get en art list json
      const enArtPromise = fetch('https://raw.githubusercontent.com/sinoalice-datamine/data/master/EN/art_mst_list.json').then(res => res.json())

      // get jp card list json
      // https://raw.githubusercontent.com/sinoalice-datamine/data/master/JP/card_mst_list.json
      const jpCardPromise = fetch('https://raw.githubusercontent.com/sinoalice-datamine/data/master/JP/card_mst_list.json').then(res => res.json())

      // get en card list json
      const enCardPromise = fetch('https://raw.githubusercontent.com/sinoalice-datamine/data/master/EN/card_mst_list_en.json').then(res => res.json())

      // Wait for all fetches to complete
      const [jpArtList, jpCardList, enArtList, enCardList] = await Promise.all([jpArtPromise, jpCardPromise, enArtPromise, enCardPromise])
      // Construct a json obj with en skill ranks as keys and jp skill ranks as values (To convert en skill ranks into their equivalent jp version)

      // Construct a pure colo skill list with en and jp art lists (using unique_art_id, en name, and jp name)

      // Format jp card list into a form suitable to insert into db

      // Format en card list into a form suitable to insert into db (use the rank json obj to help)

      // Insert all into database
      
      }
      catch(err)
      {
        console.log(err)
      }
}

function createEnToJpRankMap(jpArtList, enArtList)
{

}

function mapEnRanksToJp(enCardList)
{

}

function createUniqueSkillList(artList)
{

}

function createNightmareList(cardList)
{

}

