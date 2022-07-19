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
import { Fragment } from 'react';
const supabaseJs = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_CLIENT_KEY;
const supabase = supabaseJs.createClient(supabaseUrl, supabaseKey)

export async function getServerSideProps()
{
  //Array to hold db requests
  const dbRequests = [];
  //Get all nightmares
  const nightmareRequest = supabase
  .from('allnightmaredetails')
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
  .from('pure_colo_skill_names')
  .select()

  dbRequests.push(nightmareRequest, elementRequest, generalTagRequest, majorTagRequest, rarityRequest, pureSkillsRequest);

  console.time('DB Requests Timer')
  //Wait or all concurrent requests to complete and get their returned values
  let [{data: allNightmares}, {data: allAttributes}, {data: generalTags}, {data: majorTags}, {data: allRarities}, {data: pureSkills}] = await Promise.all(dbRequests);
  console.timeEnd('DB Requests Timer')


  //Combine all request data into single json
  let data = {nightmares: allNightmares, attributes: allAttributes, general_tags: generalTags, major_tags: majorTags, rarities: allRarities, base_skills: pureSkills};

  fetch(raw)
  .then(r => r.text())
  .then(text => {
    console.log('text decoded:', text);
  });

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
    <Fragment>
      <Head>
        <title>SINoALICE Nightmare Sequencer</title>
        <meta name="description" content="SINoALICE Nightmare Planning Tool" />
        <link rel="icon" href="/alice.ico" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7393687437464759"
      crossorigin="anonymous"></script>
      </Head>

        <div className={styles.container}>
          <div className={styles.topdiv}>

          </div>
          <div className={styles.inline}>
            <div className={styles.leftpane}>

            </div>
            <div className={styles.maincontent}>
              <div className={styles.header}>
              SINoALICE Nightmare Sequencer
              </div>
              <Provider store={store}>
                <Tabs id='main-tabs' defaultActiveKey="plotter" className="mb-3">
                  <Tab eventKey="plotter" title="Sequencer">
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
                  <Tab eventKey="changelog" title="Changelog">
                    <div className='about'>
                      {changelog}
                    </div>
                  </Tab>
                </Tabs>
              </Provider>
            </div>
            <div className={styles.rightpane}>
            
            </div>
          </div>
          <div className={styles.footer}>

          </div>
        </div>

    </Fragment>

  )
}
