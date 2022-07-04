import Head from 'next/head'
import { useEffect, useState, useRef } from 'react';
import styles from '../styles/Home.module.css'
import NightmareImageList from './nightmare-image-list'
import { Chart } from "react-google-charts";
import { DateTime } from "luxon";
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import 'bootstrap/dist/css/bootstrap.min.css';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'


export default function Home() {
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

  const columns = [
    { type: "string", id: "nightmare"},
    { type: "string", id: "state"},
    { type: "date", id: "Start" },
    { type: "date", id: "End" },
  ]
  // Get the current time
  const now = DateTime.now().startOf('hour');

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

  if (serverNightmares == null)
  {
    //Use the backend address here
    fetch("http://localhost:3001/")
    .then(response => response.json())
    .then((json) => {
      console.log('Retrieved')
      filterByServer(json["nightmares"]);
      updateServerNightmares(globalNightmares)
    })
    .catch(err => console.log(err));
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
    console.log(selectedNightmares)
    console.log(timelineRows)
  })

  //Function called when nightmare deselected/removed
  function onRemove(deselectedNightmare)
  {
    let prepTime = deselectedNightmare['prep_time'];
    let durTime = deselectedNightmare['effective_time'];
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
        prepRow = [nightmare[displayNameKey], "Prep", now.toJSDate(), now.plus({ seconds: prepTime }).toJSDate()]        
      }
      else
      {
        //Not the first nightmare. calculate time using previous row
        prepRow = [nightmare[displayNameKey], "Prep", newRows[newRows.length - 1][3], DateTime.fromJSDate(newRows[newRows.length - 1][3]).plus({ seconds: prepTime }).toJSDate()]
      }

      //Add prep row to newrows array
      newRows.push(prepRow);

      if (nightmare['effective_time'] != '0')
      {
        //Add dur row if there is a active duration
        durRow = [nightmare[displayNameKey], "Active", prepRow[3], DateTime.fromJSDate(prepRow[3]).plus({ seconds: nightmare['effective_time'] }).toJSDate()]
        newRows.push(durRow)
      }
    })

    //Update timeline rows
    setTimelineRows(newRows)

    //Update the timeline graph
    setData([columns, ...newRows])

  }

  function filterByServer(unfilteredNightmares)
  {
    //filter by global nightmares
    updateGlobalNightmares(unfilteredNightmares.filter(nightmare => nightmare['global'] == true))

    //filter by jp nightmares
    updateJpNightmares(unfilteredNightmares)
  }

  function onServerchange(newServer)
  {
    console.log(newServer == 'Global')
    //change the filter to filter by new server
    if (newServer == 'Global')
    {
      updateServerNightmares(globalNightmares)
      setIconKey('en_icon_url')
      setDisplayNameKey('en_name')
      setToolTipSkillNameKey('en_colo_skill_name')
      setToolTipDescriptionKey('en_colo_skill_desc')
    }
    else
    {
      updateServerNightmares(jpnightmares)
      setIconKey('jp_icon_url')
      setDisplayNameKey('jp_name')
      setToolTipSkillNameKey('jp_colo_skill_name')
      setToolTipDescriptionKey('jp_colo_skkill_desc')
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>SINoALICE Nightmare Plotter</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/alice.ico" />
      </Head>
      <Chart chartType="Timeline" data={data} width="100%" height="400px" options={options}/>

      <ToggleButtonGroup name="servers" size="lg" className="mb-2" type="radio" defaultValue="Global" onChange={onServerchange}>
          <ToggleButton id="global" value="Global">
            Global
          </ToggleButton>
          <ToggleButton id="japan" value="Japan">
            Japan
          </ToggleButton>
      </ToggleButtonGroup>

      <Tabs defaultActiveKey="all" id="uncontrolled-tab-example" className="mb-3">
      <Tab eventKey="all" title="All Nightmares">
        <NightmareImageList list={serverNightmares} onClick={onSelection} iconKey={iconKey} displayName={displayNameKey} toolTipSkillName={toolTipSkillNameKey} toolTipDescription={toolTipDescriptionKey}/>
      </Tab>
      <Tab eventKey="buff" title="Buff">
      </Tab>
      <Tab eventKey="debuff" title="Debuff">
      </Tab>
      <Tab eventKey="elemental" title="Elemental Nightmares">
      </Tab>
      <Tab eventKey="bells" title="Bells">
      </Tab>
      <Tab eventKey="reset" title="Gear Reset">
      </Tab>
      <Tab eventKey="other" title="Other" disabled>
      </Tab>
      <Tab eventKey="selected" title="Selected Nightmares">
      <NightmareImageList list={selectedNightmares} onClick={onRemove} iconKey={iconKey} displayName={displayNameKey} toolTipSkillName={toolTipSkillNameKey} toolTipDescription={toolTipDescriptionKey}/>
      </Tab>
      </Tabs>

    </div>

  )
}
