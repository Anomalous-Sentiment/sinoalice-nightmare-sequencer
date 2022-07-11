import { useEffect, useState } from 'react';
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
  const [jsonData, setJsonData] = useState();
  const [serverNightmares, updateServerNightmares] = useState([])
  const [globalNightmares, updateGlobalNightmares] = useState([])
  const [jpnightmares, updateJpNightmares] = useState([])
  const [selectedNightmares, setSelected] = useState([])
  const [globalOnly, setGlobalServer] = useState()
  const [generalCategoryTabs, setCategoryTabs] = useState([])
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
  
  const options = {
    colors : ["blue", "red"],
    hAxis: {
      format: 'mm:ss',
      maxValue: now.plus({minutes: 20}).toJSDate(),
      minValue: now.toJSDate()
    },
  };

  const [data, setData] = useState([columns, ...timelineRows]);

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

  //Hook to populate tabs when nightmares are retrieved
  useEffect(() => {
    if (jsonData && serverNightmares)
    {
      
      //Get all major categories and generate tabs for each category
      const tabList = jsonData['general_tags'].map((jsonObj, index, array) => {
        const generalTagName = jsonObj['general_tag'];
        const majorTagsList = jsonData['major_tags'].filter(element => element['general_tag'] == generalTagName);

        return(
          <Tab key={jsonObj['general_tag_id']} eventKey={generalTagName} title={generalTagName}>
            <SubTabs tabNightmares={serverNightmares ? serverNightmares.filter(nm => nm['general_tags'].includes(generalTagName)) : null}
            displayOptions={displayOptions}
            mainCategories={majorTagsList}
            setSelected={setSelected}
            updateServerNightmares={updateServerNightmares}>
            </SubTabs>
          </Tab>

        )
      })

      //Set the tabs
      setCategoryTabs(tabList);
      
    }

  }, [jsonData, serverNightmares])

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

  //Hook to update timeline when selected nightmares change
  useEffect(() => {
    let newRows = [...shinmaTimes];


    // Recalculate timeline times according to modified selected nightmares list
    selectedNightmares.forEach((nightmare, index, array) => {
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
    //Update timeline rows
    setTimelineRows(newRows)

    //Update the timeline graph
    setData([columns, ...newRows])

  }, [selectedNightmares])

  function filterByServer(unfilteredNightmares)
  {
    //filter by global nightmares
    updateGlobalNightmares(unfilteredNightmares.filter(nightmare => nightmare['global'] == true))

    //Change global only flag
    setGlobalServer(true)

    //filter by jp nightmares
    updateJpNightmares(unfilteredNightmares)
  }


  return (
    <div>
      <Chart chartType="Timeline" data={data} width="100%" height="400px" options={options}/>

      <ToggleButtonGroup name="servers" size="lg" className="mb-2" type="radio" defaultValue={true} onChange={setGlobalServer}>
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
        displayOptions={displayOptions}
        updateServerNightmares={updateServerNightmares}
        setSelected={setSelected}
        />
      </Tab>
      {generalCategoryTabs}
      <Tab eventKey="other" title="Other">
        <NightmareImageList 
        list={serverNightmares ? serverNightmares.filter(nm => nm['general_tags'].length == 0) : null} 
        displayOptions={displayOptions}
        updateServerNightmares={updateServerNightmares}
        setSelected={setSelected}
        />
      </Tab>
      <Tab eventKey="selected" title="Selected Nightmares">
      <NightmareImageList 
        list={selectedNightmares} 
        displayOptions={displayOptions}
        updateServerNightmares={updateServerNightmares}
        setSelected={setSelected}
        />
      </Tab>
      </Tabs>

    </div>

  )
}
