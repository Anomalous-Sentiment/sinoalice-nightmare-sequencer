import * as React from 'react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ImageComponent from './image-component';
import FilterBar from './filter-component';
import { useResizeDetector } from 'react-resize-detector';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/ImageComponent.module.css'


export default function NightmareImageList(props) {
    const [columns, setColumns] = useState(2);
    const [appliedFilterList, setFilters] = useState([]);
    const {width, height, ref} = useResizeDetector()
    const [dimensions, setDimensions] = useState({
      height: 0,
      width: 0
    });
    const [sortByList, setSortOptions] = useState(
      [
        <Dropdown.Item key='0' eventKey="0">Rarity (Low to High)</Dropdown.Item>,
        <Dropdown.Item key='1' eventKey="1">Rarity (High to Low)</Dropdown.Item>,
        <Dropdown.Item key='2' eventKey="2">Element</Dropdown.Item>,
        <Dropdown.Item key='3' eventKey="3">Default</Dropdown.Item>
      ]
    )

    function lowToHighRarity(a, b) {return a['rarity_id'] - b['rarity_id']};
    function highToLowRarity(a, b) {return b['rarity_id'] - a['rarity_id']};
    function element(a, b) {return a['attribute_id'] - b['attribute_id']};
    function defaultOrder(a, b) {return 0};

    function onSortingSelect(eventKey, event)
    {
      const sortingId = parseInt(eventKey);
      
      //Save  sorter in state (for maintaining sorting when image list is re-rendered)
      setSorter(sortingFunctions[sortingId])
    }

    const sortingFunctions = [
        ['Sorting By: Low to High rarity', lowToHighRarity],
        ['Sorting By: High to Low rarity', highToLowRarity],
        ['Sorting by: Element', element],
        ['Sorting by: Default', defaultOrder]
    ]

    //Default sorter is default sorting
    const [sorter, setSorter] = useState(sortingFunctions[3]);


    const [imageList, updateImages] = useState()

    function mapNightmaresToComponents (list)
    {
      //Apply filters to updated list
      let newList = applyFilters(list)

      //Apply sorting to filtereed list if selected
      console.log(sorter)
      newList = newList.sort(sorter[1])
    

      //Map list elements to components
      newList = newList.map((nightmare, index, arr) => {
    
        return (
          <div key={nightmare[props.displayOptions['icon']]} className={styles.item}
          onClick={() => {
              if (!nightmare['selected'])
              {
                  //Update server nightmare state by changing the selected flags
                  props.updateServerNightmares(prevState => {
                      //This passes a function to the setState of the server nightmare list
                      let prevStateCopy = [...prevState];

                      prevStateCopy.forEach(element => {
                          //This will affect non-evolved versions, as well as nightmares with the base skill name
                          if(element['jp_name'] == nightmare['jp_name'] || element['jp_colo_skill_name'] == nightmare['jp_colo_skill_name'])
                          {
                              element['selected'] = !element['selected']
                          }
                      })
                  
                      // updated state with relevant nightmare selected values changed
                      return prevStateCopy;
                  })
                  
                  //If not selected, add to selected list
                  //Update selected nightmare list
                  props.setSelected(prevState => {
                      //check current nightmare selected status
                      let newState = [...prevState];

                      newState.push(nightmare)

                      return newState;
                  })
                  
              }
              else
              {
                  //If nightmare's selected flag is true, it is either in the selected list, or nightmare with same skill
                  //As one in the list
                  props.setSelected(prevState => {
                      let newState = [...prevState];
                      
                      //Check if the nightmare is in the selected list
                      if (prevState.some(element => element['jp_name'] == nightmare['jp_name']))
                      {
                          //Nightmare exists in selected list
                          //Update server nightmare state by changing the selected flags
                          props.updateServerNightmares(prevState => {
                              //This passes a function to the setState of the server nightmare list
                              let prevStateCopy = [...prevState];

                              prevStateCopy.forEach(element => {
                                  //This will affect non-evolved versions, as well as nightmares with the base skill name
                                  if(element['jp_name'] == nightmare['jp_name'] || element['jp_colo_skill_name'] == nightmare['jp_colo_skill_name'])
                                  {
                                      element['selected'] = !element['selected']
                                  }
                              })
                          
                              // updated state with relevant nightmare selected values changed
                              return prevStateCopy;
                          })

                          //Remove from list
                          newState = newState.filter(nightmare => nightmare['jp_name'] != nightmare['jp_name'])
                      }
                      else
                      {
                          //Nightmare does not exist in list (It is a nightmare with same skill as one in the list)
                      }

                      return newState;
                  })
              }



          }
      }>
          <ImageComponent 
          key={nightmare[props.displayOptions['icon']]} 
          nightmare={nightmare} 
          displayOptions={props.displayOptions} 
          />
          </div>
        )
    
      })
    
      updateImages(newList);
    }

    function applyFilters(list)
    {
      //filter the nightmare list and update image list based on filtered nightmares
      const filteredNms = list.filter(nm => appliedFilterList.every(filterTag => nm['applied_tags'].includes(filterTag)))

      return filteredNms;
    }

    //Function for updating the image grid size based on window dimensions
    useEffect(() => {
      if (dimensions.width != 0)
      {
        console.log('dim: ', dimensions)
        setColumns(parseInt(dimensions.width / 90) - 1)

      }
    }, [dimensions])

    function updateDimensions()
    {
      if (width)
      {
        console.log('div height (tab?): ', parseInt(height))
        console.log('div width: ', parseInt(width))
        setDimensions({
          height: parseInt(height),
          width: parseInt(width)
        })
      }

    }

    //Run after render
    useEffect(() => {
      updateDimensions()
    }, [width])

    function changeFilters(newList)
    {
      console.log(newList)
      //Update the filter list
      setFilters(newList)
    }

    //Effect to run when filter list updated, list changed or sorting function changed
    useEffect(() => {
      if (props.list)
      {
        mapNightmaresToComponents(props.list)
      }
    }, [props.list, appliedFilterList, sorter])

  return (
    <div ref={ref}>
      <FilterBar filterList={props.filterList}
      handleChange={changeFilters}>
      </FilterBar>
      <DropdownButton 
      id="dropdown-basic-button" 
      title={sorter[0]}
      menuVariant='dark'
      onSelect={onSortingSelect}>
        {sortByList}
      </DropdownButton>
      <div className={styles.grid}>
        {imageList}
      </div>
    </div>

  );
}
