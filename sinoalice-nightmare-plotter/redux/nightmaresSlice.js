import { createSlice } from '@reduxjs/toolkit'

export const nightmareSlice = createSlice({
    name: 'nightmares',
    initialState: {
        nightmaresSelected: [],
        skillsUsed: {}
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

            console.log(state.nightmaresSelected)
            state.skillsUsed[action.payload['jp_colo_skill_name']] = false;


        },
        initialiseSkillStates: (state = initialState, action) => {
            //Initialise every skill state to false
            action.payload.forEach(element => {
                state.skillsUsed[element['jp_colo_skill_name']] = false
            });
        }
    }
})

export const {addNightmare, removeNightmare, initialiseSkillStates} = nightmareSlice.actions;

export const getSelectedNightmares = (state) => {
    return state.nightmares.nightmaresSelected;
};

export default nightmareSlice.reducer;