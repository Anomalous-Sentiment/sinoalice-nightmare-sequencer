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

    // getNightmares() uses the sinaolice api to get nightmare list.
    // Although en skill name can be incorrect for some nightmares
    let nightmareArray = await getNightmares()
    let scrapedNightmares = await scraper.fullEnNightmareScrape()
    console.log(scrapedNightmares)
    console.log(scrapedNightmares.length)
    console.timeEnd()

    //Split the skill rank from the skill base name
    scrapedNightmares = processRanks(scrapedNightmares);
    nightmareArray = processRanks(nightmareArray);


    //Using jp nightmare name as key, overwrite the en skill of nightmares returned in the api with the scraped en skill name + desc
    nightmareArray = amendApiNightmareList(nightmareArray, scrapedNightmares)

    let jpEnSkillList = getjpEnSkillList(nightmareArray)

    console.log(jpEnSkillList)

    await supabase.from('pure_colo_skill_names')
    .upsert(jpEnSkillList, { returning: 'minimal', ignoreDuplicates: true})  

    //Get a list of unique skill ranks
    let uniqueRanks = getRankList(nightmareArray);

    //Insert ranks into database
    await supabase.from('ranks')
    .upsert(uniqueRanks, { returning: 'minimal', ignoreDuplicates: true})  

    //Get a list of colo skills (unique pure skills + rank combination)
    let coloSkillList = getColoSkillList(nightmareArray);

    console.log(coloSkillList)

    const {data, error} = await supabase.from('colosseum_skills')
    .upsert(coloSkillList, { returning: 'minimal', ignoreDuplicates: true})  

    console.log(error);

    //Finally, format nihgtmare list and insert into database





    /*
    // Add EN skill descriptions to each nightmare according to the skill name
    let finalNightmareArray = nightmareArray.map((nightmare, index, array) => {
      nightmare['GvgSkillDetailEN'] = skills[nightmare['GvgSkillEN']]
      return nightmare;
    })

    console.timeEnd()
    completeNightmareArray = finalNightmareArray;

    completeSkillList = getCombinedSkillList(completeNightmareArray, skills)

    let completeRankList = getRankList(completeSkillList)
    */

    /*
    //Upsert ranks into database. Ignore duplicates and do not return inserted rows
    await supabase.from('ranks')
    .upsert(completeRankList, { returning: 'minimal', ignoreDuplicates: true})

    //Upsert colo skills into database
    //Convert skill list into suitable format first
    formattedSkills = convertKeyMapToList(completeSkillList)

    //Convert data into suitable format to insert into 'pure_colo_skill_names' table
    let pureSkills = convert_to_pure_skill_list(formattedSkills);

    console.log(pureSkills)
    await supabase.from('pure_colo_skill_names')
    .upsert(pureSkills, { returning: 'minimal', ignoreDuplicates: true})  


    const {data, error} = await supabase.from('colosseum_skills')
    .upsert(formattedSkills, { returning: 'minimal', ignoreDuplicates: true})
  
    //console.log(formattedSkills)
    console.log(error)

    //Upsert nightmares into database
    //Convert nightmares into suitable format
    let formattedNightmares = convertNightmaresToList(completeNightmareArray)
    const {data, error} = await supabase.from('nightmares')
    .upsert(formattedNightmares, { returning: 'minimal', ignoreDuplicates: true})
    //console.log(error)
    */
  
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

function convertKeyMapToList(skillList)
{
  let skillRows = []

  // Iterate through all skills
  for (var key of Object.keys(skillList)) 
  {
    let currRow = {}
    const jpLastBracketIndex = key.lastIndexOf('(');
    const enLastBracketIndex = skillList[key][0].lastIndexOf('(');


    const jpPureSkill = key.substring(0, jpLastBracketIndex - 1);
    const enPureSkill = skillList[key][0].substring(0, enLastBracketIndex - 1);

    currRow['jp_colo_skill_name'] = jpPureSkill;
    // This check is only because sometimes the api lists the jp skill as en skill
    if (jpPureSkill != enPureSkill)
    {
      currRow['en_colo_skill_name'] = enPureSkill;
    }
    else
    {
      console.log(key)
      console.log(skillList[key])
      currRow['en_colo_skill_name'] = '';
    }
    currRow['jp_colo_skill_desc'] = skillList[key][1];
    currRow['en_colo_skill_desc'] = skillList[key][2];
    currRow['prep_time'] = parseInt(skillList[key][3]);
    currRow['effective_time'] = parseInt(skillList[key][4]);
    currRow['jp_rank'] = skillList[key][5];

    skillRows.push(currRow);
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

function convert_to_pure_skill_list(skillList)
{
  let pureList = [];

  skillList.forEach((skill) => {
    const jpLastBracketIndex = skill['jp_colo_skill_name'].lastIndexOf('(');
    const enLastBracketIndex = skill['en_colo_skill_name'].lastIndexOf('(');


    const jpPureSkill = skill['jp_colo_skill_name'].substring(0, jpLastBracketIndex - 1);
    const enPureSkill = skill['en_colo_skill_name'].substring(0, enLastBracketIndex - 1);

    //Add to list if jp skill not in list (add if it is unique)
    if (pureList.every((value) => jpPureSkill != value['jp_colo_skill_name']))
    {
      let newRow = {}
      newRow['jp_colo_skill_name'] = jpPureSkill;
      newRow['en_colo_skill_name'] = enPureSkill;

      //Add to list
      pureList.push(newRow);
    }

  })

  return pureList;
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