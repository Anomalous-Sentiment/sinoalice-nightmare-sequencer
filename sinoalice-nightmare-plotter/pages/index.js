import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react';
import styles from '../styles/Home.module.css'
import NightmareImageList from './nightmare-image-list'
import { Chart } from "react-google-charts";
import { DateTime } from "luxon";
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Home() {
  const [nightmares, updateNightmares] = useState(null)
  const [selectedNightmares, setSelected] = useState([])
  const columns = [
    { type: "string", id: "nightmare"},
    { type: "string", id: "state"},
    { type: "date", id: "Start" },
    { type: "date", id: "End" },
  ]
  // Get the current time
  const now = DateTime.now().startOf('hour');

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
    }
  };

  const data = [columns, ...placeholderRows];

  if (nightmares == null)
  {
    //Use the backend address here
    fetch("http://localhost:3001/")
    .then(response => response.json())
    .then((json) => {
      updateNightmares(json["nightmares"])
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>SINoALICE Nightmare Plotter</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/alice.ico" />
      </Head>
      <Chart chartType="Timeline" data={data} width="100%" height="400px" options={options}/>
      <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
      <Tab eventKey="all" title="All Nightmares">
        <NightmareImageList list={nightmares}/>
      </Tab>
      <Tab eventKey="buffs" title="Buff Nightmares">
      </Tab>
      <Tab eventKey="fire" title="Fire Nightmares">
      </Tab>
      <Tab eventKey="water" title="Water Nightmares">
      </Tab>
      <Tab eventKey="wind" title="Wind Nightmares">
      </Tab>
      <Tab eventKey="elemental" title="Elemental Nightmares">
      </Tab>
      <Tab eventKey="other" title="Other" disabled>
      </Tab>
      <Tab eventKey="selected" title="Selected Nightmares">
      </Tab>
      </Tabs>
    </div>

  )
}
