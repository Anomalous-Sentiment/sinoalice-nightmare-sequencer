import { useEffect, useState, useMemo, forwardRef, useRef } from 'react';
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
import { getSelectedNightmares, initialiseSkillStates, updateColoTime, getColoTime, clearSelected, updateDelay } from '../redux/nightmaresSlice'
import { Resizable } from 'react-resizable';
import PubSub from 'pubsub-js'
import SubTabs from './sub-tabs'
import Statistics from './data-display'
import { SUCCESS, ERROR, NORMAL_COLO_TIME_MINS, SPECIAL_COLO_TIME_MINS } from './constants'
import { Button } from 'react-bootstrap';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EN_LANG = {
  icon: 'icon_url',
  name: 'nm_name',
  skill_name: 'skill_name',
  skill_description: 'skill_desc',
  //skill_rank: 'en_rank',
  prep_time: 'prep_time',
  dur_time: 'effective_time'
};

// Same as EN_LANG as they are sompletely separate lists with same key names 
const JP_LANG = {
  icon: 'icon_url',
  name: 'nm_name',
  skill_name: 'skill_name',
  skill_description: 'skill_desc',
  //skill_rank: 'jp_rank',
  prep_time: 'prep_time',
  dur_time: 'effective_time'
};

export default function NightmarePlotter(props) {
  const [delayValue, setDelayValue] = useState(2)
  const [dimensions, setDimensions] = useState({
    height: 400
  });
  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
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

  const jsonData = props.data;
  const selectedNightmares = useSelector(getSelectedNightmares);
  const coloTime = useSelector(getColoTime);
  const globalNightmares = useMemo(() => {
    if (jsonData)
    {
      return jsonData['en_nightmares'];
    }
  }, [jsonData])
  const jpnightmares = useMemo(() => {
    if (jsonData)
    {
      return jsonData['jp_nightmares'];
    }
  }, [jsonData])
  const [globalOnly, setGlobalServer] = useState(true)
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

  const onResize = (event, {element, size, handle}) => {
    setDimensions({width: size.width, height: size.height});
  };

  const dispatch = useDispatch();

  // Get the current time. Useing state only so that it's maintained across re-renders, and so it doesn't get a new time if re-rendering after a day
  const [now, setTime] = useState(DateTime.now().startOf('day'))

  const [errorAlertMsg, setErrorMsg] = useState('');
  const [successAlertMsg, setSuccessMsg] = useState('');

  const columns = [
    { type: "string", id: "nightmare"},
    { type: "string", id: "state"},
    { type: "string", id: "style", role: "style"},
    { type: "date", id: "Start" },
    { type: "date", id: "End" }
  ]


  //Define demon/shinma appearance times
  const shinmaTimes = [
    ['Demon/Shinma', 'Demon 1', 'color: #FFD700', now.plus({minutes: 2}).toJSDate(), now.plus({minutes: 5}).toJSDate()],
    ['Demon/Shinma', 'Demon 2', 'color: #FFD700', now.plus({minutes: 12}).toJSDate(), now.plus({minutes: 15}).toJSDate()]
  ]
  
  const options = {
    hAxis: {
      format: 'mm:ss',
      maxValue: now.plus({minutes: coloTime}).toJSDate(),
      minValue: now.toJSDate()
    },
  };

  function setColoLength(length)
  {
    dispatch(updateColoTime(length))
  }

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
    let errorToken = PubSub.subscribe(ERROR, errorListener);
    let successToken = PubSub.subscribe(SUCCESS, successListener);

    return (() => {
      PubSub.unsubscribe(errorToken);
      PubSub.unsubscribe(successToken);
    });
  })

  const data = useMemo(() => updateTimeline(), [selectedNightmares]);

  //Run only once on first render
  useEffect(() => {
    const baseSkills = jsonData['base_skills']
    dispatch(initialiseSkillStates(baseSkills))
  }, [])

  function convertToImgHtmlTag(imageUrl)
  {
    let img = document.createElement('img');
    img.src = imageUrl;
    img.width = 50;
    img.height = 50;

    return img;
  }


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
      let nmPrepTime = nightmare['prep_time']
      let nmActiveTime = nightmare['effective_time']
      let delay = nightmare['delay']
      let prepStartTime = null;
      let prepEndTime = null;
      let activeStartTime = null;
      let activeEndTime = null;

      if (index == 0)
      {
        //First nightmare in list, start at time 0

        //Convert to luxon time object ot perform calculations
        prepStartTime = now.plus({seconds: delay});
        prepEndTime = prepStartTime.plus({seconds: nmPrepTime});

      }
      else
      {
        if (array[index - 1]['art_unique_id'] == 1134)
        {
          //If previous nm skill was "Haze heralds the moment", set this nm prep time to 5 secs
          nmPrepTime = 5;
        }

        //Convert to luxon time object ot perform calculations
        prepStartTime = DateTime.fromJSDate(newRows[newRows.length - 1][4]).plus({seconds: delay});
        prepEndTime = prepStartTime.plus({seconds: nmPrepTime});

        //Not the first nightmare. calculate time using previous row
      }

      //Check if prep time will exceed time limit
      if (prepEndTime > now.plus({minutes: coloTime}))
      {
        //prep time exceeds colo time limit
        //Set the end time to colo end time
        prepEndTime = now.plus({minutes: coloTime});
      }

      prepRow = [nightmare[displayOptions['name']], "Prep", 'color:  #bababa', prepStartTime.toJSDate(), prepEndTime.toJSDate()]


      //Add prep row to newrows array
      newRows.push(prepRow);

      if (nightmare['effective_time'] != '0')
      {
        activeStartTime = DateTime.fromJSDate(prepRow[4]);
        activeEndTime = activeStartTime.plus({ seconds: nmActiveTime });

        if (activeEndTime > now.plus({minutes: coloTime}))
        {
          //End time exceeds colo limit. Set end time to colo end time
          activeEndTime = now.plus({minutes: coloTime});
        }

        //Add dur row if there is a active duration
        durRow = [nightmare[displayOptions['name']], "Active", 'color: ' + nightmare['active_colour'], activeStartTime.toJSDate(), activeEndTime.toJSDate()]
        newRows.push(durRow)
      }
    })


    //Update the timeline graph
    return [columns, ...newRows]

  }

  function clearNightmares()
  {
    dispatch(clearSelected())
  }

  function updateNightmareDelay(val)
  {
    //regex for checking if string contains only digits
    const re = /^\d+$/;


    if (val != null && val != undefined)
    {
      // if value is not blank, then test the regex
      if (re.test(val)) 
      {
        //Update store with new delay number
        let newDelay = parseInt(val)
        dispatch(updateDelay(newDelay))
      }
      else
      {
        //If empty string, allow box to be empty, but set delay to 0
        dispatch(updateDelay(0))

      }
    }
  }


  
  

  //Only update time after a delay
  useEffect(() => {
    const timeOutId = setTimeout(() => updateNightmareDelay(delayValue), 200);

    return () => clearTimeout(timeOutId);
  }, [delayValue])




  return (
    <div>
      <Resizable height={dimensions.height} onResize={onResize} axis='y' resizeHandles={['se', 's', 'sw']}>
        <div className="box" style={{height: dimensions.height + 'px'}}>
          <Chart chartType="Timeline" data={data} width="100%" height="100%" options={options} />
        </div>
      </Resizable>
      <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Miscellaneous Statistics</Accordion.Header>
        <Accordion.Body>
          <Statistics nightmares={selectedNightmares} />
        </Accordion.Body>
      </Accordion.Item>
      </Accordion>
      <div>
        <ToggleButtonGroup name="servers" size="lg" className="mb-2" type="radio" defaultValue={true} onChange={(value) => {
          clearNightmares()
          setGlobalServer(value)
          }}>
            <ToggleButton id="global" value={true}>
              Global Server
            </ToggleButton>
            <ToggleButton id="japan" value={false}>
              Japan Server
            </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div>
        <ToggleButtonGroup name="colo_type" size="lg" className="mb-2" type="radio" defaultValue={NORMAL_COLO_TIME_MINS} onChange={(newVal) => {
          setColoLength(newVal);
          clearNightmares();
        }}>
            <ToggleButton id="normal" value={NORMAL_COLO_TIME_MINS}>
              Normal Colosseum
            </ToggleButton>
            <ToggleButton id="special" value={SPECIAL_COLO_TIME_MINS}>
              <del>
                Global 2nd Anniversary 40 min ver.
              </del>
            </ToggleButton>
        </ToggleButtonGroup>
        <Button id='clearbtn' size='lg' onClick={() => clearNightmares()}>
          Clear Selected Nightmares
        </Button>
      </div>
      <div>
      <label htmlFor="delaycounter">Seconds to delay next nightmare by:</label>
      <br/>
      <input 
      type="number" 
      id="delaycounter" 
      name="delaycounter"
      min="0" 
      max="60"
      value={delayValue}
      onChange={(e) => {
        console.log('changed')
        setDelayValue(e.target.value)
      }
      }
      />
      </div>


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
