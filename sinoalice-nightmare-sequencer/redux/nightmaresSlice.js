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

export const getDelay = (state) => {
    return state.nightmares.delay;
};

export default nightmareSlice.reducer;