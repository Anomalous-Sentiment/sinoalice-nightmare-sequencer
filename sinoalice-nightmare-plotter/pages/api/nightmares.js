// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')

export default async(req, res) => {
    try {
      console.time()
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://sinoalice.game-db.tw/nightmares");
      const htmlString = await page.content();
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

        // Then select only your desired fields
        const selectedElements = disabledElements.filter(e => e.innerText.includes("Icon") || e.innerText.includes("Colo.Skill") || e.innerText.includes("Colo.Prep") || e.innerText.includes("Colo.Dur."))

        // Iterate through list and click desired field
        selectedElements.forEach((element, index, array) => {
          element.click();
        })

        // Click the submit button to confirm selected fields. The class name is "dialogOK2"
        const submitButton = [...document.querySelectorAll(".dialogOK2")];

        submitButton[0].click()

        
      }, query)
      await page.screenshot({ path: 'example.png' });


      await browser.close();
      const $ = cheerio.load(htmlString)

      console.timeEnd()

      const nightmareArray = [];

      const keys = [
        "Icon",
        "Name",
        "Total80",
        "PATK",
        "MATK",
        "Total120",
        "St.Skill",
        "Colo.Skill",
        "Effect"
      ]

      /*

      //Iterate through all rows of table of nightmares and their fields
      $("tbody tr").each((parentIndex, parentElem) => {
        console.log("Entered each function")
        let keyIndex = 0;
        const nightmareDetails = {};

        console.log("Parent html------------------------------------")
        console.log($(parentElem).html())
        console.log("End Parent html------------------------------------")

        // Iterate over each child of tr
        
        $(parentElem)
        .children("td")
        .each((childId, childElem) => 
        {
          const value = $(childElem).text();

          console.log("-------------------------------------------------")
          console.log($(childElem).html())

          nightmareDetails[keys[keyIndex]] = value;

          keyIndex++;
        });
        

        nightmareArray.push(nightmareDetails);
        //console.log($(parentElem).children().data)
      })
      */

      return res.status(200).json({nightmares: nightmareArray});
    }
    catch(err)
    {
      console.log(err)
      return res.status(404);

    }
}
