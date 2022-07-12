import { useEffect, useState, useMemo, forwardRef } from 'react';
import NightmareImageList from './nightmare-image-list'
import { Chart } from "react-google-charts";
import { DateTime } from "luxon";
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import 'bootstrap/dist/css/bootstrap.min.css';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Accordion from 'react-bootstrap/Accordion';
import { useSelector, useDispatch } from 'react-redux'
import { getSelectedNightmares, initialiseSkillStates } from '../redux/nightmaresSlice'
import PubSub from 'pubsub-js'
import SubTabs from './sub-tabs'
import Statistics from './data-display'

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
  const [errorOpen, setErrorOpen] = useState(true);
  const [successOpen, setSuccessOpen] = useState(true);
  const handleErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorOpen(false);
  };
  const handleSuccessClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessOpen(false);
  };
  const [jsonData, setJsonData] = useState();
  const selectedNightmares = useSelector(getSelectedNightmares);
  const globalNightmares = useMemo(() => {
    if (jsonData)
    {
      return jsonData['nightmares'].filter(nightmare => nightmare['global'] == true);
    }
  }, [jsonData])
  const jpnightmares = useMemo(() => {
    if (jsonData)
    {
      return jsonData['nightmares'];
    }
  }, [jsonData])
  const [globalOnly, setGlobalServer] = useState()
  const [displayOptions, setDisplay] = useState(EN_LANG);
  const serverNightmares = useMemo(() => {
    if (globalOnly)
    {
      setDisplay(EN_LANG);
      return globalNightmares;
    }
    else
    {
      setDisplay(JP_LANG);
      return jpnightmares;
    }
  }, [globalOnly])
  const generalCategoryTabs = useMemo(updateTabs, [jsonData, serverNightmares, displayOptions])

  const dispatch = useDispatch();

  // Get the current time. Useing state only so that it's maintained across re-renders, and so it doesn't get a new time if re-rendering after a day
  const [now, setTime] = useState(DateTime.now().startOf('day'))

  const [errorAlertMsg, setErrorMsg] = useState('');
  const [successAlertMsg, setSuccessMsg] = useState('');

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
  
  const options = {
    colors : ["blue", "red"],
    hAxis: {
      format: 'mm:ss',
      maxValue: now.plus({minutes: 20}).toJSDate(),
      minValue: now.toJSDate()
    },
  };

  const errorListener = function (msg, data) {
    setErrorOpen(true)

    //Set message
    setErrorMsg(data)

  };

  const successListener = function (msg, data) {
    setSuccessOpen(true)

    //Set message
    setSuccessMsg(data)

  };

  //Subscribe every render, and unsubscribe before re-render
  useEffect(() => {
    let errorToken = PubSub.subscribe('ERROR', errorListener);
    let successToken = PubSub.subscribe('SUCCESS', successListener);

    return (() => {
      PubSub.unsubscribe(errorToken);
      PubSub.unsubscribe(successToken);
    });
  })

  const data = useMemo(() => updateTimeline(), [selectedNightmares]);

  //Run only once on first render
  useEffect(() => {

    //Use the backend address here
    fetch("http://localhost:3001/")
    .then(response => response.json())
    .then((json) => {
      setGlobalServer(true)
      setJsonData(json);

      //Initialise selected key field to false (for usage in image list)
      const baseSkills = json['base_skills']
      dispatch(initialiseSkillStates(baseSkills))

    })
    .catch(err => console.log(err));
  }, [])


  //Function to update tabs
  function updateTabs()
  {
    let tabList = [];
    if (jsonData && serverNightmares)
    {
      //Get all major categories and generate tabs for each category
      tabList = jsonData['general_tags'].map((jsonObj, index, array) => {
        const generalTagName = jsonObj['general_tag'];
        const majorTagsList = jsonData['major_tags'].filter(element => element['general_tag'] == generalTagName);

        return(
          <Tab key={jsonObj['general_tag_id']} eventKey={generalTagName} title={generalTagName}>
            <SubTabs tabNightmares={serverNightmares ? serverNightmares.filter(nm => nm['general_tags'].includes(generalTagName)) : null}
            displayOptions={displayOptions}
            mainCategories={majorTagsList}>
            </SubTabs>
          </Tab>

        )
      })
    }

    const finalTabList = () => {
      const allTabs = (
        <Tab key ='all' eventKey="all" title="All Nightmares">
        <NightmareImageList list={serverNightmares} 
        displayOptions={displayOptions}
        type='Render'
        />
      </Tab>
      )
      const otherTab = (
        <Tab key='other' eventKey="other" title="Other">
        <NightmareImageList 
        list={serverNightmares ? serverNightmares.filter(nm => nm['general_tags'].length == 0) : []} 
        displayOptions={displayOptions}
        />
      </Tab>
      )

      const combinedTabList = [allTabs, ...tabList, otherTab];
      return combinedTabList;
    }
    //Set the tabs
    return finalTabList();

  }

  function updateTimeline()
  {
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
        prepRow = [nightmare[displayOptions['name']], "Prep", newRows[newRows.length - 1][3], DateTime.fromJSDate(newRows[newRows.length - 1][3]).plus({ seconds: nightmare[displayOptions['prep_time']] }).toJSDate()]
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


    //Update the timeline graph
    return [columns, ...newRows]

  }



  return (
    <div>
      <Chart chartType="Timeline" data={data} width="100%" height="400px" options={options}/>
      <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Miscellaneous Statistics</Accordion.Header>
        <Accordion.Body>
          <Statistics nightmares={selectedNightmares} />
        </Accordion.Body>
      </Accordion.Item>
      </Accordion>
      <ToggleButtonGroup name="servers" size="lg" className="mb-2" type="radio" defaultValue={true} onChange={setGlobalServer}>
          <ToggleButton id="global" value={true}>
            Global Server
          </ToggleButton>
          <ToggleButton id="japan" value={false}>
            Japan Server
          </ToggleButton>
      </ToggleButtonGroup>

      <Tabs defaultActiveKey="all" id="general-tabs" className="mb-3">
        {generalCategoryTabs}
        <Tab eventKey="selected" title="Selected Nightmares">
          <NightmareImageList 
            list={selectedNightmares} 
            displayOptions={displayOptions}
            />
        </Tab>
      </Tabs>
      <Snackbar
        open={errorOpen}
        autoHideDuration={2000}
        onClose={handleErrorClose}
      >
        <Alert severity="error" sx={{ width: '100%' }}>{errorAlertMsg}</Alert>
      </Snackbar>
      <Snackbar
        open={successOpen}
        autoHideDuration={2000}
        onClose={handleSuccessClose}
      >
        <Alert severity="success" sx={{ width: '100%' }}>{successAlertMsg}</Alert>
      </Snackbar>
    </div>

  )
}