import * as React from 'react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ImageComponent from './image-component';
import FilterBar from './filter-component';
import { useResizeDetector } from 'react-resize-detector';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';


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


    const [imageList, updateImages] = useState(
        <ImageListItem key='0'>
        <Image
          src={`https://sinoalice.game-db.tw/images/img404.png`}
          alt={`Not Found`}
          width='90'
          height='90'
        />
        <ImageListItemBar
          title={`Nightmare Name`}
          subtitle={<span>by: </span>}
          position="below"
        />
      </ImageListItem>
    )

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
          <ImageComponent 
          key={nightmare['jp_name'] + nightmare['jp_rank']} 
          nightmare={nightmare} 
          displayOptions={props.displayOptions} 
          onClick={props.onClick}/>
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
      <ImageList cols={columns}>
        {imageList}
      </ImageList>
    </div>

  );
}
