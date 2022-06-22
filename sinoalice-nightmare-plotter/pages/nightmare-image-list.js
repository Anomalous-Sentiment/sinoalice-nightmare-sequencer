import * as React from 'react';
import { useState, useEffect, useLayoutEffect } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function NightmareImageList(props) {
    const [reload, setReload] = useState(true)
    const [columns, setColumns] = useState(2)
    const [imageList, updateImages] = useState(
        <ImageListItem key='0'>
        <img
          src={`https://sinoalice.game-db.tw/images/img404.png?w=248&fit=crop&auto=format`}
          srcSet={`$https://sinoalice.game-db.tw/images/img404.png?w=248&fit=crop&auto=format&dpr=2 2x`}
          alt={`Nightmare Name`}
          loading="lazy"
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
        setColumns(parseInt(window.innerWidth / 90))
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

    if (props.list != null && reload == true)
    {
      
        let newList = props.list.map((nightmare, index, arr) => {
          const renderTooltip = (props) => {
            return(
              <Tooltip id={nightmare + index.toString()} {...props}>
              {nightmare["Colo.Skill"]}
            </Tooltip>
            )
          }

            return(
              <OverlayTrigger overlay={renderTooltip}>
                <ImageListItem key={index} sx={{ width: 90, height: 90 }}>
                  <img
                    src={`${nightmare.Icon}?w=80&fit=crop&auto=format`}
                    srcSet={`${nightmare.Icon}?w=80&fit=crop&auto=format&dpr=2 2x`}
                    alt={nightmare.Name}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={nightmare.Name}
                    position="below"
                  />
                </ImageListItem> 
              </OverlayTrigger>
 
            )
        })

          updateImages(newList)
          setReload(false)

    }

  return (
    <ImageList cols={columns}>
      {imageList}
    </ImageList>
  );
}
