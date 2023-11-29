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
import {usageText, developmentText, changelog} from '../text_constants'
const supabaseJs = require('@supabase/supabase-js')
import dynamic from 'next/dynamic';
import Alert from 'react-bootstrap/Alert';
import { useEffect, useState } from 'react';

const GoogleAd = dynamic(() => import('../components/google-ad'), {
  ssr: false,
})

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_CLIENT_KEY;
const supabase = supabaseJs.createClient(supabaseUrl, supabaseKey)

export async function getServerSideProps()
{
  //Array to hold db requests
  const dbRequests = [];
  //Get all nightmares
  const enNightmareRequest = supabase
  .from('allennightmaredetails')
  .select()

  const jpNightmareRequest = supabase
  .from('alljpnightmaredetails')
  .select()

  //Get all element/attributes
  const elementRequest = supabase
  .from('element_attributes')
  .select()

  //Get the general categories
  const generalTagRequest = supabase
  .from('general_major_relationships')
  .select()

  //Get the major categories
  const majorTagRequest = supabase
  .from('major_sub_relationships')
  .select()

  //Get all rarities
  const rarityRequest = supabase
  .from('rarities')
  .select()

  //Get all rarities
  const pureSkillsRequest = supabase
  .from('pure_colo_skills')
  .select()

  dbRequests.push(enNightmareRequest, jpNightmareRequest, elementRequest, generalTagRequest, majorTagRequest, rarityRequest, pureSkillsRequest);

  console.time('DB Requests Timer')
  //Wait or all concurrent requests to complete and get their returned values
  let [{data: enNightmares}, {data: jpNightmares},{data: allAttributes}, {data: generalTags}, {data: majorTags}, {data: allRarities}, {data: pureSkills}] = await Promise.all(dbRequests);
  console.timeEnd('DB Requests Timer')
  //Combine all request data into single json
  let data = {en_nightmares: enNightmares, jp_nightmares: jpNightmares, attributes: allAttributes, general_tags: generalTags, major_tags: majorTags, rarities: allRarities, base_skills: pureSkills};
  return {props: {data}}
}


export default function Home({data}) {
  const [dataAvailable, setAvailable] = useState(false)
  const sinoDbLink = 'https://sinoalice.game-db.tw/nightmares'
  const euceliaPlannerLink = 'https://sinoalicenightmare.herokuapp.com/'
  const deachswordLink = 'https://www.deachsword.com/db/sinoalice/en/carddetail.php'
  const projectGitHubLink = 'https://github.com/Anomalous-Sentiment/sinoalice-nightmare-sequencer'
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
  const deachswordLinkElement = (
    <Link href={deachswordLink} passHref={true}>
    <a>Deachsword Cards</a>
  </Link>
  )

  const projectGitHubLinkElement = (
    <Link href={projectGitHubLink} passHref={true}>
    <a>Project GitHub</a>
  </Link>
  )

  useEffect(() => {
    const availableList = []
    if (data)
    {
      for (const [key, value] of Object.entries(data)) {
        if (!value)
        {
          availableList.push(false)
          // This key-value is missing from the data
          // Set the error alert to show
          setAvailable(false)
        }
        else
        {
          availableList.push(true)
        }
      }

      if (availableList.every(value => value === true))
      {
        setAvailable(true)
      }
    }
  }, [data])

  return (
    <div>
      <Head>
        <title>SINoALICE Nightmare Sequencer</title>
        <meta name="description" content="SINoALICE Nightmare Planning Tool" />
        <link rel="icon" href="/alice.ico" />
      </Head>
        <div className={styles.container}>
          <div className={styles.topdiv}>
            <GoogleAd
              client={process.env.GOOGLE_ADS_ID}
              slot='7556877383'
              display={{display: 'block', width: '100%', height: '90px'}}
              />
          </div>
          <div className={styles.inline}>
            <div className={styles.leftpane}>
              <GoogleAd
              client={process.env.GOOGLE_ADS_ID}
              slot='4021204476'
              display={{display: 'block'}}
              responsiveWidth='true'
              format='auto'
              />
            </div>
            <div className={styles.maincontent}>
              {dataAvailable ? '' : 
              <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>Error</Alert.Heading>
                <p>
                  Failed to get nightmare data. This is likely a database issue. Please let me know if you are seeing this error.
                </p>
              </Alert>}
              <div className={styles.header}>
              SINoALICE Nightmare Sequencer ({projectGitHubLinkElement})
              </div>
              <Provider store={store}>
                <Tabs id='main-tabs' defaultActiveKey="plotter" className="mb-3">
                  <Tab eventKey="plotter" title="Sequencer">
                    {dataAvailable ? <NightmarePlotter data={data}/> : ''}
                    
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
                        <br/>
                        {deachswordLinkElement}
                      </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    </Accordion>
                  </Tab>
                  <Tab eventKey="changelog" title="Changelog">
                    <div className='about'>
                      {changelog}
                    </div>
                  </Tab>
                </Tabs>
              </Provider>
            </div>
            <div className={styles.rightpane}>
              <GoogleAd
                client={process.env.GOOGLE_ADS_ID}
                slot='7866764928'
                display={{display: 'block'}}
                responsiveWidth='true'
                format='auto'
                />
            </div>
          </div>
          <div className={styles.footer}>

          </div>
        </div>
    </div>
  )
}
