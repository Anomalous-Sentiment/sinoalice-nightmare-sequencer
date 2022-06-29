const cheerio = require('cheerio');
const puppeteer = require('puppeteer')

// Function to initialise loaded fields in browser (Preparation for web scraping)
// Need to select the fields to display and get the html loaded in cheerio
async function initialiseWebPage(elementalType, spCost, upgraded)
{
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://sinoalice.game-db.tw/nightmares", {timeout: 0});

  //Use puppeteer to display desired fields in table by clicking field button
  const query = "Field";


  page.on('console', msg => {
    console.log(msg.text())
  });

  await page.screenshot({ path: 'examplebefore.png' });

  //Switch to gloabl sinoalice db
  await page.click('#root > div > div.mainLayer > div > div.ctrlbtns > div.settingBtn.tip')

  await page.click('#root > div > div.mainLayer > div > div.dialogMask > div.dialogWindow.settingWindowNM > div.dialogBody > div > div.dialogContent > div:nth-child(2)')

  await page.click('#root > div > div.mainLayer > div > div.dialogMask > div.dialogWindow.settingWindowNM > div.dialogOK2.c')

  //Wait for the Field button to appear before continuing
  await page.waitForSelector('#root > div > div.mainLayer > div > div.ctrlbtns > div:nth-child(3)')
  
  // If the upgraded flag is false, view nightmares in their base rarity instead of their upgraded rarity
  if (upgraded != undefined && upgraded != null && upgraded == false)
  {
    await page.click('#root > div > div.mainLayer > div > div.ctrlbtns > div.filterBtn')
    await page.click('#root > div > div.mainLayer > div > div.dialogMask > div.dialogWindow.filterWindowNM > div.dialogBody > div:nth-child(5) > div.dialogContent > div:nth-child(1)')

    await page.click('#root > div > div.mainLayer > div > div.dialogMask > div.dialogWindow.filterWindowNM > div.dialogOK2')
  
  }

  //Run this  function in the console of the loaded page in puppeteer
  page.evaluate((query, type, spCost) => {
    //Query to select all div elements that are descendants of the class "ctrlbtns"
    const elements = [...document.querySelectorAll(".ctrlbtns div")];

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
    const submitButton = [...document.querySelectorAll(".dialogOK2")][0];
    submitButton.click()

    //Define a filter function
    function nightmaresFilterBy(contentBoxElements, categoryTitle, filterList)
    {
      const filterSubmitButton = [...document.querySelectorAll(".dialogOK2")][0];

      let parentDiv = null;

      // Look for div that contains rarity filter buttons
      contentBoxElements.forEach((element, index, array) => {
        // Check if title contains categoryTitle in the title
        if (element.textContent == categoryTitle)
        {
          //If true, select the parent div element
          parentDiv = element.closest('.dialogGroup')
        }

      })


      //Get a list of elements with 'sortBtn' class
      const enabledElementButtons = [...parentDiv.querySelectorAll(".sortBtn.enabled")];

      enabledElementButtons.forEach((element, index, array) => {
        // Reset all buttons
        element.click();
      })

      const elementButtons = [...parentDiv.querySelectorAll(".sortBtn")];

      elementButtons.forEach((element, index, array) => {
        // Only click the button that represents the element type to be filtered by
        if (filterList.includes(element.textContent))
        {
          element.click()
        }
      })

      //Confirm filters
      filterSubmitButton.click()

    }
    let filterButton = [...document.querySelectorAll(".filterBtn")][0];
    filterButton.click()

    let contentBoxElements = [...document.querySelectorAll(".dialogWindow.filterWindowNM .dialogBody .dialogTitle2")];

    nightmaresFilterBy(contentBoxElements, "Origin of Rare", ["A", "S", "SS", "L"])

    // If element and sp cost specified, filter by specified element and sp cost
    if (type != null && type != undefined)
    {
      filterButton = [...document.querySelectorAll(".filterBtn")][0];
      filterButton.click()
      contentBoxElements = [...document.querySelectorAll(".dialogWindow.filterWindowNM .dialogBody .dialogTitle2")];

      nightmaresFilterBy(contentBoxElements, "Element", [type])
      filterButton = [...document.querySelectorAll(".filterBtn")][0];
      filterButton.click()
      contentBoxElements = [...document.querySelectorAll(".dialogWindow.filterWindowNM .dialogBody .dialogTitle2")];

      
      // Filter by the sp cost type if defined
      if (spCost != null && spCost != undefined)
      {
        filterButton = [...document.querySelectorAll(".filterBtn")][0];
        filterButton.click()
        contentBoxElements = [...document.querySelectorAll(".dialogWindow.filterWindowNM .dialogBody .dialogTitle2")];
          
        // Filter by specified sp cost nightmares
        nightmaresFilterBy(contentBoxElements, "Colosseum SP", [spCost])
      }

      filterButton.click()

    }
    
  }, query, elementalType, spCost);
  

  const htmlString = await page.content();
  const $ = cheerio.load(htmlString)

  await browser.close();

  return $;
}

module.exports = 
{
    initialiseWebPage
}