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
            

            //Add the new nightmare to the existing list (Similar to setState() functions. Need to copy and create new list?)
            state.nightmaresSelected.push(newNightmare)

            state.skillsUsed[action.payload['jp_colo_skill_name']] = true;


        },
        removeNightmare: (state = initialState, action) => {
            //Remove nightmare from list
            state.nightmaresSelected = state.nightmaresSelected.filter(nightmare => nightmare['jp_name'] != action.payload['jp_name'])

            state.skillsUsed[action.payload['jp_colo_skill_name']] = false;


        },
        initialiseSkillStates: (state = initialState, action) => {
            //Initialise every skill state to false
            action.payload.forEach(element => {
                state.skillsUsed[element['jp_colo_skill_name']] = false
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

export const checkSelectable = (state, nightmare) => {
    let canAdd = false;
    let message = '';
    let timeLimit = state.nightmares.coloTime * 60;
    let sum = 0;



    // Check if this nightmare's skill has been chosen already
    let skillUsed = state.nightmares.skillsUsed[nightmare['jp_colo_skill_name']];

    const selected = state.nightmares.nightmaresSelected.some(element => {
        return (element['jp_name'] == nightmare['jp_name'] && element['rarity_id'] == nightmare['rarity_id'])
    })

    // If undefined, it is because the base skills havven't been initialised yet. 
    // As this only happens on the first render, this means that no skills must be selected yet so must be false
    if (skillUsed == undefined)
    {
        skillUsed = false;
    }
    //Sum total nightmare time (prep + effective + delays)
    state.nightmares.nightmaresSelected.forEach(element => {
        sum = sum + element['prep_time'] + element['effective_time']
    });

    if (!selected && !skillUsed)
    {
        //Unselected and skill type not used

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

export default nightmareSlice.reducer;