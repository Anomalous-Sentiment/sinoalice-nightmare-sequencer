const express = require('express')
const cors = require('cors')
const app = express()
const fetch = require('node-fetch')
const port = parseInt(process.env.PORT, 10) || 3001
const scraper = require('./scraper.js')
require('dotenv').config()
const supabaseJs = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = supabaseJs.createClient(supabaseUrl, supabaseKey)

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


  //Get all possible tags
  const tagRequest = supabase
  .from('major_sub_relationships')
  .select()

  //Get all rarities
  const rarityRequest = supabase
  .from('rarities')
  .select()

  dbRequests.push(nightmareRequest, elementRequest, tagRequest, rarityRequest);

  console.time('DB Requests Timer')
  //Wait or all concurrent requests to complete and get their returned values
  let [{data: allNightmares}, {data: allAttributes}, {data: allTags}, {data: allRarities}] = await Promise.all(dbRequests);
  console.timeEnd('DB Requests Timer')


  //Return the values obtained from the database
  return res.status(200).json({nightmares: allNightmares, attributes: allAttributes, tags: allTags, rarities: allRarities});
})




app.listen(port, async() => {
  console.log(`App listening on port ${port}`)
  try {
    console.time('Update Time');

    // getNightmares() uses the sinaolice api to get nightmare list.
    // Although en skill name can be incorrect for some nightmares
    let nightmareArray = await getNightmares()

    // Scrape sinoalice db for nightmare list
    let scrapedNightmares = await scraper.fullEnNightmareScrape()


    //Split the skill rank from the skill base name
    scrapedNightmares = processRanks(scrapedNightmares);
    nightmareArray = processRanks(nightmareArray);


    //Using jp nightmare name as key, overwrite the en skill of nightmares returned in the api with the scraped en skill name + desc
    nightmareArray = amendApiNightmareList(nightmareArray, scrapedNightmares)

    let jpEnSkillList = getjpEnSkillList(nightmareArray)

    console.log(jpEnSkillList)

    const {error: pureColoSkillError} = await supabase.from('pure_colo_skill_names')
    .upsert(jpEnSkillList, { returning: 'minimal'})

    //Get a list of unique skill ranks
    let uniqueRanks = getRankList(nightmareArray);

    //Insert ranks into database
    const {error: rankUpdateError} = await supabase.from('ranks')
    .upsert(uniqueRanks, { returning: 'minimal'})  

    //Get a list of colo skills (unique pure skills + rank combination)
    let coloSkillList = getColoSkillList(nightmareArray);

    const {error: colosseumSkillUpdateError} = await supabase.from('colosseum_skills')
    .upsert(coloSkillList, { returning: 'minimal'})


    //Finally, format nihgtmare list and insert into database
    let convertedNightmareList = convertNightmaresToList(nightmareArray);

    const {error: nightmareUpdateError} = await supabase.from('nightmares')
    .upsert(convertedNightmareList, { returning: 'minimal'})

    if (pureColoSkillError || rankUpdateError || colosseumSkillUpdateError || nightmareUpdateError)
    {
      console.log(pureColoSkillError)
      console.log(rankUpdateError)
      console.log(colosseumSkillUpdateError)
      console.log(nightmareUpdateError)
    }


    console.timeEnd('Update Time');
  }
  catch(err)
  {
    console.log(err)
  }
  

})

