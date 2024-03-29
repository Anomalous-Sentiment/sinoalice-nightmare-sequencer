import { useState, memo, useMemo, useEffect } from 'react';
import ImageComponent from './image-component';
import FilterBar from './filter-component';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/ImageComponent.module.css'


function NightmareImageList(props) {
  const [searchVal, setSearchVal] = useState('');
    const [appliedFilterList, setFilters] = useState([]);
    const sortByList=[
        <Dropdown.Item key='0' eventKey="0">Rarity (Low to High)</Dropdown.Item>,
        <Dropdown.Item key='1' eventKey="1">Rarity (High to Low)</Dropdown.Item>,
        <Dropdown.Item key='2' eventKey="2">Element</Dropdown.Item>,
        <Dropdown.Item key='3' eventKey="3">Default</Dropdown.Item>
      ]

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


    //const imageList = useMemo(() => props.list ? mapNightmaresToComponents(props.list) : [], [props.list, appliedFilterList, sorter])
    const [imageList, setImages] = useState([]);

    useEffect(() => {
      if (props.list)
      {
        setImages(mapNightmaresToComponents(props.list))
      }
      else
      {
        setImages([])
      }
    }, [props.list, appliedFilterList, sorter])

    function mapNightmaresToComponents (list)
    {
      //Apply filters to updated list
      let newList = applyFilters(list)

      //Apply sorting to filtereed list if selected
      newList = newList.sort(sorter[1])

      newList = applySearchFilter(newList)
    

      //Map list elements to components
      newList = newList.map((nightmare, index, arr) => {
    
        return (
          <ImageComponent key={nightmare[props.displayOptions['icon']]} 
          nightmare={nightmare} 
          displayOptions={props.displayOptions} 
          />
        )
    
      })
    
      return newList;
    }

    function applyFilters(list)
    {
      //filter the nightmare list and update image list based on filtered nightmares
      const filteredNms = list.filter(nm => appliedFilterList.every(filterTag => nm['applied_tags'].includes(filterTag)))

      return filteredNms;
    }

    function applySearchFilter(list)
    {
      let searchedList = list.filter(nightmare => nightmare[props.displayOptions['name']].toLowerCase().includes(searchVal.toLowerCase()))

      return searchedList
    }

    useEffect(() => {
      //Apply search filter only after 0.2 secs of no typing
      const timeOutId = setTimeout(() => setImages(mapNightmaresToComponents(props.list)), 200);
      return () => clearTimeout(timeOutId);
    }, [searchVal])


  return (
    <div>
      <FilterBar filterList={props.filterList}
      handleChange={setFilters}>
      </FilterBar>
      <label htmlFor="searchbar">Search by name:</label>
      <br/>
      <input 
      type="text" 
      id="searchbar" 
      name="searchbar"
      onChange={(event) => setSearchVal(event.target.value)}
      />
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

function areEqual(prevProps, nextProps)
{
  let isEqual = false;

  //Check if old list is same as new list
  if (prevProps.list && nextProps.list && prevProps.displayOptions && nextProps.displayOptions)
  {
    if (prevProps.displayOptions['icon'] == nextProps.displayOptions['icon'])
    {
      if (nextProps.list.length == prevProps.list.length)
      {
        isEqual= true
      }
    }

  }


  return isEqual;
}

export default memo(NightmareImageList, areEqual);