const supabaseJs = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = supabaseJs.createClient(supabaseUrl, supabaseKey)

const JP_ICON_BASE = 'https://www.deachsword.com/db/sinoalice/jp/images/ab'
const EN_ICON_BASE = 'https://www.deachsword.com/db/sinoalice/en/images/ab'

module.exports = 
{
    updateDatabase,
    pingDatabase
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

      //Create list of formatted skill ranks
      const skillRankList = createUniqueSkillRanks(jpArtList, enArtList)

      // Format the art (colo skill) list into format to insert into DB
      const formattedJpColoSkills = formatJpColoSkills(jpArtList)
      var formattedEnColoSkills = formatEnColoSkills(enArtList, skillMap)

      // Construct a pure colo skill list with en and jp art lists (using unique_art_id)
      const uniqueJpSkillList = createUniqueSkillList(jpArtList)
      const uniqueEnSkillList = createUniqueSkillList(enArtList)

      // Format jp card list into a form suitable to insert into db
      const formattedJpNms = createJpNightmareList(jpCardList)

      // Format en card list into a form suitable to insert into db
      const formattedEnNms = createEnNightmareList(enCardList)

      // Insert all into database
      // Insert Colo skill ranks
      console.log(skillRankList)
      const {error: skillRankError} = await supabase.from('ranks').upsert(skillRankList, {returning: 'minimal'})
      console.log(skillRankError)

      // Insert jp pure colo skills
      const {error: jpPureColoSkillError} = await supabase.from('pure_colo_skills').upsert(uniqueJpSkillList, {returning: 'minimal'})

      // Insert en pure colo skills
      const {error: enPureColoSkillError} = await supabase.from('pure_colo_skills').upsert(uniqueEnSkillList, {returning: 'minimal'})
      console.log(enPureColoSkillError)
      // Insert JP art list (colo skills)
      formattedJpColoSkills.forEach(element => {
        if (!element['jp_rank'])
        {
          //console.log('Following lement has null value')
          //console.log(element)
          element['jp_rank'] = null
        }
      })
      const {error: jpColoSkillError} = await supabase.from('jp_colo_skills').upsert(formattedJpColoSkills, {returning: 'minimal'})
      console.log(jpColoSkillError)
      // Insert EN art list (colo skills)
      const {error: enColoSkillError} = await supabase.from('en_colo_skills').upsert(formattedEnColoSkills, {returning: 'minimal'})
      console.log(enColoSkillError)
      // Insert JP nms
      const {error: jpNmError} = await supabase.from('jp_nightmares').upsert(formattedJpNms, {returning: 'minimal'})
      console.log(jpNmError)
      // Insert EN nms
      const {error: enNmError} = await supabase.from('en_nightmares').upsert(formattedEnNms, {returning: 'minimal'})
      console.log(enNmError)

      console.log('Successful NM DB Update')
      }
      catch(err)
      {
        console.log(err)
      }
}

function createJpToEnRankMap(jpArtList, enArtList)
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

  return translationMap
}

function createUniqueSkillRanks(jpArtList, enArtList)
{
  const trans_map = createJpToEnRankMap(jpArtList, enArtList)
  const formattedList = []
  for (const [key, value] of Object.entries(trans_map))
  {
    const formattedObj = {}
    formattedObj['jp_rank'] = key
    formattedObj['en_rank'] = value
    formattedList.push(formattedObj)
  }

  return formattedList

}

