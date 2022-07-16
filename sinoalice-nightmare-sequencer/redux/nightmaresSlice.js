import { createSlice } from '@reduxjs/toolkit'

export const nightmareSlice = createSlice({
    name: 'nightmares',
    initialState: {
        nightmaresSelected: [],
        skillsUsed: {},
        coloTime: 20
    },
    reducers: {
        addNightmare: (state = initialState, action) => {

            //Add the new nightmare to the existing list (Similar to setState() functions. Need to copy and create new list?)
            state.nightmaresSelected.push(action.payload)

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
        }   
    }
})

export const {addNightmare, removeNightmare, initialiseSkillStates, updateColoTime, clearSelected} = nightmareSlice.actions;

export const getSelectedNightmares = (state) => {
    return state.nightmares.nightmaresSelected;
};

export const getColoTime = (state) => {
    return state.nightmares.coloTime;
};

export default nightmareSlice.reducer;