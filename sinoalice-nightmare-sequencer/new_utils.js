//import {fetch} from 'node-fetch'
const scraper = require('./scraper.js')
const supabaseJs = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = supabaseJs.createClient(supabaseUrl, supabaseKey)

const JP_ICON_BASE = 'https://www.deachsword.com/db/sinoalice/en/images/ab'
const EN_ICON_BASE = 'https://www.deachsword.com/db/sinoalice/jp/images/ab'

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
      const skillMap = createEnToJpRankMap(jpArtList, enArtList)

      // Construct a pure colo skill list with en and jp art lists (using unique_art_id, en name, and jp name)
      const uniqueJpSkillList = createUniqueSkillList(jpArtList)
      const uniqueEnSkillList = createUniqueSkillList(enArtList)

      // Format jp card list into a form suitable to insert into db
      const formattedJpNms = createJpNightmareList(jpCardList, jpArtList)

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
  //Regex expression to detect jp characters
  const regexExression = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;

  const translationMap = {}

  // Convert en list into a art_mst_id:jp_rank key-value map
  const enMap = {}
  enArtList.forEach(element => {
    const enRank = getSkillRank(element['name'])

    enMap[element['artMstId']] = enRank
  });

  // Iterate through jp art list and check the corresponding en art mst id for a the en translation equivalent
  jpArtList.forEach(element => {
    // Check if the artMstId exists the en map, and if the end map value does not contain JP chars
    if (element['artMstId'] in enMap && !enMap[element['artMstId']].match(regexExression))
    {
      const jpRank = getSkillRank(element['name'])
      translationMap[jpRank] = enMap[element['artMstId']]
    }
  })

  console.log(translationMap)

  //Flip the key-value pairs to get an en to jp map
  const flippedMap = Object.fromEntries(Object.entries(translationMap).map(a => a.reverse()))

  // Add a jp to jp conversion in case jp value is passed in to map
  for (const [key, value] of Object.entries(flippedMap))
  {
    flippedMap[value] = value
  }

  console.log(flippedMap)
  return flippedMap
}

function getSkillRank(skillString)
{
  const rankBracket = skillString.lastIndexOf('(');
  const rankEndBracket = skillString.lastIndexOf(')');

  //const jpBaseSkill = element['name'].substring(0, jpRankBracket).trim();

  const rank = skillString.substring(rankBracket + 1, rankEndBracket);

  return rank
}

function mapEnRanksToJp(enCardList)
{

}

function createUniqueSkillList(artList)
{
  // Iterate through all elements and find unique artUniqueId's
  const arrayUniqueByKey = [...new Map(artList.map(item => [item['artUniqueId'], item])).values()];

  // Remove unneeded keys from the objects
  const validKeys = ['artUniqueId']
  arrayUniqueByKey.forEach(element => Object.keys(element).forEach((key) => validKeys.includes(key) || delete element[key]))

  return arrayUniqueByKey
}

function createJpNightmareList(cardList, jpArtList)
{
  const formattedList = []

  // Filter out non-nightmare cards (nightmares have a cardType = 3)
  const nightmareList = cardList.filter(card => card['cardType'] == 3)

  nightmareList.forEach(element => {
    // Format according to database
    const paddedId = element['cardMstId'].toString().padStart(4, '0')
    const assetBundle = element['assetBundleName']

    icon_url = JP_ICON_BASE + `/${assetBundle}/${paddedId}.png`
    const formattedObj = {
      'card_mst_id': element['cardMstId'],
      'rarity_id': element['rarity'],
      'art_mst_id': element['artMstId'],
      'attribute_id': element['attribute'],
      'jp_name': element['name'],
      'jp_icon_url': icon_url
    }
    // Add to list to insert
    formattedList.push(formattedObj)
  })

  console.log(formattedList)
  return formattedList
}

