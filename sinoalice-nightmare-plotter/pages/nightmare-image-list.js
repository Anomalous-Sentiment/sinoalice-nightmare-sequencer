import * as React from 'react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ImageComponent from './image-component';
import FilterBar from './filter-component';
import { useResizeDetector } from 'react-resize-detector';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function NightmareImageList(props) {
  const [nightmareList, setList] = useState()
    const [columns, setColumns] = useState(2);
    const [appliedFilterList, setFilters] = useState([]);
    const {width, height, ref} = useResizeDetector()
    const [dimensions, setDimensions] = useState({
      height: 0,
      width: 0
    });

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
    
    // Run on re-render
    useEffect(() => {
      function handleResize() {
        updateDimensions()
      }

      //Add the listener
      window.addEventListener('resize', handleResize)

      // The function returned is called afterwards. Listerner is removed in this function
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    })

    //Update on re-render when list changes
    useEffect(() => {
      if (props.list != null)
      {
        setList(props.list)
      }

    }, [props.list])

    useEffect(() => {
      if (nightmareList)
      {
        let newList = nightmareList.map((nightmare, index, arr) => {

          return (
            <ImageComponent key={index} nightmare={nightmare} index={index} displayOptions={props.displayOptions} onClick={props.onClick}/>
          )

        })
  
        updateImages(newList)
      }
    }, [nightmareList])

    function changeFilters(newList)
    {
      console.log(newList)
      //Update the filter list
      setFilters(newList)
    }

    //Effect to run when filter list updated
    useEffect(() => {
      if (props.list && appliedFilterList)
      {
        //filter the nightmare list and update image list based on filtered nightmares
        const filteredNms = props.list.filter(nm => appliedFilterList.every(filterTag => nm['applied_tags'].includes(filterTag)))

        setList(filteredNms);
      }
    }, [appliedFilterList])

  return (
    <div ref={ref}>
      <FilterBar filterList={props.filterList}
      handleChange={changeFilters}>
      </FilterBar>
    <ImageList cols={columns}>
      {imageList}
    </ImageList>
    </div>

  );
}
