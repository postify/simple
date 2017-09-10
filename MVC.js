/*global L*/
//===========| CREATE MODEL, VIEW and CONTROLLER objects |========//
let m = {}
const v = {}
const c = {}

//====| MODEL DATA |===========//
//basic states
m.eventTypes = [] //list of events that we "listen for" in this app (see c.initialize)
m.eventObjects = [{}, {}, {}]
m.eventObject = {}
m.type = ''
m.source = {}
m.id = ''

m.startTime = 0
m.priorStartTime = 0
m.elapsedTimes = [0, 0, 0]

m.pressed = false
m.priorPressed = [false, false, false]

m.released = false
m.priorReleased = [false, false, false]

m.moved = false
m.priorMoved = [false, false, false]

m.clicked = false

m.isOnline = true
m.shroudIsVisible = false
m.popupIsVisible = false
m.moveCount = 0

//specialized states (these vary per application)
m.debounceTimeMin = 25 //in milliseconds
m.debounceTimeMax = 750 // milliseconds

m.randomBackgroundColor = ""

m.image1url = 'https://cdn.glitch.com/64ea24dd-529d-44b3-b288-d7bd5450effc%2FBaliFishermen.jpg?1504408500932'
m.image2url = 'https://cdn.glitch.com/64ea24dd-529d-44b3-b288-d7bd5450effc%2FJapan.jpg?1504325351040'
m.currentImageUrl = ''

m.modelMethodQualifiers = {}
m.innerWidth = window.innerWidth;

m.TOGGLE_DELAY = 250 //milliseconds

m.players = [
  {
    name: '',
    score: 0,
    btnPlusPressed: false,
    btnMinusPressed: false
  },
  {
    name: '',
    score: 0,
    btnPlusPressed: false,
    btnMinusPressed: false
  },
  {
    name: '',
    score: 0,
    btnPlusPressed: false,
    btnMinusPressed: false
  },
  {
    name: '',
    score: 0,
    btnPlusPressed: false,
    btnMinusPressed: false
  },
]

//===========| UPDATE MODEL |===========//
c.updateModel = function(eventObject){
  c.updateBasicStates(eventObject)
  m.modelMethodQualifiers = {
    setEnterName:              [false],
    setButtonClicked:          [c.isButton(), m.clicked],
    setShroudVisible:          [(v.btn1 === m.source || v.btn2 === m.source), m.clicked],
    setShroudHidden:           [v.btnHideShroud === m.source, m.clicked],
    setRandomBackgroundColor:  [v.main === m.source, m.clicked],
    setOfflineStatus:          [m.type === 'online' || m.type === 'offline'],
    setResize:                 ['resize' === m.type],
  }
  L.runQualifiedMethods(m.modelMethodQualifiers, c, c.updateView)
}

//===========| UPDATE VIEW |===========//
c.updateView = function(){
  const viewMethodQualifiers = {
    showEvents: [true],
    downloadCurrentImage: [v.btnYes === m.source || v.btnNo === m.source, m.clicked, m.shroudIsVisible] 
  }
  L.runQualifiedMethods(viewMethodQualifiers, c, "no callback needed here")

}

//============| INITIALIZE |================//
c.initialize = function(eventObject){  
  window.id = 'window'
  L.attachAllElementsById(v)
  
  setTimeout(function(){  
    v.messageText.styles('visibility: hidden')('opacity: 0')
    v.shroud.styles('visibility: hidden')('opacity: 0')    
  }, 2000)
  
  //for apple devices
  L.noPinchZoom()
 
  //list of event types of interest
  m.eventTypes = [
    'mousedown',
    'touchstart',
    'mouseup',
    'touchend',
    'mousemove',
    'touchmove',
    'resize',
    'keyup',
    'keydown',
    'online',
    'offline',
    'dblclick'
  ]
  //make the window object listen to, and handle these event types
  m.eventTypes.forEach(eventType =>{
    window.addEventListener(eventType, c.updateModel, true )
  })
  
  c.restorePriorModel(eventObject)
}
//============| END of INITIALIZE |================//

//==============| Helpers |==============//
c.getClassNumber = function getClassNumber(){
  //all elements have a numeric class: find and return the number
  const classArray = [...m.source.classList]
  let classNumber;
  classArray.forEach( className => !isNaN(parseInt(className)) ? classNumber = parseInt(className) : false )
  return classNumber
}
c.getPlayerNumber = function getClassNumber(){
  //all elements have a numeric class: find and return the number
  const classArray = [...m.source.classList]
  let classNumber;
  classArray.forEach( className => !isNaN(parseInt(className)) ? classNumber = parseInt(className) : false )
  return classNumber
}

c.isButton = function isButton(){
  //return true if current target (source) is a member of class "button"
  let answer = false;
  try{
    let classArray = [...m.source.classList]    
    answer = classArray.some( className => className === 'button')    
  }
  catch(e){
    answer = false
  }
  return answer
}

//---------------------
c.isTextInput = function(){
   return [...m.source.classList].some( className => className === 'textInput')  
}
c.restorePriorModel = function(eventObject){
  if(localStorage && localStorage.getItem('m')){
    m = JSON.parse(localStorage.getItem('m'))// Use it, then ...
    localStorage.removeItem('m') // ... lose it.
    console.log('locally stored m:', localStorage.getItem('m'))
  }
  
  
  ;[0,1,2,3].forEach(index=>{
    const scoresArray = [...document.getElementsByClassName('score')]
    scoresArray.forEach( scoreHolder => {
      if(scoreHolder.classList.contains('' + index)){
        scoreHolder.value = m.players[index].score        
      }
    })  
  })
  ;[0,1,2,3].forEach(index=>{
    const scoresArray = [...document.getElementsByClassName('textInput')]
    scoresArray.forEach( scoreHolder => {
      if(scoreHolder.classList.contains('' + index)){
        scoreHolder.value = m.players[index].name       
      }
    })  
  })  
  
  m.isOnline = navigator.onLine;
}

