import logo from './logo.svg';
import './App.css';
import {useState, useRef, useEffect} from 'react';
import Draggable from 'react-draggable';

function Court(props){
  //States that manage dragging of the court
  const[isDraggable, SetDraggability] = useState(false);
  const[cursorType,SetCursorType] = useState('default');
  //States that manage dragging of the court ENDS
  const initialPuckPositions = [
    {id:1,pos:{x:0,y:0}},
    {id:2,pos:{x:0,y:0}},
    {id:3,pos:{x:0,y:0}},
    {id:4,pos:{x:0,y:0}},
    {id:5,pos:{x:0,y:0}},
  ];

  function Puck({id, pos,onStop}){
    const [position, SetPosition] = useState({x:0,y:0});
    function handleDrag(e,ui){
      SetPosition({x: ui.x, y: ui.y})
      console.log('x: '+ui.x+' , '+'y: '+ui.y);
    }
    function handleStop(){
      onStop(id,position);
    }
    return(
      <Draggable disabled={isDraggable} bounds='parent' position={pos} onDrag={handleDrag} onStop={handleStop}>
      <div className='puck'>
        {id}
      </div>
      </Draggable>
    );
  }

  function handleReset(){
    props.ifunc(initialPuckPositions);
  }
  function handleStop(id,position){
    const newPos = props.ipos.map((puck,index)=>{
      if(index === id-1){
        return {...puck, pos: {...position}};
      }
      return puck;
    });
    props.ifunc(newPos);
  }
  //record button states
  const [recordBtnStyle,setRecordBtnStyle] = useState('record-btn');
  const [isRecording, setIsRecording] = useState(false);
  const [recordEnd,setRecordEnd] = useState(false);
  function handleRecordBtnPress(){
    if(recordBtnStyle==='record-btn'){
      setRecordBtnStyle('stop-btn')
      setIsRecording(true);
      if(recordEnd){
        setRecordEnd(false);
      }
    }
    else{
      setRecordBtnStyle('record-btn');
      setIsRecording(false);
      setRecordEnd(true);
    }
  }
  //record button states ENDS
  

  //states and functions that handle input texts and saving puck positions
  const [inputText, setInputText] = useState('');
  function handleInputChange(event){
    setInputText(event.target.value);
  }


  function handleSave(){
    const newPresetPuckPositions = [...props.pos,{[inputText]:props.ipos}];
    props.func(newPresetPuckPositions);
    setRecordEnd(false);
  }

  function handleDiscard(){
    setRecordEnd(false);
  }
  //states and functions that handle input texts and saving puck positions ENDS

  return(
    <Draggable disabled={!isDraggable}>
      <div className='coach-board-img-container' style={{cursor:cursorType}}>
        <div><button className='court-drg-btn' onClick={()=>{SetDraggability(!isDraggable);!isDraggable?SetCursorType('move'):SetCursorType('default')}}>Drag</button></div>
        <button className={recordBtnStyle} onClick={handleRecordBtnPress}></button>
          {/* {console.log(props.pos)} */}
          {props.ipos.map((puck)=>{return(<Puck id={puck.id} pos={puck.pos} onStop={handleStop}/>)})}

        <button onClick={handleReset} className='court-btn'>Reset</button>
        {recordEnd && 
        <div style={{display:'flex', position:'absolute', left:'4em',top:'1.5em'}}>
          <input onChange={handleInputChange} value={inputText} placeholder='Give a name to your config' style={{padding:'0.5em',borderRadius:'10px',top:'2em',left:'5em'}}type="text"/>
          <div style={{display:'flex', position:'absolute', left:'2em',top:'2em'}}>
          
          {/* save button */}
          <button className='save-btn' onClick={handleSave}>save</button> 
          
          <button className='save-btn' onClick={handleDiscard}>discard</button>
          </div>
        </div>}
        <img src='court.png' className='coach-board-img'></img>
      </div>
    </Draggable>
  );
}


function DropdownMenu(props){
  function DropdownItem(props){
    return(
      <a href='#' className='menu-item' onClick={()=>{props.presetPos.map((pPos)=>{if(Object.keys(pPos)[0]===props.children[0])props.setPuckPos(pPos[props.children[0]])})}}>
        {/* {props.setPuckPos(pPos[props.children[0]])} */}
        {props.children}
      </a>
    );
  }
  return(
    <div className='dropdown'>
      {props.pos.map((presetpos)=>{return(<DropdownItem presetPos={props.pos} setPuckPos={props.ifunc}>{Object.keys(presetpos).map((a)=>{return a})}</DropdownItem>)})}
    </div>
  );
}

function Selector(props){
  const [open,setOpen]=useState(false);
  return(
    <div>
    <a href='#' className='selector' onClick={()=>setOpen(!open)}>
      Select Formation
    </a>
    {open && props.children}
    </div>
  );
}

function App() { 
  const [puckPositions,SetPuckPositions] = useState([
    {id:1,pos:{x:0,y:0}},
    {id:2,pos:{x:0,y:0}},
    {id:3,pos:{x:0,y:0}},
    {id:4,pos:{x:0,y:0}},
    {id:5,pos:{x:0,y:0}},
  ]);

  const [presetPuckPositions, setPresetPuckPositions] = useState([
    // {formation1:[
    //   {id:1,pos:{x:0,y:0}},
    //   {id:2,pos:{x:0,y:0}},
    //   {id:3,pos:{x:0,y:0}},
    //   {id:4,pos:{x:0,y:0}},
    //   {id:5,pos:{x:0,y:0}},
    // ]},
    // {formation2:[
    //   {id:1,pos:{x:10,y:40}},
    //   {id:2,pos:{x:10,y:60}},
    //   {id:3,pos:{x:10,y:70}},
    //   {id:4,pos:{x:10,y:80}},
    //   {id:5,pos:{x:10,y:90}},
    // ]}
  ]);

  return (
    <>
    <h1 className='title'>Play-Maker</h1>
    <Selector>
      <DropdownMenu pos={presetPuckPositions} ifunc={SetPuckPositions}/>
    </Selector>
    <Court pos={presetPuckPositions} func={setPresetPuckPositions} ipos={puckPositions} ifunc={SetPuckPositions}/>
    </>
  );
}

export default App;
