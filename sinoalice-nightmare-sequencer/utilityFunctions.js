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

//The function that gets nightmare list from DB using the api
async function getApiNightmares()
{
    let initialNightmareList = [];

  //EN db url: https://sinoalice.game-db.tw/package/alice_nightmares_global-en.js?v=1827
  initialNightmareList = await fetch("https://sinoalice.game-db.tw/package/alice_nightmares_global-en.js", {
    //fetch("https://sinoalice.game-db.tw/package/alice_nightmares-en.js?v=1827", {
      mode: 'cors'
    })
    .then((res) => {
      return res.json()
    })
    .then((json) => {
        //json is the json of retrieved nightmares
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
  
      //Parsing the values 

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

    return initialNightmareList;
}

// The main overarching function that usees all other functions to process the data
async function updateDatabase()
{
    try {
        console.time('Update Time');
    
        // getApiNightmares() uses the sinaolice api to get nightmare list.
        // Although en skill name can be incorrect for some nightmares
        let nightmareArray = await getApiNightmares()
    
        // Scrape sinoalice db for nightmare list (Used for cross verification and to get EN skill descriptions)
        let scrapedNightmares = await scraper.fullEnNightmareScrape()
    
    
        //Split the skill rank from the skill base name
        scrapedNightmares = processRanks(scrapedNightmares);
        nightmareArray = processRanks(nightmareArray);
    
    
        //Using jp nightmare name as key, overwrite the en skill of nightmares returned in the api with the scraped en skill name + desc
        nightmareArray = amendApiNightmareList(nightmareArray, scrapedNightmares)
    
        let jpEnSkillList = getjpEnSkillList(nightmareArray)
    
        const {error: pureColoSkillError} = await supabase.from('pure_colo_skill_names')
        .upsert(jpEnSkillList, { returning: 'minimal'})
    
        //Get a list of unique skill ranks
        // Note: This function may return an incorrect list of jp-en rank mapping. 
        let uniqueRanks = getRankList(nightmareArray);
    
        //Insert ranks into database. Ignore duplicates, as this data may not be correct. 
        // We do not want to overwrite correct data with incorrect data
        const {error: rankUpdateError} = await supabase.from('ranks')
        .upsert(uniqueRanks, { returning: 'minimal', ignoreDuplicates: true})  
    
        //Get a list of colo skills (unique pure skills + rank combination)
        let coloSkillList = getColoSkillList(nightmareArray);
    
        const {error: colosseumSkillUpdateError} = await supabase.from('colosseum_skills')
        .upsert(coloSkillList, { returning: 'minimal'})
    
    
        //Finally, format nihgtmare list and insert into database
        let convertedNightmareList = convertNightmaresToList(nightmareArray);
    
        const {error: nightmareUpdateError} = await supabase.from('nightmares')
        .upsert(convertedNightmareList, { returning: 'minimal'})
    
        if (pureColoSkillError)
        {
            console.log('Base colosseum skill updating error: ')
            console.log(pureColoSkillError)
        }

        if (rankUpdateError)
        {
            console.log('Skill rank list updating error: ')
            console.log(rankUpdateError)
        }

        if (colosseumSkillUpdateError)
        {
            console.log('Colosseum skill update error: ')
            console.log(colosseumSkillUpdateError)
        }

        if (nightmareUpdateError)
        {
            console.log('Nightmare update error: ')
            console.log(nightmareUpdateError)
        }
    
    
        console.timeEnd('Update Time');
        console.log('Update Successful')
      }
      catch(err)
      {
        console.log(err)
      }
}

function getRankList(nightmareList)
{
  let rankList = []

  // Look through each nightmare in list to find unique ranks
  nightmareList.forEach((nightmare) => {
    //Check if rank does not exist in rankList
    if (rankList.every(rank => (rank['jp_rank'] != nightmare['Rank'])))
    {
      /* Not used. Infeasible to error check in code. Ranks now manually added in database instead.
      //Extra error checking for ranks
      const nightmaresWithRank = nightmareList.filter(innerNm => {
        return innerNm['Rank'] == nightmare['Rank']
      })

      const rankDiff = []

      //Iterate through nightmares with rank and find ones with differing EN ranks and add to rank diff
      nightmaresWithRank.forEach(nm => {
        if (rankDiff.every(rank => rank['RankEN'] != nm['RankEN']))
        {
          rankDiff.push({jp_rank: nm['Rank'], en_rank: nm['RankEN']})
        }
      })

      console.log(rankDiff)
      */

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
  nightmares.forEach((nightmare, index, array) => {
    //Check if unique skill (combination of pure skill and rank are unique)
    if (skillList.every(skill => (skill['jp_colo_skill_name'] != nightmare['GvgSkill']) || (skill['jp_rank'] != nightmare['Rank'])))
    {
      const newSkill = {};
      newSkill['jp_colo_skill_name'] = nightmare['GvgSkill'];

      //If no EN skill description
      if (nightmare['GvgSkillDetailEN'] == '')
      {
        //Search for a nightmare with same skill name, and has description
        const alt = array.find((value) => (value['GvgSkill'] == nightmare['GvgSkill']) && (value['Rank'] == nightmare['Rank']) && (value['GvgSkillDetailEN'] != ''))

        if (alt)
        {
          //If alternative exists, use that nightmare's skill description instead
          newSkill['en_colo_skill_desc'] = alt['GvgSkillDetailEN'];
        }
        else
        {
          //Else, use current nightmare's incomplete description
          newSkill['en_colo_skill_desc'] = nightmare['GvgSkillDetailEN'];
        }
      }
      else
      {
        //EN description is present. Use that description
        newSkill['en_colo_skill_desc'] = nightmare['GvgSkillDetailEN'];
      }

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