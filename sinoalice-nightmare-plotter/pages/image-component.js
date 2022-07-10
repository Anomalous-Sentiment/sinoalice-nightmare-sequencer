import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Fragment, memo } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Image from 'next/image';
import Grid from '@mui/material/Grid';


function ImageComponent(props)
{
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
            <Grid item>
                <Image
                        src={props.nightmare[props.displayOptions['icon']]}
                        alt={props.nightmare[props.displayOptions['icon']]}
                        width='90'
                        height='90'
                        onClick={() => props.onClick(props.nightmare)}
                        className={props.nightmare['selected'] ? 'selected' : ''}
                    />
            </Grid>

            </OverlayTrigger>
        </Fragment>


    )
}

function areEqual(prevProps, nextProps)
{
    let isEqual = false;

    // If same jp nightmare name, jp rank, and selected state. They are equal
    if (prevProps.nightmare['jp_name'] === nextProps.nightmare['jp_name'] && prevProps.nightmare['rarity_id'] === nextProps.nightmare['rarity_id'])
    {
        if (prevProps.nightmare['selected'] === nextProps.nightmare['selected'] && prevProps.onClick === nextProps.onClick)
        {
            isEqual = true;
        }
    }


    return isEqual;

}

export default memo(ImageComponent, areEqual)