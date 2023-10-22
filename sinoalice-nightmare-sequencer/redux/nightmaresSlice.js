import { createSlice } from '@reduxjs/toolkit'

export const nightmareSlice = createSlice({
    name: 'nightmares',
    initialState: {
        nightmaresSelected: [],
        skillsUsed: {},
        coloTime: 20,
        delay: 2
    },
    reducers: {
        addNightmare: (state = initialState, action) => {
            //Add the current delay value to the nightmare object
            let newNightmare = structuredClone(action.payload);
            newNightmare['delay'] = state.delay;

            /*
            //Not feasible because if chim is removed, prep time won't be able to update
            //Check if not first nightmare, and if previous nightmare skill was haze heralds the moment
            if (state.nightmaresSelected.length > 1 && state.nightmaresSelected[state.nightmaresSelected.length - 1]['jp_colo_skill_name'] == '紫煙ハ瞬刻ヲ告ゲル')
            {
                //If previous nm skill was "Haze heralds the moment", set this nm prep time to 5 secs
                newNightmare['prep_time'] = 5;
            }
            */
            

            //Add the new nightmare to the existing list (Similar to setState() functions. Need to copy and create new list?)
            state.nightmaresSelected.push(newNightmare)

            //Set the used state to true
            state.skillsUsed[getSkillIdentifier(newNightmare)] = true;

        },
        removeNightmare: (state = initialState, action) => {
            //Remove nightmare from list
            state.nightmaresSelected = state.nightmaresSelected.filter(nightmare => nightmare['card_mst_id'] != action.payload['card_mst_id'])

            //Set the used state to false
            state.skillsUsed[getSkillIdentifier(action.payload)] = false

        },
        initialiseSkillStates: (state = initialState, action) => {
            //Initialise every skill state to false
            action.payload.forEach(element => {
                state.skillsUsed[getSkillIdentifier(element)] = false
            });
        },
        updateColoTime: (state = initialState, action) => {
            state.coloTime = action.payload;
        },
        clearSelected: (state = initialState, action) => {
            //Clear selected nightmares
            state.nightmaresSelected = [];

            //Get list of keys (skill names)
            let keys = Object.keys(state.skillsUsed);

            //Set every skill to false
            keys.forEach(skill => state.skillsUsed[skill] = false)
        },
        updateDelay: (state = initialState, action) =>
        {
            //Replace old delay with new one from payload (Assuming that new value is validated)
            state.delay = action.payload;
        }

    }
})

export const {addNightmare, removeNightmare, initialiseSkillStates, updateColoTime, clearSelected, updateDelay} = nightmareSlice.actions;

export const getSelectedNightmares = (state) => {
    return state.nightmares.nightmaresSelected;
};

export const getColoTime = (state) => {
    return state.nightmares.coloTime;
};

export const checkUnderLimit = (state) => {
    let underLimit = false;
    let sum = 0;
    let timeLimit = state.nightmares.coloTime * 60;

    //Sum total nightmare time (prep + effective + delays)
    state.nightmares.nightmaresSelected.forEach((element, index) => {
        if (index > 0 && state.nightmares.nightmaresSelected[index - 1]['jp_colo_skill_name'] == '紫煙ハ瞬刻ヲ告ゲル')
        {
            //If previous nightmare skill was haze heralds the moment, set prep time to 5
            sum = sum + 5 + element['effective_time'] + element['delay'];
        }
        else
        {
            sum = sum + element['prep_time'] + element['effective_time'] + element['delay'];
        }
    });

    sum = sum + state.nightmares.delay;

    if (sum < timeLimit)
    {
        underLimit = true;
    }


    return underLimit;
};


export const checkSelectable = (state, nightmare) => {
    let canAdd = false;
    let message = '';

    let skillIdentifier= getSkillIdentifier(nightmare)


    // Check if this nightmare's skill has been chosen already
    let skillUsed = state.nightmares.skillsUsed[skillIdentifier];

    const selected = state.nightmares.nightmaresSelected.some(element => {
        return (element['card_mst_id'] == nightmare['card_mst_id'])
    })

    // If undefined, it is because the base skills havven't been initialised yet. 
    // As this only happens on the first render, this means that no skills must be selected yet so must be false
    if (skillUsed == undefined)
    {
        skillUsed = false;
    }


    if (!selected && !skillUsed)
    {
        //Unselected and skill type not used
        //If not selected nightmare and below time limit
        message = 'Nightmare can be added.'
        canAdd = true;
            /*
        if (sum < timeLimit)
        {
            //If not selected nightmare and below time limit
            message = 'Nightmare can be added.'
            canAdd = true;
        }
        else
        {
            //Above time limit. Send error message
            message = 'Unable to add. Exceeds colosseum time limit.'
            canAdd = false;
        }
        */
    }
    else if (skillUsed && selected)
    {
        //Skill used and selected

        //Unable to add. Already in selected nightmares list
        message = 'Nightmare already added'
        canAdd = false;
    }
    else if (skillUsed && !selected)
    {
        //Skill used but not selected

        //Unable to add. Nightmare with same type of skill already in list
        message = 'Nightmare with same skill already selected!'
        canAdd = false;
    }
    

    //Return results as an object
    return {canAdd: canAdd, message: message}
};

export const checkRemovable = (state, nightmare) => {
    const selected = state.nightmares.nightmaresSelected.some(element => {
        return (element['jp_name'] == nightmare['jp_name'] && element['rarity_id'] == nightmare['rarity_id'])
    })

    return selected;
};

const getSkillIdentifier = (nightmare) => 
{
    if (nightmare['skill_type'] != 'unique')
    {
        //If skill is part of a catgegory
        return nightmare['skill_type']
    }
    else
    {
        //If skill is unique
        return nightmare['art_unique_id']
    }
}

export default nightmareSlice.reducer;