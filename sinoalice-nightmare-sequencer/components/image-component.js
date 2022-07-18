import { Fragment, memo, useMemo } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux'
import { addNightmare, removeNightmare, checkSelectable, checkRemovable, checkUnderLimit} from '../redux/nightmaresSlice'
import Figure from 'react-bootstrap/Figure';
import styles from '../styles/ImageComponent.module.css'
import PubSub from 'pubsub-js'
import { SUCCESS, ERROR } from './constants'
function ImageComponent(props)
{

    const dispatch = useDispatch()
    // Check if this nightmare's skill has been chosen already
    const {canAdd: selectable, message: message} = useSelector((state) => checkSelectable(state, props.nightmare), (a, b) => {
        let same = false;

        if (a['canAdd'] === b['canAdd'] && a['message'] === b['message'])
        {
            same = true
        }
        return same;
    })
    const removable = useSelector((state) => checkRemovable(state, props.nightmare), (a, b) => {
        let same = false;

        if (a === b)
        {
            same = true
        }
        return same;
    })

    const underLimit = useSelector(checkUnderLimit, (a, b) => a == b);

    const tooltip = useMemo(() => {
        return (
            <Tooltip id={props.nightmare[props.displayOptions['name']]}>
            <b>{props.nightmare[props.displayOptions['skill_name']] + ' (' + props.nightmare[props.displayOptions['skill_rank']] + ')'}</b>
            <br/>
            {props.nightmare[props.displayOptions['skill_description']]}
        </Tooltip>
        )
    }, [props.nightmare['jp_name'], props.displayOptions])

    
    const nightmareImage = useMemo(() => {
        //The class name for the image list item changes depending on whether the selected value of the nightmare is true or false
        return(
            <OverlayTrigger overlay={tooltip}>
             <div className={styles.item}>
                <Figure>
                <Figure.Image
                src={props.nightmare[props.displayOptions['icon']]}
                alt={props.nightmare[props.displayOptions['icon']]}
                width='90'
                height='90'
                className={selectable ? '': 'selected'}
                onClick={onClick}/>
                <Figure.Caption>
                    {props.nightmare[props.displayOptions['name']]}
                </Figure.Caption>
                </Figure>
            </div>
        </OverlayTrigger>

        )
    }, [selectable, props.displayOptions, underLimit])

    //Function to update nightmare list depending on state
    function onClick()
    {
        if (selectable)
        {
            //Selectable. Add nightmare to selected list
            //dispatch(addNightmare(props.nightmare))
            //PubSub.publish(SUCCESS, 'Nightmare added!');
            console.log('under', underLimit)
            if (underLimit == true)
            {
                console.log(underLimit)
                //Selectable. Add nightmare to selected list
                dispatch(addNightmare(props.nightmare))
                PubSub.publish(SUCCESS, 'Nightmare added!');
            }
            else
            {
                //Over time limit
                PubSub.publish(ERROR, 'Cannot add nightmare. Exceeds time limit.');
            }
            

        }
        else if (removable)
        {
            //Removable. Remove and show message
            dispatch(removeNightmare(props.nightmare))
            PubSub.publish(SUCCESS, 'Nightmare removed!');

        }
        else
        {
            //Not selectable or removable. Display reason
            PubSub.publish(ERROR, message);

        }
    }


    return(
        <Fragment>
            {nightmareImage}
        </Fragment>
    )
}

function areEqual(prevProps, nextProps)
{
    let isEqual = false;

    

    return isEqual;

}

export default memo(ImageComponent, areEqual)