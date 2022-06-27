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
      //console.log("Entered each function")
      let element = "";
      const nightmareDetails = {};

      //console.log("Parent html------------------------------------")
      //console.log($(parentElem).html())
      //console.log("End Parent html------------------------------------")


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

module.exports = 
{
    scrapeWebPage
}