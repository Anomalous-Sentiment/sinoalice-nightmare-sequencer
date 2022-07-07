import { useState, useEffect } from 'react';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SubTabs(props)
{
    //props will have list of nightmares, and list of main categories

    //Get list of main categories from props and create a tab for each
    const tabs = props.mainCategories.map(category => {
        //Pass in it's associated list of subcategories/filter options as well.
        //Get it's subcategories/filter options

        return (
            <Tab eventKey={generalTagName} title={generalTagName}>
                <NightmareImageList list={props.tabNightmares ? props.tabNightmares.filter(nm => nm['general_tags'].includes(generalTagName)) : null} onClick={onSelection} iconKey={iconKey} displayName={displayNameKey} toolTipSkillName={toolTipSkillNameKey} toolTipDescription={toolTipDescriptionKey}/>
            </Tab>
        )
    })

    return (
        <div>
            <Tabs>

            </Tabs>
        </div>
    )
}