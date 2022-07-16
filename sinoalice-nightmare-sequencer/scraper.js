const scraperInit = require('./scraperInitialisation.js')

function scrapeWebPage($)
{
    const nightmareArray = [];

    const keys = [
      "Icon",
      "jp_name",
      "Name",
      "colo_skill_name",
      "Colo.Skill",
      "Colo.Prep",
      "Colo.Dur."
    ]

    //Iterate through all rows of table of nightmares and their fields
    // Each iteration is a row
    $("tbody tr").each((parentIndex, parentElem) => {
      let element = "";
      const nightmareDetails = {};

      // Find the img lement and get it's url (class='colIcon')
      element = $(parentElem).find('.colIcon img')
      const iconURL = "https://sinoalice.game-db.tw" + $(element).attr("src")
      nightmareDetails[keys[0]] = iconURL;

      // Find the name element and get the JP name (class='rawname')
      element = $(parentElem).find('.rawname')
      nightmareDetails[keys[1]] = element.text();

      // Find the name element andd get the EN name (class='link enname')
      element = $(parentElem).find('.link.enname')
      nightmareDetails[keys[2]] = element.text();

      // Find the skill name element and get the skill name (class='gvgTitle')
      element = $(parentElem).find('.gvgTitle')
      nightmareDetails[keys[3]] = element.text();

      // Find the skill name element and get the skill description (class='tableDetail en')
      element = $(parentElem).find('.tableDetail.en')
      nightmareDetails[keys[4]] = element.text();


      // Find the skill prep duration and get the time (class='colGvgSkillLead')
      element = $(parentElem).find('.colGvgSkillLead')
      nightmareDetails[keys[5]] = element.text();

      // Find the skill active duration and get the time (class='colGvgSkillDur')
      element = $(parentElem).find('.colGvgSkillDur')
      nightmareDetails[keys[6]] = element.text();

      nightmareArray.push(nightmareDetails);
    })

    return nightmareArray;
    

}

async function fullScrape()
{
      // Loads web page html and loads into cheerio. Accessed via $ element
      let $ = await scraperInit.initialiseWebPage("Fire", "0SP")

      let nightmareArray = scrapeWebPage($);
  
      // Repeat for every element and sp cost
      $ = await scraperInit.initialiseWebPage("Fire", "200SP")
  
      nightmareArray = nightmareArray.concat(scrapeWebPage($));
  
      $ = await scraperInit.initialiseWebPage("Water", "0SP")
  
      nightmareArray = nightmareArray.concat(scrapeWebPage($));
  
      $ = await scraperInit.initialiseWebPage("Water", "200SP")
  
      nightmareArray = nightmareArray.concat(scrapeWebPage($));
  
      $ = await scraperInit.initialiseWebPage("Wind", "0SP")
  
      nightmareArray = nightmareArray.concat(scrapeWebPage($));
  
      $ = await scraperInit.initialiseWebPage("Wind", "200SP")
  
      nightmareArray = nightmareArray.concat(scrapeWebPage($));

      return nightmareArray;
  
}

async function fullEnNightmareScrape()
{
  let $ = await scraperInit.initialiseWebPage(null, null, false)
  let nightmareList = scrapeNightmares($)

  $ = await scraperInit.initialiseWebPage(null, null, true)
  let nightmareList2 = scrapeNightmares($)

  let completeNightmareList = nightmareList.concat(nightmareList2)

  return completeNightmareList;
}

function scrapeNightmares($)
{
  const nightmareList = []

  $("tbody tr").each((parentIndex, parentElem) => {
    let row= {}
    let jpName = null;
    let enName = null;
    let element = null
    let enSkillName = null;
    let enSkillDetails = null;

    //Find the jp name
    element = $(parentElem).find('.rawname');
    jpName = element.text().trim();

    //Find the en name
    element = $(parentElem).find('.link.enname');
    enName = element.text().trim();

    // Find the skill name element and get the skill name (class='gvgTitle')
    element = $(parentElem).find('.gvgTitle')
    enSkillName = element.text().trim()

    // Find the skill name element and get the skill description (class='tableDetail en')
    element = $(parentElem).find('.tableDetail.en')
    enSkillDetails = element.text().trim();

    //Place all values into json object
    row['Name'] = jpName;
    row['NameEN'] = enName;
    row['GvgSkillEN'] = enSkillName;
    row['GvgSkillDetailEN'] = enSkillDetails;

    nightmareList.push(row)

  })

  return nightmareList;
}

module.exports = 
{
    scrapeWebPage,
    fullScrape,
    fullEnNightmareScrape
}