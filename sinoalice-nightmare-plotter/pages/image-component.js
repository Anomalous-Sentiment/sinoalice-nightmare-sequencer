import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Fragment, memo, useMemo, useState} from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Image from 'next/image';
import Grid from '@mui/material/Grid';
import styles from '../styles/ImageComponent.module.css'


function ImageComponent(props)
{
    const nightmareImage = useMemo(() => {
        return(
            <Image
            src={props.nightmare[props.displayOptions['icon']]}
            alt={props.nightmare[props.displayOptions['icon']]}
            width='90'
            height='90'
            className={props.nightmare['selected'] ? 'selected' : ''}
        />
        )
    }, [props.nightmare['selected'], props.displayOptions])

    const renderTooltip = useMemo(() => {
        const tooltipFunction = () => {
            return(
                <Tooltip id={props.nightmare[props.displayOptions['name']]}>
                <b>{props.nightmare[props.displayOptions['skill_name']] + ' (' + props.nightmare[props.displayOptions['skill_rank']] + ')'}</b>
                <br/>
                {props.nightmare[props.displayOptions['skill_description']]}
            </Tooltip>
            )
        }

        return tooltipFunction;

    }, [props.nightmare, props.displayOptions])
    
    //The class name for the image list item changes depending on whether the selected value of the nightmare is true or false

    return(
        <Fragment>
            <OverlayTrigger overlay={renderTooltip(props)}>
            <div className={styles.item}
            onClick={() => {
                if (!props.nightmare['selected'])
                {
                    //Update server nightmare state by changing the selected flags
                    props.updateServerNightmares(prevState => {
                        //This passes a function to the setState of the server nightmare list
                        let prevStateCopy = [...prevState];

                        prevStateCopy.forEach(element => {
                            //This will affect non-evolved versions, as well as nightmares with the base skill name
                            if(element['jp_name'] == props.nightmare['jp_name'] || element['jp_colo_skill_name'] == props.nightmare['jp_colo_skill_name'])
                            {
                                element['selected'] = !element['selected']
                            }
                        })
                    
                        // updated state with relevant nightmare selected values changed
                        return prevStateCopy;
                    })
                    
                    //If not selected, add to selected list
                    //Update selected nightmare list
                    props.setSelected(prevState => {
                        //check current nightmare selected status
                        let newState = [...prevState];

                        newState.push(props.nightmare)

                        return newState;
                    })
                    
                }
                else
                {
                    //If nightmare's selected flag is true, it is either in the selected list, or nightmare with same skill
                    //As one in the list
                    props.setSelected(prevState => {
                        let newState = [...prevState];
                        
                        //Check if the nightmare is in the selected list
                        if (prevState.some(element => element['jp_name'] == props.nightmare['jp_name']))
                        {
                            //Nightmare exists in selected list
                            //Update server nightmare state by changing the selected flags
                            props.updateServerNightmares(prevState => {
                                //This passes a function to the setState of the server nightmare list
                                let prevStateCopy = [...prevState];

                                prevStateCopy.forEach(element => {
                                    //This will affect non-evolved versions, as well as nightmares with the base skill name
                                    if(element['jp_name'] == props.nightmare['jp_name'] || element['jp_colo_skill_name'] == props.nightmare['jp_colo_skill_name'])
                                    {
                                        element['selected'] = !element['selected']
                                    }
                                })
                            
                                // updated state with relevant nightmare selected values changed
                                return prevStateCopy;
                            })

                            //Remove from list
                            newState = newState.filter(nightmare => nightmare['jp_name'] != props.nightmare['jp_name'])
                        }
                        else
                        {
                            //Nightmare does not exist in list (It is a nightmare with same skill as one in the list)
                        }

                        return newState;
                    })
                }



            }
        }>
            {nightmareImage}
            </div>
            </OverlayTrigger>


        </Fragment>


    )
}

function areEqual(prevProps, nextProps)
{
    let isEqual = false;

    /*
    // If same jp nightmare name, jp rank, and selected state. They are equal
    if (prevProps.nightmare['jp_name'] === nextProps.nightmare['jp_name'] && prevProps.nightmare['rarity_id'] === nextProps.nightmare['rarity_id'])
    {
        if (prevProps.nightmare['selected'] === nextProps.nightmare['selected'])
        {
            isEqual = true;
        }
    }
*/

    return isEqual;

}

export default memo(ImageComponent, areEqual)