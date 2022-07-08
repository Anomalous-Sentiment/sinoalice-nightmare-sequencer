import * as React from 'react';
import Image from 'next/image';
import { useState, useEffect, useLayoutEffect } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import FilterBar from './filter-component';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function NightmareImageList(props) {
  const [nightmareList, setList] = useState()
    const [columns, setColumns] = useState(2);
    const [appliedFilterList, setFilters] = useState([]);

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
    function updateImageGridDimensions()
    {
      console.log(parseInt(window.innerWidth))
        //Calculate number of columns based on window size and update
        setColumns(parseInt(window.innerWidth / 90) - 2)
    }
    

    //Run after render
    useEffect(() => {
        updateImageGridDimensions()
    }, [])
    
    // Run on re-render
    useEffect(() => {
      function handleResize() {
        updateImageGridDimensions()
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
          const renderTooltip = (props) => {
            return(
              <Tooltip id={nightmare[props.displayOptions['name']]}>
              <b>{nightmare[props.displayOptions['skill_name']] + ' ' + nightmare[props.displayOptions['skill_rank']]}</b>
              <br/>
              {nightmare[props.displayOptions['skill_description']]}
            </Tooltip>
            )
          }
  
          return(
            <OverlayTrigger key={index} overlay={renderTooltip(props)}>
              <ImageListItem onClick={() => props.onClick(nightmare)} key={index} sx={{ width: 90, height: 90 }}>
                <Image
                  src={nightmare[props.displayOptions['icon']]}
                  alt={nightmare[props.displayOptions['icon']]}
                  width='90'
                  height='90'
                />
                <ImageListItemBar
                  title={nightmare[props.displayOptions['name']]}
                  position="below"
                />
              </ImageListItem> 
            </OverlayTrigger>

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
    <div>
      <FilterBar filterList={props.filterList}
      handleChange={changeFilters}>

      </FilterBar>
    <ImageList cols={columns}>
      {imageList}
    </ImageList>
    </div>

  );
}