async function getNightmares()
{
  //EN db url: https://sinoalice.game-db.tw/package/alice_nightmares_global-en.js?v=1827
  return await fetch("https://sinoalice.game-db.tw/package/alice_nightmares_global-en.js", {
    //fetch("https://sinoalice.game-db.tw/package/alice_nightmares-en.js?v=1827", {
      mode: 'cors'
    })
    .then((res) => {
      return res.json()
    })
    .then((json) => {
      //Get list of columns
      const fields = json['Cols'].split('|')
  
      //Iterate through each string and tranform to a json object
      const nightmares = json['Rows'].map(element => {
        let jsonObj = {};
        const columns = element.split('|')
  
        // Map every value to it's corresponding field
        columns.forEach((value, index, array) => {
          return jsonObj[fields[index]] = value;
        })
  
        return jsonObj;
      });
  
      // Rarities: 6 = L , 5 = SS, 4 = S, 3 = A
      // Attributes: 3 = green, 2 = water, 1 = fire
      const keys = ['Name', 'NameEN', 'GvgSkill' , 'GvgSkillEN', 'Icon', 'Attribute', 'Rarity', 'GvgSkillSP', 'GvgSkillDur', 'GvgSkillLead', 'GvgSkillDetail', 'Global']
      const leanNightmares = nightmares.map(element => {
        let newJson = {}
  
        keys.forEach((value, index, array) => {
  
          // If statements to substitute numbers with actual strings
          if (value == 'Icon')
          {
            //Icon is the id of the nightmare. This id is also used as the png name, but the id in the image name is padded to a length of 4
            //Hence, the padding here
            const paddedString = element[value].padStart(4, '0')
  
            //This is the JP icon url
            newJson[value] = `https://sinoalice.game-db.tw/images/card/CardS${paddedString}.png`

            //This is the EN icon url
            //Note: This URL may or may not exist yet, but it is likely that when the nightmare is added to global, the icon will be at this url in the db
            newJson['IconEN'] = `https://sinoalice.game-db.tw/images/card_global/CardS${paddedString}.png`
          }
          else if (value == 'Attribute')
          {
            //Replace number with actual element
            //newJson[value] = attributeSubstitutes[element[value]]
            newJson[value] = parseInt(element[value])

          }
          else if (value == 'Rarity')
          {
            //Replace numberr with actual rarity
            //newJson[value] = raritySubstitutes[element[value]]

            newJson[value] = parseInt(element[value])
          }
          else if (value == 'Global')
          {
            //Check if nightmare is in global
            if (element['Global'] == '1')
            {
              newJson[value] = true;
            }
            else
            {
              newJson[value] = false;
            }
          }
          else if (value == 'GvgSkillSP' || value == 'GvgSkillLead' || value == 'GvgSkillDur')
          {
            newJson[value] = parseInt(element[value])
          }
          else
          {
            newJson[value] = element[value]
          }
        })
  
        return newJson;
      })
      return leanNightmares;
  
    })
}


function getRankList(nightmareList)
{
  let rankList = []

  // Look through each nightmare in list to find unique ranks
  nightmareList.forEach((nightmare) => {
    //Check if rank does not exist in rankList
    if (rankList.every(rank => (rank['jp_rank'] != nightmare['Rank'])))
    {
      const newRank = {};
      newRank['jp_rank'] = nightmare['Rank'];
      newRank['en_rank'] = nightmare['RankEN'];

      // Add to the list
      rankList.push(newRank);
    }
  })

  return rankList;
}


function convertNightmaresToList(nightmareList)
{
  let nightmareRows = []

  // Iterate through all skills
  nightmareList.forEach((nightmare) => {
    let currRow = {}

    currRow['jp_name'] = nightmare['Name'];
    currRow['en_name'] = nightmare['NameEN']
    currRow['jp_icon_url'] = nightmare['Icon']
    currRow['en_icon_url'] = nightmare['IconEN']
    currRow['jp_colo_skill_name'] = nightmare['GvgSkill']
    currRow['colo_sp'] = nightmare['GvgSkillSP']
    currRow['global'] = nightmare['Global']
    currRow['attribute_id'] = nightmare['Attribute']
    currRow['rarity_id'] = nightmare['Rarity']
    currRow['jp_rank'] = nightmare['Rank']

    nightmareRows.push(currRow)
  })
  
  return nightmareRows;
}

function processRanks(array)
{
  //Iterate through list and take the jp & en name and split the skill name from rank
  array.forEach(jsonNightmare => {
    let jpFullSkillName = jsonNightmare['GvgSkill'];
    let enFullSkillName = jsonNightmare['GvgSkillEN'];
    let jpRankBracket = null;
    let jpRankEndBracket = null;
    let enRankBracket = null;
    let enRankEndBracket = null;
    let jpBaseSkill = '';
    let enBaseSkill = '';
    let jpRank = '';
    let enRank = '';

    // get bracket indexes for in skill name if exists
    if (jpFullSkillName)
    {
      jpRankBracket = jpFullSkillName.lastIndexOf('(');
      jpRankEndBracket = jpFullSkillName.lastIndexOf(')');

      jpBaseSkill = jpFullSkillName.substring(0, jpRankBracket).trim();

      jpRank = jpFullSkillName.substring(jpRankBracket + 1, jpRankEndBracket);

    }

    if (enFullSkillName)
    {
      enRankBracket = enFullSkillName.lastIndexOf('(');
      enRankEndBracket = enFullSkillName.lastIndexOf(')');

      enBaseSkill = enFullSkillName.substring(0, enRankBracket).trim();

      enRank = enFullSkillName.substring(enRankBracket + 1, enRankEndBracket);
    }

    jsonNightmare['GvgSkill'] = jpBaseSkill;
    jsonNightmare['Rank'] = jpRank;
    jsonNightmare['GvgSkillEN'] = enBaseSkill;
    jsonNightmare['RankEN'] = enRank;

  })

  return array;
}



