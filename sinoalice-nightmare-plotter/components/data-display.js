import { Chart } from "react-google-charts";

export default function Statistics(props)
{
    const selectedNms = props.nightmares;

    // Calculate elemental composition (Only include elemental buffs)
    const fireNms = selectedNms.filter(nightmare => nightmare['applied_tags'].includes('Fire Bell') || nightmare['applied_tags'].includes('Fire Buff'))
    const waterNms = selectedNms.filter(nightmare => nightmare['applied_tags'].includes('Water Bell') || nightmare['applied_tags'].includes('Water Buff'))
    const windNms = selectedNms.filter(nightmare => nightmare['applied_tags'].includes('Wind Bell') || nightmare['applied_tags'].includes('Wind Buff'))
    let fireTime = 0;
    let waterTime = 0;
    let windTime = 0;

    //Sum the effective time of the fire buff nms
    fireNms.forEach(nightmare => {
        fireTime = fireTime + nightmare['effective_time']
    });

    //Sum the effective time of the fire buff nms
    waterNms.forEach(nightmare => {
        waterTime = waterTime + nightmare['effective_time']
    });

    //Sum the effective time of the fire buff nms
    windNms.forEach(nightmare => {
        windTime = windTime + nightmare['effective_time']
    });

    // Calculate prep vs effective time (Sum total prep times and effective times)
    let totalPrepTime = 0;
    let totalEffectiveTime = 0;

    selectedNms.forEach(nightmare => {
        totalPrepTime = totalPrepTime + nightmare['prep_time']
        totalEffectiveTime = totalEffectiveTime + nightmare['effective_time']
    });


    const elementalData = [
        ['Effective Elemental Time', 'Time in seconds'],
        ['Effective Fire Elemental Time', fireTime],
        ['Effective Water Elemental Time', waterTime],
        ['Effective Wind Elemental Time', windTime]
    ]

    const prepVsEffectData = [
        ['Preparation Time vs Effective Time', 'Time in seconds'],
        ['Total Nightmare Prep Time', totalPrepTime],
        ['Total Nightmare Effective Time', totalEffectiveTime]
    ]

    const elementalOptions = {
        title: 'Elemental Time',
        backgroundColor: '#e8e8e8',
        colors: ['#ff0000', '#2e29cd', '#27bb1f'],
        chartArea: {
            width: '50%',
            height: '100%'
        }
    }

    const timeOptions = {
        title: 'Preparation Time vs Effective Time',
        backgroundColor: '#e8e8e8',
        chartArea: {
            width: '50%',
            height: '100%'
        }
    }
    // Calculate nightmare category composition??
    return(
        <div>
            {props.nightmares.length > 0 &&
            <div>
                <Chart
                chartType="PieChart"
                data={elementalData}
                options={elementalOptions}
                width={"100%"}
                height={"200px"}
                />
                    <Chart
                chartType="PieChart"
                data={prepVsEffectData}
                options={timeOptions}
                width={"100%"}
                height={"200px"}
                />
            </div>

            }
        </div>
    )
}