function createEnToJpRankMap(jpArtList, enArtList)
{
  const translationMap = createJpToEnRankMap(jpArtList, enArtList)

  //Flip the key-value pairs to get an en to jp map
  const flippedMap = Object.fromEntries(Object.entries(translationMap).map(a => a.reverse()))

  // Add a jp to jp conversion in case jp value is passed in to map
  for (const [key, value] of Object.entries(flippedMap))
  {
    flippedMap[value] = value
  }

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

function formatJpColoSkills(jpArtList)
{
  // Iterate through all skills and convert into format suitable for database
  const formattedArtList = jpArtList.map(element => {
    const skillRank = getSkillRank(element['name'])
    const formattedArt = {
      'art_mst_id': element['artMstId'],
      'art_unique_id': element['artUniqueId'],
      'jp_rank': skillRank,
      'skill_name': element['name'],
      'skill_desc': element['description'],
      'prep_time': element['leadTime'],
      'effective_time': element['duration'],
      'colo_sp': element['sp']
    }
    return formattedArt
  })
  return formattedArtList
}

function formatEnColoSkills(enArtList, skillMap)
{
  // Iterate through all skills and convert into format suitable for database
  const formattedArtList = enArtList.map(element => {
    const skillRank = getSkillRank(element['name'])

    // Get the JP rank value by matching EN to JP rank. If undefined, remove whitespace and check again.
    var jpSkillRank = skillMap[skillRank] ? skillMap[skillRank] : skillMap[skillRank.replace(/ /g,'')]

    if (!jpSkillRank)
    {
      // Undefined rank (Not in map)
      // Set to null. Undefined value causes errors
      jpSkillRank = null
      
    }

    const formattedArt = {
      'art_mst_id': element['artMstId'],
      'art_unique_id': element['artUniqueId'],
      'jp_rank': jpSkillRank,
      'skill_name': element['name'],
      'skill_desc': element['description'],
      'prep_time': element['leadTime'],
      'effective_time': element['duration'],
      'colo_sp': element['sp']
    }
    return formattedArt
  })

  return formattedArtList
}

function createUniqueSkillList(artList)
{
    // Filter out non-gvg skills
    const filteredSkills = artList.filter(element => element['isGvg'] == 1)

  // Iterate through all elements and find unique artUniqueId's
  const arrayUniqueByKey = [...new Map(filteredSkills.map(item => [item['artUniqueId'], item])).values()];

  // Remove unneeded keys from the objects
  const validKeys = ['artUniqueId']
  arrayUniqueByKey.forEach(element => Object.keys(element).forEach((key) => validKeys.includes(key) || delete element[key]))

  // Rename each key to be same as the database column name
  const formattedArray = arrayUniqueByKey.map(element => {
    const formattedObj = {}
    formattedObj['art_unique_id'] = element['artUniqueId']
    return formattedObj
  })

  return formattedArray
}

function createJpNightmareList(cardList)
{
  const formattedList = []

  // Filter out non-nightmare cards (nightmares have a cardType = 3)
  const nightmareList = cardList.filter(card => card['artMstId'] != 0 && card['attribute'] != 0 && card['isRelease'] == true)

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
      'nm_name': element['name'],
      'icon_url': icon_url
    }
    // Add to list to insert
    formattedList.push(formattedObj)
  })

  return formattedList
}

function createEnNightmareList(cardList)
{
  const formattedList = []

  // Filter out non-nightmare cards (nightmares have a cardType = 3)
  const nightmareList = cardList.filter(card => card['artMstId'] != 0 && card['attribute'] != 0 && card['isRelease'] == true)

  nightmareList.forEach(element => {
    // Format according to database
    const paddedId = element['cardMstId'].toString().padStart(4, '0')
    const assetBundle = element['assetBundleName']

    icon_url = EN_ICON_BASE + `/${assetBundle}/${paddedId}.png`
    const formattedObj = {
      'card_mst_id': element['cardMstId'],
      'rarity_id': element['rarity'],
      'art_mst_id': element['artMstId'],
      'attribute_id': element['attribute'],
      'nm_name': element['name'],
      'icon_url': icon_url
    }
    // Add to list to insert
    formattedList.push(formattedObj)
  })

  return formattedList
}

async function pingDatabase()
{
  const rarityRequest = supabase
  .from('rarities')
  .select()

  const rarityData = await rarityRequest

  console.log('Retrieved rarity data from database')
  console.log(rarityData)
}