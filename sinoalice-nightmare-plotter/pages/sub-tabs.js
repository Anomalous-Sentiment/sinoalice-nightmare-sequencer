import { useState, useEffect } from 'react';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import NightmareImageList from './nightmare-image-list'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SubTabs(props)
{
    const [mainCategoryTabs, setTabs] = useState();

    //props will have list of nightmares, and list of main categories, and displayOptions object
    useEffect(() => {
        if (props.tabNightmares && props.displayOptions && props.mainCategories)
        {
            //Get list of main categories from props and create a tab for each
            const tabs = props.mainCategories.map(category => {
                //Pass in it's associated list of subcategories/filter options as well.
                //Get it's subcategories/filter options
                const filterOptions = category['sub_tags'];

                return (
                    <Tab key={category['major_tag']} eventKey={category['major_tag']} title={category['major_tag']}>
                        <NightmareImageList list={props.tabNightmares ? props.tabNightmares.filter(nm => nm['major_tags'].includes(category['major_tag'])) : null} 
                        onClick={props.onSelection}
                        displayOptions={props.displayOptions}
                        filterList={filterOptions}
                        />
                    </Tab>
                )
            })
            setTabs(tabs)
            
        }

    }, [props.tabNightmares, props.displayOptions, props.mainCategories])



    return (
        <div>
            <Tabs id="sub-tab" className="mb-3">
            {mainCategoryTabs}
            </Tabs>
        </div>
    )
}