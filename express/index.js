const express = require('express')
const cors = require('cors')
const app = express()
const port = parseInt(process.env.PORT, 10) || 3001

const cheerio = require('cheerio')
const puppeteer = require('puppeteer')


app.use(cors())

app.get('/', async(req, res) => {
  try {
    const $ = await initialiseWebPage()
    
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
      console.log("Entered each function")
      let element = "";
      const nightmareDetails = {};

      console.log("Parent html------------------------------------")
      console.log($(parentElem).html())
      console.log("End Parent html------------------------------------")


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
    

    return res.status(200).json({nightmares: nightmareArray});
  }
  catch(err)
  {
    console.log(err)
    return res.status(404);

  }
})

// Function to initialise loaded fields in browser (Preparation for web scraping)
// Need to select the fields to display and get the html loaded in cheerio
async function initialiseWebPage()
{
  console.time()
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://sinoalice.game-db.tw/nightmares");
  await page.screenshot({ path: 'example.png' });

  //Use puppeteer to display desired fields in table by clicking field button
  const query = "Field";

  //Run this  function in the console of the loaded page in puppeteer
  page.evaluate(query => {
    //Query to select all div elements that are descendants of the class "ctrlbtns"
    const elements = [...document.querySelectorAll(".ctrlbtns div")];

    // Either use .find or .filter, comment one of these
    // find element with find
    const targetElement = elements.find(e => e.innerText.includes(query));

    // make sure the element exists, and only then click it
    if (targetElement)
    {
      targetElement.click();
    }

    // Deselect all fields
    // Get list of all enabled fields
    const deselectElements = [...document.querySelectorAll(".dialogContent .sortBtn.large.enabled.en")];
    console.log(deselectElements)

    // Iterate through list and click each button to disable
    deselectElements.forEach((element, index, array) => {
      element.click();
    })

    // Get all deselected elements
    const disabledElements = [...document.querySelectorAll(".dialogContent .sortBtn.large.en")];

    // Then select only your desired fields (icon, colo skill, colo prepr time, colo duration time)
    const selectedElements = disabledElements.filter(e => e.innerText.includes("Icon") || e.innerText.includes("Colo.Skill") || e.innerText.includes("Colo.Prep") || e.innerText.includes("Colo.Dur."))

    // Iterate through list and click desired field
    selectedElements.forEach((element, index, array) => {
      element.click();
    })

    // Click the submit button to confirm selected fields. The class name is "dialogOK2"
    const submitButton = [...document.querySelectorAll(".dialogOK2")];

    submitButton[0].click()

    
  }, query);
  
  await page.screenshot({ path: 'example.png' });

  const htmlString = await page.content();
  const $ = cheerio.load(htmlString)

  await browser.close();

  console.timeEnd()

  return $;
}

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})