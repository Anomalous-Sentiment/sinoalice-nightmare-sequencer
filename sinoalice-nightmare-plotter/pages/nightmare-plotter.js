import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import NightmareImageList from './nightmare-image-list'
import { Chart } from "react-google-charts";
import { DateTime } from "luxon";
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import 'bootstrap/dist/css/bootstrap.min.css';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import SubTabs from './sub-tabs'

const EN_LANG = {
  icon: 'en_icon_url',
  name: 'en_name',
  skill_name: 'en_colo_skill_name',
  skill_description: 'en_colo_skill_desc',
  skill_rank: 'en_rank',
  prep_time: 'prep_time',
  dur_time: 'effective_time'
};

const JP_LANG = {
  icon: 'jp_icon_url',
  name: 'jp_name',
  skill_name: 'jp_colo_skill_name',
  skill_description: 'jp_colo_skill_desc',
  skill_rank: 'jp_rank',
  prep_time: 'prep_time',
  dur_time: 'effective_time'
};

export default function NightmarePlotter() {
  const [jsonData, setJsonData] = useState(null);
  const [serverNightmares, updateServerNightmares] = useState()
  const [globalNightmares, updateGlobalNightmares] = useState(null)
  const [jpnightmares, updateJpNightmares] = useState(null)
  const timelineStateRef = useRef();
  const selectedNightmaresStateRef = useRef();
  const [selectedNightmares, setSelected] = useState([])
  const [globalOnly, setGlobalServer] = useState(null)
  const [generalCategoryTabs, setCategoryTabs] = useState(null)
  const [displayOptions, setDisplay] = useState(EN_LANG);


    // Get the current time. Useing state only so that it's maintained across re-renders, and so it doesn't get a new time if re-rendering after a day
  const [now, setTime] = useState(DateTime.now().startOf('day'))

  const prepTimeKey = 'prep_time';
  const effectTimeKey = 'effective_time';

  const columns = [
    { type: "string", id: "nightmare"},
    { type: "string", id: "state"},
    { type: "date", id: "Start" },
    { type: "date", id: "End" },
  ]


  //Define demon/shinma appearance times
  const shinmaTimes = [
    ['Demon/Shinma', 'Demon 1', now.plus({minutes: 2}).toJSDate(), now.plus({minutes: 5}).toJSDate()],
    ['Demon/Shinma', 'Demon 2', now.plus({minutes: 12}).toJSDate(), now.plus({minutes: 15}).toJSDate()]
  ]
  const [timelineRows, setTimelineRows] = useState(shinmaTimes)
  

  const placeholderRows = [
    ["Fear", "Prep", now.toJSDate(), now.plus({ seconds: 40 }).toJSDate()],
    ["Ugallu", "Prep", now.plus({ seconds: 40 }).toJSDate(), now.plus({ seconds: 40 + 80}).toJSDate()],
    ["Ugallu", "Active", now.plus({ seconds: 120 }).toJSDate(), now.plus({ seconds: 120 + 120}).toJSDate()],
    ["Griffon", "Prep", now.plus({ seconds: 240}).toJSDate(), now.plus({ seconds: 240 + 80}).toJSDate()],
    ["Griffon", "Active", now.plus({ seconds: 320}).toJSDate(), now.plus({ seconds: 320 + 120}).toJSDate()],
    ["Lindwyrm", "Prep", now.plus({ seconds: 440}).toJSDate(), now.plus({ seconds: 440 + 80}).toJSDate()],
    ["Lindwyrm", "Active", now.plus({ seconds: 520}).toJSDate(), now.plus({ seconds: 520 + 120}).toJSDate()],
    ["Freeze Golem", "Prep", now.plus({ seconds: 640}).toJSDate(), now.plus({ seconds: 640 + 80}).toJSDate()],
    ["Freeze Golem", "Active", now.plus({ seconds: 720}).toJSDate(), now.plus({ seconds: 720 + 120}).toJSDate()],
    ["Yuno", "Prep", now.plus({ seconds: 840}).toJSDate(), now.plus({ seconds: 890}).toJSDate()],
    ["Yuno", "Active", now.plus({ seconds: 890}).toJSDate(), now.plus({ seconds: 990}).toJSDate()],
    ["Dryas", "Prep", now.plus({ seconds: 990}).toJSDate(), now.plus({ seconds: 1040}).toJSDate()],
    ["Dryas", "Active", now.plus({ seconds: 1040}).toJSDate(), now.plus({ seconds: 1140}).toJSDate()],
    ["Rikone", "Prep", now.plus({ seconds: 1140}).toJSDate(), now.plus({ seconds: 1190}).toJSDate()],
    ["Rikone", "Active", now.plus({ seconds: 1190}).toJSDate(), now.plus({ seconds: 1290}).toJSDate()]
  ]
  const options = {
    colors : ["blue", "red"],
    hAxis: {
      format: 'mm:ss',
      maxValue: now.plus({minutes: 20}).toJSDate(),
      minValue: now.toJSDate()
    },
  };

  const [data, setData] = useState([columns, ...timelineRows]);

  useEffect(() => {
    //Initialise refs every render
    //These will need to be accessed by callbacks
    selectedNightmaresStateRef.current = selectedNightmares;
    timelineStateRef.current = timelineRows;
  })

  //Run only once on first render
  useEffect(() => {

    //Use the backend address here
    fetch("http://localhost:3001/")
    .then(response => response.json())
    .then((json) => {
      const nightmares = json['nightmares']
      //Initialise selected key field to false (for usage in image list)
      nightmares.forEach(element => element['selected'] = false)
      filterByServer(json["nightmares"]);
      setJsonData(json);

    })
    .catch(err => console.log(err));
  }, [])

  useEffect(() => {
    if (jsonData && serverNightmares)
    {      
      //Get all major categories and generate tabs for each category
      const tabList = jsonData['general_tags'].map((jsonObj, index, array) => {
        const generalTagName = jsonObj['general_tag'];
        const majorTagsList = jsonData['major_tags'].filter(element => element['general_tag'] == generalTagName);

        return(
          <Tab key={generalTagName} eventKey={generalTagName} title={generalTagName}>
            <SubTabs tabNightmares={serverNightmares ? serverNightmares.filter(nm => nm['general_tags'].includes(generalTagName)) : null}
            displayOptions={displayOptions}
            onClick={onNightmareClick}
            mainCategories={majorTagsList}>
            </SubTabs>
          </Tab>

        )
      })

      //Set the tabs
      setCategoryTabs(tabList);
    }

  }, [jsonData, serverNightmares])

  function onNightmareClick(nightmare)
  {
    //Check if nightmare is selected
    if (!nightmare['selected'])
    {
      //Is selected. Call relevant function
      onSelection(nightmare)

    }
    else
    {
      //nightmare may have a selected state = true, even if not in selectdNightmares list
      //If not in list, it is a nm with the same base skill name
      if (selectedNightmares.some(element => element['jp_name'] == nightmare['jp_name']))
      {
        //In selected nm list. Call deselection function
        onRemove(nightmare)
      }
      else
      {
        // Alert informing user which nightmare in list has the same skill
        let sameSkillNm = selectedNightmares.find(element => element['jp_colo_skill_name'] == nightmare['jp_colo_skill_name'])

        console.log('Nightmare: ', sameSkillNm[displayOptions['name']], ', has the same skill effect. Deselect this nightmare to select this nightmare.')
      }

    }
  }

  function updateNightmareSelectionState(nightmare)
  {
    //Set the nightmare's select field value to opposite value
    const serverNightmaresCopy = [...serverNightmares];
    serverNightmaresCopy.forEach(element => {
      //This will affect non-evolved versions, as well as nightmares with the base skill name
      if(element['jp_name'] == nightmare['jp_name'] || element['jp_colo_skill_name'] == nightmare['jp_colo_skill_name'])
      {
        element['selected'] = !element['selected']
      }
    })

    updateServerNightmares(serverNightmaresCopy);
  }


  //Function called when a nightmare clicke/selected
  function onSelection(selectedNightmare)
  {
    console.log("Entered")
    let prepRow = null;
    let durRow = null;
    let prepTime = selectedNightmare['prep_time'];
    let durTime = selectedNightmare['effective_time'];
    let previousNightmareEndTime = null;
    //Check if this is the first nightmare in the timeline
    if (selectedNightmaresStateRef.current.length == 0)
    {
      //If first, the prep time starts from 0:00
      previousNightmareEndTime = now;
      console.log('length = 0')

    }
    else
    {
      //If not first, prep time starts from end of last nightmare
      console.log(timelineStateRef.current[timelineRows.length - 1][3])
      previousNightmareEndTime = DateTime.fromJSDate(timelineStateRef.current[timelineStateRef.current.length - 1][3]);
      console.log('length > 0')
    }
    let currentNightmarePrepEndTime = previousNightmareEndTime.plus({seconds: prepTime});
    let currentNightmareEndTime = currentNightmarePrepEndTime.plus({seconds: durTime});
    let newRows = null;
    let selectedNightmaresCopy = [...selectedNightmaresStateRef.current]
    console.log(selectedNightmaresStateRef.current)
    console.log(timelineStateRef.current)


    //Check if the end time of the last nightmare exceeds 20 minutes
    if (now.plus({minutes: 20}) > previousNightmareEndTime)
    {
      //Add to selected list with appropriate prep time and duration
      prepRow = [selectedNightmare[displayOptions['name']], "Prep", previousNightmareEndTime.toJSDate(), currentNightmarePrepEndTime.toJSDate()]

      newRows = [...timelineStateRef.current, prepRow]

      //Check if there is an effective duration
      if(selectedNightmare['effective_time'] != '0')
      {
        //Add active duration row on after end of prep time
        durRow = [selectedNightmare[displayOptions['name']], "Active", currentNightmarePrepEndTime.toJSDate(), currentNightmareEndTime.toJSDate()]
        newRows = [...newRows, durRow]
      }


      //Add nightmare to selected nightmares list
      selectedNightmaresCopy.push(selectedNightmare)

      setSelected(selectedNightmaresCopy)

      setTimelineRows(newRows)
      setData([columns, ...newRows])

      updateNightmareSelectionState(selectedNightmare)
    }
    else
    {
      //Time exceeds 20 minutes. Show alert
    }
    




  }

  useEffect(() => {
    //Function to run when flag changes

    //Check if flag is set to show global nightmares only
    if (globalOnly)
    {
      setDisplay(EN_LANG)
      updateServerNightmares(globalNightmares)
    }
    else
    {
      setDisplay(JP_LANG)
      updateServerNightmares(jpnightmares)
    }
  }, [globalOnly])

  //Function called when nightmare deselected/removed
  function onRemove(deselectedNightmare)
  {
    let newRows = [...shinmaTimes];
    let filteredNightmares = null;

    // Remove from selected list 
    filteredNightmares = selectedNightmaresStateRef.current.filter(nightmare => nightmare[displayOptions['name']] != deselectedNightmare[displayOptions['name']])

    // Recalculate timeline times according to modified selected nightmares list
    filteredNightmares.forEach((nightmare, index, array) => {
      //Calculate new times for each nightmare in list in order
      let prepRow = null;
      let durRow = null;

      if (index == 0)
      {
        //First nightmare in list, start at time 0
        prepRow = [nightmare[displayOptions['name']], "Prep", now.toJSDate(), now.plus({ seconds: nightmare[displayOptions['prep_time']] }).toJSDate()]        
      }
      else
      {
        //Not the first nightmare. calculate time using previous row
        prepRow = [nightmare[displayOptions['name']], "Prep", newRows[newRows.length - 1][3], DateTime.fromJSDate(newRows[newRows.length - 1][3]).plus({ seconds: nightmare[prepTimeKey] }).toJSDate()]
      }

      //Add prep row to newrows array
      newRows.push(prepRow);

      if (nightmare['effective_time'] != '0')
      {
        //Add dur row if there is a active duration
        durRow = [nightmare[displayOptions['name']], "Active", prepRow[3], DateTime.fromJSDate(prepRow[3]).plus({ seconds: nightmare[displayOptions['dur_time']] }).toJSDate()]
        newRows.push(durRow)
      }
    })

    //Update selected nightmares
    setSelected(filteredNightmares)

    //Update timeline rows
    setTimelineRows(newRows)

    //Update the timeline graph
    setData([columns, ...newRows])

    updateNightmareSelectionState(deselectedNightmare)


  }

  function filterByServer(unfilteredNightmares)
  {
    //filter by global nightmares
    updateGlobalNightmares(unfilteredNightmares.filter(nightmare => nightmare['global'] == true))

    //Change global only flag
    setGlobalServer(true)

    //filter by jp nightmares
    updateJpNightmares(unfilteredNightmares)
  }

  function onServerchange(newValue)
  {
    //Change the server flag to the new value
    setGlobalServer(newValue);

  }

  return (
    <div>
      <Chart chartType="Timeline" data={data} width="100%" height="400px" options={options}/>

      <ToggleButtonGroup name="servers" size="lg" className="mb-2" type="radio" defaultValue={true} onChange={onServerchange}>
          <ToggleButton id="global" value={true}>
            Global
          </ToggleButton>
          <ToggleButton id="japan" value={false}>
            Japan
          </ToggleButton>
      </ToggleButtonGroup>

      <Tabs defaultActiveKey="all" id="general-tabs" className="mb-3">
      <Tab eventKey="all" title="All Nightmares">
        <NightmareImageList list={serverNightmares} 
        onClick={onNightmareClick}
        displayOptions={displayOptions}/>
      </Tab>
      {generalCategoryTabs}
      <Tab eventKey="other" title="Other">
        <NightmareImageList 
        list={serverNightmares ? serverNightmares.filter(nm => nm['general_tags'].length == 0) : null} 
        onClick={onSelection} 
        displayOptions={displayOptions}/>
      </Tab>
      <Tab eventKey="selected" title="Selected Nightmares">
      <NightmareImageList 
        list={selectedNightmares} 
        onClick={onNightmareClick} 
        displayOptions={displayOptions}/>
      </Tab>
      </Tabs>

    </div>

  )
}
