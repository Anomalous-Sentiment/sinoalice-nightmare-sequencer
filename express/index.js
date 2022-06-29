const express = require('express')
const cors = require('cors')
const app = express()
const fetch = require('node-fetch')
const port = parseInt(process.env.PORT, 10) || 3001

const scraper = require('./scraper.js')

app.use(cors())

app.get('/', async(req, res) => {
  try {
    // Scrape sinoalice db for nightmare list
    //let nightmareArray = scraper.fullScrape();
    console.time()
    let nightmareArray = await getNightmares()
    let skills = await scraper.scrapeSkills()

    // Add EN skill descriptions to each nightmare according to the skill name
    let finalNightmareArray = nightmareArray.map((nightmare, index, array) => {
      nightmare['GvgSkillDetailEN'] = skills[nightmare['GvgSkillEN']]
      return nightmare;
    })
    //console.log(finalNightmareArray)
    console.timeEnd()




    return res.status(200).json({nightmares: nightmareArray});
  }
  catch(err)
  {
    console.log(err)
    return res.status(404);

  }
})




app.listen(port, () => {
  console.log(`App listening on port ${port}`)

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
      //console.log(json)
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

        console.log(jsonObj)
  
        return jsonObj;
      });
  
      //console.log(nightmares)
      // Rarities: 6 = L , 5 = SS, 4 = S, 3 = A
      // Attributes: 3 = green, 2 = water, 1 = fire
  
      const attributeSubstitutes = {1: 'Fire', 2: 'Water', 3: 'Wind'}
      const raritySubstitutes = {3: 'A', 4: 'S', 5: 'SR', 6: 'L'}
  
      const keys = ['Name', 'NameEN', 'GvgSkill' , 'GvgSkillEN', 'Icon', 'IconEN','Attribute', 'Rarity', 'GvgSkillSP', 'GvgSkillDur', 'GvgSkillLead', 'GvgSkillDetail', 'Global']
      const leanNightmares = nightmares.map(element => {
        let newJson = {}
  
        keys.forEach((value, index, array) => {
  
          // If statements to substitute numbers with actual strings
          if (value == 'Icon')
          {
            //Icon is the id of the nightmare. This id is also used as the png name, but the id in the image name is padded to a length of 4
            //Hence, the padding here
            paddedString = element[value].padStart(4, '0')
  
            //This is the JP icon url
            newJson[value] = `https://sinoalice.game-db.tw/images/card/CardS${paddedString}.png`

            //This is the EN icon url
            //Note: This URL may or may not exist yet, but it is likely that when the nightmare is added to global, the icon will be at this url in the db
            newJson['IconEN'] = `https://sinoalice.game-db.tw/images/card_global/CardS${paddedString}.png`
          }
          else if (value == 'Attribute')
          {
            //Replace number with actual element
            newJson[value] = attributeSubstitutes[element[value]]
          }
          else if (value == 'Rarity')
          {
            //Replace numberr with actual rarity
            newJson[value] = raritySubstitutes[element[value]]
  
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

        if (newJson['NameEN'] == 'Elza, the Ancient Priestess')
        {
          console.log(newJson)
        }

        if (newJson['NameEN'] == 'Sea Serpent')
        {
          console.log(newJson)
        }
  
        return newJson;
      })
      //console.log(leanNightmares)
      //console.log(nightmares)
      return leanNightmares;
  
    })
  
}