import { useState, useEffect, useRef } from 'react';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Form from 'react-bootstrap/Form';
import FormCheck from 'react-bootstrap/FormCheck';
//import FormCheck from 'react-bootstrap/FormCheck';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function FilterBar(props) {

    const [filterButtons, setButtons] = useState();
    const [appliedFilters, setFilters] = useState([])

    const filtersRef = useRef();
    filtersRef.current = appliedFilters;


    function handleChange(event)
    {
        //Copy filter list
        let newFilterListState = [...filtersRef.current];

        if (event.target.checked == true)
        {
            //Add to filter list
            newFilterListState.push(event.target.value)
        }
        else
        {
            // Remove from filter list
            newFilterListState = newFilterListState.filter(element => element != event.target.value)
        }

        setFilters(newFilterListState)

        props.handleChange(newFilterListState)
    }
    //useEffect function to update filter buttons when the tag list changes


    //Run when props.filterList changes
    useEffect(() => {
        //Check if not null
        if (props.filterList)
        {
            let newFilters = {};

            //For each tag in the list, create a button and map a callback so that when clicked, will add/remove the tag from the list
            const filterList = props.filterList.map(filterValue => {
                //Set default state
                newFilters[filterValue] = false;
                return (
                    <Form.Check 
                    type="switch"
                    key={filterValue}
                    id={filterValue}
                    label={filterValue}
                    value={filterValue}
                    onChange={handleChange}
                     />
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
            <Form>
                {filterButtons}
            </Form>
        </div>

        }

    </div>
    )
}