function amendApiNightmareList(apiNightmares, scrapedNightmares)
{
  //Regex expression to detect jp characters
  const regexExression = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;

  // Overwrite the en skill name here if it contains jp characters (error correction when en name is actually jp name)
  apiNightmares.forEach((apiNightmare) => {
    if (apiNightmare['GvgSkillEN'].match(regexExression))
    {
      //Set to empty string
      apiNightmare['GvgSkillEN'] = '';
    }
  });

  //If en skill description does not exist, set to empty
  apiNightmares.forEach((apiNightmare) => {
    if (!apiNightmare['GvgSkillDetailEN'])
    {
      //Set to empty string
      apiNightmare['GvgSkillDetailEN'] = '';
    }
  })


  // Add scraped data into api data where applicable
  scrapedNightmares.forEach((enNightmare) => {
    apiNightmares.forEach((apiNightmare) => {
      //Check for match between jp names
      if (enNightmare['Name'] == apiNightmare['Name'])
      {
        //If matched, overwrite api nightmare en skill, skill desc, and RankEN with scraped version
        apiNightmare['GvgSkillEN'] = enNightmare['GvgSkillEN'];
        apiNightmare['GvgSkillDetailEN'] = enNightmare['GvgSkillDetailEN'];

        // rank is overwritten as well because the skill name changed, and may be different to what it was previously
        apiNightmare['RankEN'] = enNightmare['RankEN'];
      }
    })
  })

  return apiNightmares;
}

function getjpEnSkillList(apiNightmares)
{
  const jpEnSkillList = [];
  
  apiNightmares.forEach((jpNightmare) => {

    //Check if base jp skill is not in jpEnSkillList
    if (jpEnSkillList.every(baseSkillTuple => jpNightmare['GvgSkill'] != baseSkillTuple['jp_colo_skill_name']))
    {
      //If not in list, add to list, and search for the equivalent base en skill name
      const newTuple = {};

      newTuple['jp_colo_skill_name'] = jpNightmare['GvgSkill'];

      //Search for en equivalent name in own list. (Other nightmares may have a translation for the skill from previous amendment)
      // Get nightmare which has same jp skill name, and a non-empty en skill name
      let referenceNightmare = apiNightmares.find(nightmare => (nightmare['GvgSkill'] == jpNightmare['GvgSkill']) && (nightmare['GvgSkillEN'] != ''))

      if (referenceNightmare)
      {
        //If reference nightmare exists, use it's en skill name
        newTuple['en_colo_skill_name'] = referenceNightmare['GvgSkillEN'];
      }
      else
      {
        //If none exists, set to empty string
        newTuple['en_colo_skill_name'] = '';
      }

      jpEnSkillList.push(newTuple);
    }

    
  })

  return jpEnSkillList;
}

function getColoSkillList(nightmares)
{
  let skillList = [];

  // Look through each nightmare to find unique skill+rank combinations
  nightmares.forEach((nightmare) => {
    //Check if unique skill (combination of pure skill and rank are unique)
    if (skillList.every(skill => (skill['jp_colo_skill_name'] != nightmare['GvgSkill']) || (skill['jp_rank'] != nightmare['Rank'])))
    {
      const newSkill = {};
      newSkill['jp_colo_skill_name'] = nightmare['GvgSkill'];
      newSkill['en_colo_skill_desc'] = nightmare['GvgSkillDetailEN'];
      newSkill['jp_colo_skill_desc'] = nightmare['GvgSkillDetail'];
      newSkill['prep_time'] = nightmare['GvgSkillLead'];
      newSkill['effective_time'] = nightmare['GvgSkillDur'];
      newSkill['jp_rank'] = nightmare['Rank'];

      // Add to the list
      skillList.push(newSkill);
    }
  })

  return skillList;
}