import { Chart } from "react-google-charts";
import Table from 'react-bootstrap/Table';
import { getColoTime, getSelectedNightmares } from '../redux/nightmaresSlice';
import { useSelector } from "react-redux";

export default function Statistics(props)
{
    const coloTime = useSelector(getColoTime)
    const selectedNms = useSelector(getSelectedNightmares);

    const fireNms = selectedNms.filter(nightmare => nightmare['applied_tags'].includes('Fire Bell') || nightmare['applied_tags'].includes('Fire Buff'))
    const waterNms = selectedNms.filter(nightmare => nightmare['applied_tags'].includes('Water Bell') || nightmare['applied_tags'].includes('Water Buff'))
    const windNms = selectedNms.filter(nightmare => nightmare['applied_tags'].includes('Wind Bell') || nightmare['applied_tags'].includes('Wind Buff'))
    
    let fireTime = 0;
    let waterTime = 0;
    let windTime = 0;
    let firePrep = 0;
    let waterPrep = 0;
    let windPrep = 0;

    // Calculate prep vs effective time (Sum total prep times and effective times)
    let totalPrepTime = 0;
    let totalEffectiveTime = 0;
    let currentTime = 0;

    selectedNms.forEach((nightmare, index, array) => {
        let nmPrepTime = nightmare['prep_time'];
        let nmActiveTime = nightmare['effective_time']

        if (index > 0 && array[index - 1]['jp_colo_skill_name'] == '紫煙ハ瞬刻ヲ告ゲル')
        {
            //If previous nm skill was "Haze heralds the moment", set this nm prep time to 5 secs
            nmPrepTime = 5;
        }
        
        if (currentTime + nmPrepTime + nightmare['delay'] > coloTime * 60)
        {
            let differenceFromLimit = currentTime + nightmare['delay']
            nmPrepTime = (coloTime * 60) - differenceFromLimit;

            //Prep time already over limit, so there is no effective active time
            nmActiveTime = 0;
        }
        else if (currentTime + nmPrepTime + nmActiveTime + nightmare['delay'] > coloTime * 60)
        {
            let differenceFromLimit = currentTime + nmPrepTime + nightmare['delay']
            nmActiveTime = (coloTime * 60) - differenceFromLimit;

        }


        if (nightmare['applied_tags'].includes('Fire Bell') || nightmare['applied_tags'].includes('Fire Buff'))
        {
            //Fire buff nm
            fireTime = fireTime + nmActiveTime
            firePrep = firePrep + nmPrepTime
        }
        else if (nightmare['applied_tags'].includes('Water Bell') || nightmare['applied_tags'].includes('Water Buff'))
        {
            // Water buff nm
            waterTime = waterTime + nmActiveTime
            waterPrep = waterPrep + nmPrepTime
        }
        else if (nightmare['applied_tags'].includes('Wind Bell') || nightmare['applied_tags'].includes('Wind Buff'))
        {
            //Wind buff nm
            windTime = windTime + nmActiveTime
            windPrep = windPrep + nmPrepTime
        }

        //Sum total prep and effective times regardless of nm type
        totalPrepTime = totalPrepTime + nmPrepTime
        totalEffectiveTime = totalEffectiveTime + nmActiveTime
        currentTime = currentTime + nmPrepTime + nmActiveTime + nightmare['delay']
    })

    let totalDelayTime = (coloTime * 60) - (totalPrepTime + totalEffectiveTime);



    const elementalData = [
        ['Effective Elemental Time', 'Time in seconds'],
        ['Effective Fire Elemental Time', fireTime],
        ['Effective Water Elemental Time', waterTime],
        ['Effective Wind Elemental Time', windTime]
    ]

    const prepVsEffectData = [
        ['Preparation Time vs Effective Time', 'Time in seconds'],
        ['Total Nightmare Prep Time', totalPrepTime],
        ['Total Nightmare Effective Time', totalEffectiveTime],
        ['Total Delay/Unused Time', totalDelayTime]
    ]

    const elementalOptions = {
        title: 'Elemental Time',
        backgroundColor: '#e8e8e8',
        colors: ['#ff0000', '#2e29cd', '#27bb1f'],
        chartArea: {
            width: '100%',
            height: '100%'
        }
    }

    const timeOptions = {
        title: 'Preparation Time vs Effective Time',
        backgroundColor: '#e8e8e8',
        chartArea: {
            width: '100%',
            height: '100%'
        }
    }
    // Calculate nightmare category composition??
    return(
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Times</th>
                    <th>Total Time (sec)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>Total Preparation Time</td>
                    <td>{totalPrepTime}</td>
                    </tr>
                    <tr>
                    <td>Total Effective Time</td>
                    <td>{totalEffectiveTime}</td>
                    </tr>
                    <tr>
                    <td>Total Delay/Unused Time</td>
                    <td>{totalDelayTime}</td>
                    </tr>
                </tbody>
            </Table>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Elemental Type</th>
                    <th>Number of Nightmares</th>
                    <th>Total Preparation Time (sec)</th>
                    <th>Total Effective Time (sec)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>Fire Elementals (Including bells)</td>
                    <td>{fireNms.length}</td>
                    <td>{firePrep}</td>
                    <td>{fireTime}</td>
                    </tr>
                    <tr>
                    <td>Water Elementals (Including bells)</td>
                    <td>{waterNms.length}</td>
                    <td>{waterPrep}</td>
                    <td>{waterTime}</td>
                    </tr>
                    <tr>
                    <td>Wind Elementals (including bells)</td>
                    <td>{windNms.length}</td>
                    <td>{windPrep}</td>
                    <td>{windTime}</td>
                    </tr>
                </tbody>
            </Table>
            {props.nightmares.length > 0 &&
            <div>
                <div className="inline">
                <Chart
                chartType="PieChart"
                data={prepVsEffectData}
                options={timeOptions}
                width={"100%"}
                height={"300px"}
                />
                
                <Chart
                chartType="PieChart"
                data={elementalData}
                options={elementalOptions}
                width={"100%"}
                height={"300px"}
                />
                </div>

            </div>

            }
        </div>
    )
}