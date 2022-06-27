const express = require('express')
const cors = require('cors')
const app = express()
const port = parseInt(process.env.PORT, 10) || 3001

const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const scraperInit = require('./scraperInitialisation.js');
const scraper = require('./scraper.js')

app.use(cors())

app.get('/', async(req, res) => {
  try {
    // Loads web page html and loads into cheerio. Accessed via $ element
    const $ = await scraperInit.initialiseWebPage("Fire", "0SP")

    let nightmareArray = scraper.scrapeWebPage($);

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