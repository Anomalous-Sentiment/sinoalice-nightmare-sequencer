import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import NightmareImageList from './nightmare-image-list'
import { Chart } from "react-google-charts";
import { DateTime } from "luxon";
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import 'bootstrap/dist/css/bootstrap.min.css';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'


export default function NightmarePlotter() {
  const [jsonData, setJsonData] = useState(null);
  const [serverNightmares, updateServerNightmares] = useState(null)
  const [globalNightmares, updateGlobalNightmares] = useState(null)
  const [jpnightmares, updateJpNightmares] = useState(null)
  const [iconKey, setIconKey] = useState('en_icon_url') 
  const [displayNameKey, setDisplayNameKey] = useState('en_name')
  const [toolTipSkillNameKey, setToolTipSkillNameKey] = useState('en_colo_skill_name')
  const [toolTipDescriptionKey, setToolTipDescriptionKey] = useState('en_colo_skill_desc')
  const timelineStateRef = useRef();
  const selectedNightmaresStateRef = useRef();
  const [selectedNightmares, setSelected] = useState([])
  const [globalOnly, setGlobalServer] = useState(null)
  const [categoryTabs, setCategoryTabs] = useState(null)

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
  
  //These will need to be accessed by callbacks
  selectedNightmaresStateRef.current = selectedNightmares;
  timelineStateRef.current = timelineRows;

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
      minValue: now.toJSDate(),
      direction: '-1'
    },
  };

  console.log('Rows:', timelineRows)
  const [data, setData] = useState([columns, ...timelineRows]);

    //Run only once on first render
    useEffect(() => {
        //Use the backend address here
        fetch("http://localhost:3001/")
        .then(response => response.json())
        .then((json) => {
        filterByServer(json["nightmares"]);
        setJsonData(json);

        })
        .catch(err => console.log(err));
    }, [])

  useEffect(() => {
    if (jsonData != null)
    {
      //Get all major categories and generate tabs for each category
      let tabList = jsonData['tags'].map(jsonObj => {
        const majorTagName = jsonObj['major_tag'];
        const subTagsList = jsonObj['sub_tags'];

        return(
          <Tab eventKey={majorTagName} title={majorTagName}>
            <NightmareImageList list={serverNightmares ? serverNightmares.filter(nm => nm['major_tags'].includes(majorTagName)) : null} onClick={onSelection} iconKey={iconKey} displayName={displayNameKey} toolTipSkillName={toolTipSkillNameKey} toolTipDescription={toolTipDescriptionKey}/>
          </Tab>
        )
      }, [jsonData])

      //Set the tabs
      setCategoryTabs(tabList);
    }

  }, [jsonData, serverNightmares])


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

    
    //Add to selected list with appropriate prep time and duration
    prepRow = [selectedNightmare[displayNameKey], "Prep", previousNightmareEndTime.toJSDate(), currentNightmarePrepEndTime.toJSDate()]

    newRows = [...timelineStateRef.current, prepRow]
    
    //Check if there is an effective duration
    if(selectedNightmare['effective_time'] != '0')
    {
      //Add active duration row on after end of prep time
      durRow = [selectedNightmare[displayNameKey], "Active", currentNightmarePrepEndTime.toJSDate(), currentNightmareEndTime.toJSDate()]
      newRows = [...newRows, durRow]
    }


    //Add nightmare to selected nightmares list
    selectedNightmaresCopy.push(selectedNightmare)

    setSelected(selectedNightmaresCopy)

    setTimelineRows(newRows)
    setData([columns, ...newRows])



  }

  useEffect(() => {
    //Function to run when flag changes

    //Check if flag is set to show global nightmares only
    if (globalOnly)
    {
      setIconKey('en_icon_url')
      setDisplayNameKey('en_name')
      setToolTipSkillNameKey('en_colo_skill_name')
      setToolTipDescriptionKey('en_colo_skill_desc')
      updateServerNightmares(globalNightmares)
    }
    else
    {
      setIconKey('jp_icon_url')
      setDisplayNameKey('jp_name')
      setToolTipSkillNameKey('jp_colo_skill_name')
      setToolTipDescriptionKey('jp_colo_skkill_desc')
      updateServerNightmares(jpnightmares)
    }
  }, [globalOnly])

  //Function called when nightmare deselected/removed
  function onRemove(deselectedNightmare)
  {
    let newRows = [...shinmaTimes];
    let filteredNightmares = null;

    // Remove from selected list 
    filteredNightmares = selectedNightmaresStateRef.current.filter(nightmare => nightmare[displayNameKey] != deselectedNightmare[displayNameKey])

    // Recalculate timeline times according to modified selected nightmares list
    filteredNightmares.forEach((nightmare, index, array) => {
      //Calculate new times for each nightmare in list in order
      let prepRow = null;
      let durRow = null;

      if (index == 0)
      {
        //First nightmare in list, start at time 0
        prepRow = [nightmare[displayNameKey], "Prep", now.toJSDate(), now.plus({ seconds: nightmare[prepTimeKey] }).toJSDate()]        
      }
      else
      {
        //Not the first nightmare. calculate time using previous row
        prepRow = [nightmare[displayNameKey], "Prep", newRows[newRows.length - 1][3], DateTime.fromJSDate(newRows[newRows.length - 1][3]).plus({ seconds: nightmare[prepTimeKey] }).toJSDate()]
      }

      //Add prep row to newrows array
      newRows.push(prepRow);

      if (nightmare['effective_time'] != '0')
      {
        //Add dur row if there is a active duration
        durRow = [nightmare[displayNameKey], "Active", prepRow[3], DateTime.fromJSDate(prepRow[3]).plus({ seconds: nightmare[effectTimeKey] }).toJSDate()]
        newRows.push(durRow)
      }
    })

    //Update selected nightmares
    setSelected(filteredNightmares)

    //Update timeline rows
    setTimelineRows(newRows)

    //Update the timeline graph
    setData([columns, ...newRows])

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

      <ToggleButtonGroup name="servers" size="lg" className="mb-2" type="radio" defaultValue="Global" onChange={onServerchange}>
          <ToggleButton id="global" value={true}>
            Global
          </ToggleButton>
          <ToggleButton id="japan" value={false}>
            Japan
          </ToggleButton>
      </ToggleButtonGroup>

      <Tabs defaultActiveKey="all" id="uncontrolled-tab-example" className="mb-3">
      <Tab eventKey="all" title="All Nightmares">
        <NightmareImageList list={serverNightmares} onClick={onSelection} iconKey={iconKey} displayName={displayNameKey} toolTipSkillName={toolTipSkillNameKey} toolTipDescription={toolTipDescriptionKey}/>
      </Tab>
      {categoryTabs}
      <Tab eventKey="other" title="Other" disabled>
      </Tab>
      <Tab eventKey="selected" title="Selected Nightmares">
      <NightmareImageList list={selectedNightmares} onClick={onRemove} iconKey={iconKey} displayName={displayNameKey} toolTipSkillName={toolTipSkillNameKey} toolTipDescription={toolTipDescriptionKey}/>
      </Tab>
      </Tabs>

    </div>

  )
}