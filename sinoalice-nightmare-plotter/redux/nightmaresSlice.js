import { createSlice } from '@reduxjs/toolkit'

export const nightmareSlice = createSlice({
    name: 'nightmares',
    initialState: {
        nightmaresSelected: [],
        skillsUsed: {}
    },
    reducers: {
        addNightmare: (state = initialState, action) => {
            console.log(state)

            //Add the new nightmare to the existing list (Similar to setState() functions. Need to copy and create new list?)
            state.nightmaresSelected.push(action.payload)

            state.skillsUsed[action.payload['jp_colo_skill_name']] = true;


        },
        removeNightmare: (state = initialState, action) => {
            //Remove nightmare from list
            state.nightmaresSelected = nightmareSelected.filter(nightmare => nightmare['jp_name'] != action.payload['jp_name'] && nightmare['rarity_id'] == action.payload['rarity_id'])

            state.skillsUsed[action.payload['jp_colo_skill_name']] = false;

        }
    }
})

export const {addNightmare, removeNightmare} = nightmareSlice.actions;

export const getSelectedNightmares = (state) => {
    console.log(state)
    console.log(state.nightmares.nightmaresSelected)
    return state.nightmares.nightmaresSelected;
};

export default nightmareSlice.reducer;