import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Fragment, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Image from 'next/image';

export default function ImageComponent(props)
{
    //Create a state for the image to show whether it is selected or not.
    const [selected, setSelected] = useState(false);

    function onClick(nm)
    {
        setSelected(!selected)
        props.onClick(nm)
    }

    const renderTooltip = (props) => {
        return(
            <Tooltip id={props.nightmare[props.displayOptions['name']]}>
            <b>{props.nightmare[props.displayOptions['skill_name']] + ' (' + props.nightmare[props.displayOptions['skill_rank']] + ')'}</b>
            <br/>
            {props.nightmare[props.displayOptions['skill_description']]}
        </Tooltip>
        )
    }

    //The class name for the image list item changes depending on whether the selected value of the nightmare is true or false

    return(
        <Fragment>
            <OverlayTrigger overlay={renderTooltip(props)}>
                <ImageListItem onClick={() => onClick(props.nightmare)} sx={{ width: 90, height: 90 }} className={props.nightmare['selected'] ? 'selected' : ''}>
                <Image
                    src={props.nightmare[props.displayOptions['icon']]}
                    alt={props.nightmare[props.displayOptions['icon']]}
                    width='90'
                    height='90'
                />
                <ImageListItemBar
                    title={props.nightmare[props.displayOptions['name']]}
                    position="below"
                />
                </ImageListItem> 
            </OverlayTrigger>
        </Fragment>


    )
}