import { useState, useEffect } from 'react';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function FilterBar(props) {

    const [filterButtons, setButtons] = useState();


    //useEffect function to update filter buttons when the tag list changes


    //Run when props.filterList changes
    useEffect(() => {
        //Check if not null
        if (props.filterList)
        {
            //For each tag in the list, create a button and map a callback so that when clicked, will add/remove the tag from the list
            const filterList = props.filterList.map(filterValue => {
                return (
                    <ToggleButton key={filterValue} id={filterValue} value={filterValue}>
                    {filterValue}
                    </ToggleButton>
                )
            })

            setButtons(filterList);
        }

    }, [props.filterList])

    //This part deserves some explanation. Basically, if props.filterList exists, it will return the expression (a div containing the <p> text and filter buttons)
    // Else, it will not return anything. Used so that the text isn't rendered when there are not filters to display
    return (
    <div>
        {props.filterList && 
        <div>
            <p>Filter buttons (May select multiiple at once):</p>
            <ToggleButtonGroup type="checkbox" defaultValue={[]} className="mb-2" onChange={props.handleChange}>
                {filterButtons}
            </ToggleButtonGroup>
        </div>

        }

    </div>
    )
}