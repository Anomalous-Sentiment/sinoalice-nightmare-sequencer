import Head from 'next/head'
import Link from 'next/link';
import styles from '../styles/Home.module.css'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Accordion from 'react-bootstrap/Accordion';
import store from '../redux/store'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css';
import NightmarePlotter from '../components/nightmare-plotter'
import {usageText, developmentText} from '../TEXT_CONSTANTS'

const port = parseInt(process.env.PORT, 10) || 3000

export async function getServerSideProps()
{
      //Use the backend address here
      const res = await fetch(`http://localhost:${port}/api/nightmares`)
      const data = await res.json();
      /*
      .then(response => response.json())
      .then((json) => {
        console.log(json)
        //Initialise selected key field to false (for usage in image list)
        const baseSkills = json['base_skills']
        dispatch(initialiseSkillStates(baseSkills))
  
        setGlobalServer(true)
        return json;
      })
      .catch(err => console.log(err));
      */

      return {props: {data}}
}


export default function Home({data}) {
  const sinoDbLink = 'https://sinoalice.game-db.tw/nightmares'
  const euceliaPlannerLink = 'https://sinoalicenightmare.herokuapp.com/'
  const dbLinkElement = (
  <Link href={sinoDbLink} passHref={true}>
    <a>SINoALICE DB</a>
  </Link>
  )
  const plannerLinkElement = (
    <Link href={euceliaPlannerLink} passHref={true}>
    <a>Nightmare Planner by Eucelia</a>
  </Link>
  )
  return (
    <div className={styles.container}>
    <Head>
      <title>SINoALICE Nightmare Plotter</title>
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/alice.ico" />
    </Head>

    <div className='header'>
      SINoALICE Nightmare Plotter
    </div>

    <Provider store={store}>
      <div className={styles.maincontent}>
        <Tabs id='main-tabs' defaultActiveKey="plotter" className="mb-3">
          <Tab eventKey="plotter" title="Plotter">
            <NightmarePlotter data={data}/>
          </Tab>
          <Tab eventKey="about" title="About">
            <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Usage and Features</Accordion.Header>
              <Accordion.Body>
                <div className='about'>{usageText}</div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Development Story</Accordion.Header>
              <Accordion.Body>
              <div className='about'>
                {developmentText}
                <br/>
                <br/>
                Related:
                <br/>
                {plannerLinkElement}
                <br/>
                {dbLinkElement}
              </div>
              </Accordion.Body>
            </Accordion.Item>
            </Accordion>
          </Tab>
        </Tabs>
      </div>
    </Provider>


    </div>
  )
}
