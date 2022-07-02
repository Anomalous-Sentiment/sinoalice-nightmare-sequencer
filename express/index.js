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

let completeNightmareArray = null;

app.use(cors())

app.get('/', async(req, res) => {

  return res.status(200).json({nightmares: completeNightmareArray});
})




app.listen(port, async() => {
  console.log(`App listening on port ${port}`)
  try {
    // Scrape sinoalice db for nightmare list
    console.time()
    let nightmareArray = await getNightmares()
    let skills = await scraper.scrapeSkills()

    // Add EN skill descriptions to each nightmare according to the skill name
    let finalNightmareArray = nightmareArray.map((nightmare, index, array) => {
      nightmare['GvgSkillDetailEN'] = skills[nightmare['GvgSkillEN']]
      return nightmare;
    })

    console.timeEnd()
    completeNightmareArray = finalNightmareArray;

    completeSkillList = getCombinedSkillList(completeNightmareArray, skills)

    let completeRankList = getRankList(completeSkillList)

    //Upsert ranks into database. Ignore duplicates and do not return inserted rows
    await supabase.from('ranks')
    .upsert(completeRankList, { returning: 'minimal', ignoreDuplicates: true})

    //Upsert colo skills into database
    //Convert skill list into suitable format first
    formattedSkills = convertKeyMapToList(completeSkillList)

    await supabase.from('colosseum_skills')
    .upsert(formattedSkills, { returning: 'minimal', ignoreDuplicates: true})
  
    //Upsert nightmares into database
    //Convert nightmares into suitable format
    let formattedNightmares = convertNightmaresToList(completeNightmareArray)
    const {data, error} = await supabase.from('nightmares')
    .upsert(formattedNightmares, { returning: 'minimal', ignoreDuplicates: true})
    console.log(error)
  
  }
  catch(err)
  {
    console.log(err)
    completeNightmareArray = {err}
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
  
      const attributeSubstitutes = {1: 'Fire', 2: 'Water', 3: 'Wind'}
      const raritySubstitutes = {3: 'A', 4: 'S', 5: 'SR', 6: 'L'}
  
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

function getCombinedSkillList(nightmareList, enSkillList)
{
  let jp_en_skill_list = {}

  //Iterate through all nightmares and map every jp skill to their en equivalent
  //  and return as json
  nightmareList.forEach((value, index, array) => {
    //If not in skill list, add along with en name and description
    if(!(value['GvgSkill'] in jp_en_skill_list))
    {
      //jp name and description will always exist, but en equivalents may not
      let jp_name = value['GvgSkill'].trim();
      let en_name = '';
      let jp_details = value['GvgSkillDetail'].trim()
      let en_details = '';

      if (value['GvgSkillEN'] != undefined && value['GvgSkillEN'] != null && value['GvgSkillEN'] != '')
      {
        en_name = value['GvgSkillEN'];
      }

      if (value['GvgSkillDetailEN'] != undefined && value['GvgSkillDetailEN'] != null && value['GvgSkillDetailEN'] != '')
      {
        en_details = value['GvgSkillDetailEN'];
      }

      let jp_rank = null;
      let en_rank = null;
      let startIndex = null;
      let endIndex = null;

      //Parse string to find jp and en ranks
      let jpSkillString = value['GvgSkill']
      startIndex = jpSkillString.lastIndexOf('(')
      endIndex = jpSkillString.lastIndexOf(')')
      jp_rank = jpSkillString.substring(startIndex + 1, endIndex)

      let enSKillString = value['GvgSkillEN']
      startIndex = enSKillString.lastIndexOf('(')
      endIndex = enSKillString.lastIndexOf(')')
      en_rank = enSKillString.substring(startIndex + 1, endIndex)

      jp_en_skill_list[jp_name] = [en_name, jp_details, en_details, value['GvgSkillLead'], value['GvgSkillDur'], jp_rank, en_rank]
    }
  })

  return jp_en_skill_list;
}

function getRankList(skillList)
{
  let rankList = []


  // Iterate through all skills
  for (var key of Object.keys(skillList)) 
  {
    let rankRow = {}

    //Check if jp rank exists in list
    let exists = rankList.every(rank => rank['jp_rank'] != skillList[key][5])
    if (exists)
    {
      //Add jp rank as key, and en rank as value
      rankRow['jp_rank'] = skillList[key][5]
      rankRow['en_rank'] = skillList[key][6]

      rankList.push(rankRow)
    }
  }

  return rankList;
}

function convertKeyMapToList(skillList)
{
  let skillRows = []

  // Iterate through all skills
  for (var key of Object.keys(skillList)) 
  {
    let currRow = {}

    currRow['jp_colo_skill_name'] = key;
    currRow['en_colo_skill_name'] = skillList[key][0]
    currRow['jp_colo_skill_desc'] = skillList[key][1]
    currRow['en_colo_skill_desc'] = skillList[key][2]
    currRow['prep_time'] = parseInt(skillList[key][3])
    currRow['effective_time'] = parseInt(skillList[key][4])
    currRow['jp_rank'] = skillList[key][5]

    skillRows.push(currRow)
  }

  return skillRows;
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

    nightmareRows.push(currRow)
  })
  
  return nightmareRows;
}