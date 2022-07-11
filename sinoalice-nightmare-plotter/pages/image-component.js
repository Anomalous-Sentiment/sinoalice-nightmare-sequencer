import { Fragment, memo, useMemo, useState} from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Image from 'next/image';
import styles from '../styles/ImageComponent.module.css'

function ImageComponent(props)
{
    const tooltip = useMemo(() => {
        return (
            <Tooltip id={props.nightmare[props.displayOptions['name']]}>
            <b>{props.nightmare[props.displayOptions['skill_name']] + ' (' + props.nightmare[props.displayOptions['skill_rank']] + ')'}</b>
            <br/>
            {props.nightmare[props.displayOptions['skill_description']]}
        </Tooltip>
        )
    }, [props.nightmare, props.displayOptions])
    
    const nightmareImage = useMemo(() => {
        return(
            <OverlayTrigger overlay={tooltip}>
            <div>
                <Image
                src={props.nightmare[props.displayOptions['icon']]}
                alt={props.nightmare[props.displayOptions['icon']]}
                width='90'
                height='90'
                className={props.nightmare['selected'] ? 'selected': ''}/>
            </div>
        </OverlayTrigger>

        )
    }, [props.nightmare['selected'], props.displayOptions])

    //The class name for the image list item changes depending on whether the selected value of the nightmare is true or false

    return(
        <Fragment>
            {nightmareImage}
        </Fragment>


    )
}

function areEqual(prevProps, nextProps)
{
    let isEqual = false;

    /*
    // If same jp nightmare name, jp rank, and selected state. They are equal
    if (prevProps.nightmare[prevProps.displayOptions['icon']] === nextProps.nightmare[nextProps.displayOptions['icon']])
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