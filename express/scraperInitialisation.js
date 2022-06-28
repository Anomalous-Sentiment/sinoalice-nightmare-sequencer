const cheerio = require('cheerio')
const puppeteer = require('puppeteer')

// Function to initialise loaded fields in browser (Preparation for web scraping)
// Need to select the fields to display and get the html loaded in cheerio
async function initialiseWebPage(elementalType, spCost)
{
  console.time()
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://sinoalice.game-db.tw/nightmares");

  //Use puppeteer to display desired fields in table by clicking field button
  const query = "Field";

  page.on('console', msg => {
    console.log(msg.text())
  });

  //Run this  function in the console of the loaded page in puppeteer
  page.evaluate((query, type, spCost) => {
    
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
        console.log("entered")
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

      console.log("entered2")

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

      console.log("Finished")
    }

    // If element and sp cost specified, filter by specified element and sp cost
    if (type != null && type != undefined)
    {
        let filterButton = [...document.querySelectorAll(".filterBtn")][0];
        filterButton.click()

        let contentBoxElements = [...document.querySelectorAll(".dialogWindow.filterWindowNM .dialogBody .dialogTitle2")];

        filterButton.click()

        console.log(contentBoxElements.toString())
      nightmaresFilterBy(contentBoxElements, "Origin of Rare", ["A", "S", "SS", "L"])

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
  
  await page.screenshot({ path: 'example.png' });

  const htmlString = await page.content();
  const $ = cheerio.load(htmlString)

  await browser.close();

  console.timeEnd()

  return $;
}

module.exports = 
{
    initialiseWebPage
}