import * as React from 'react';
import Image from 'next/image';
import { useState, useEffect, useLayoutEffect } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function NightmareImageList(props) {
    const [columns, setColumns] = useState(2)
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
    useLayoutEffect(() => {
        updateImageGridDimensions()
    })
    
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

    useEffect(() => {
      if (props.list != null)
      {
        let newList = props.list.map((nightmare, index, arr) => {
          const renderTooltip = (props) => {
            return(
              <Tooltip id={nightmare[props.displayName]}>
              <b>{nightmare[props.toolTipSkillName]}</b>
              <br/>
              {nightmare[props.toolTipDescription]}
            </Tooltip>
            )
          }
  
          return(
            <OverlayTrigger key={index} overlay={renderTooltip(props)}>
              <ImageListItem onClick={() => props.onClick(nightmare)} key={index} sx={{ width: 90, height: 90 }}>
                <Image
                  src={nightmare[props.iconKey]}
                  alt={nightmare[props.displayName]}
                  width='90'
                  height='90'
                />
                <ImageListItemBar
                  title={nightmare[props.displayName]}
                  position="below"
                />
              </ImageListItem> 
            </OverlayTrigger>

          )
        })
  
        updateImages(newList)
      }

    }, [props.list])

  return (
    <ImageList cols={columns}>
      {imageList}
    </ImageList>
  );
}
