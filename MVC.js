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
m.btn1In = false
m.btn2In = false
m.btnClearLocalStorageIn = false
m.randomBackgroundColor = ""

m.image1url = 'https://cdn.glitch.com/64ea24dd-529d-44b3-b288-d7bd5450effc%2FBaliFishermen.jpg?1504408500932'
m.image2url = 'https://cdn.glitch.com/64ea24dd-529d-44b3-b288-d7bd5450effc%2FJapan.jpg?1504325351040'
m.currentImageUrl = ''

m.modelMethodQualifiers = {}

//===========| UPDATE MODEL |===========//
c.updateModel = function(eventObject){
  c.updateBasicStates(eventObject)
  m.modelMethodQualifiers = {
    setPopupToggle:            [v.messageHolder === m.source, m.clicked, m.shroudIsVisible],
    setShroudVisible:          [(v.btn1 === m.source || v.btn2 === m.source), m.clicked],
    setShroudHidden:           [v.btnHideShroud === m.source, m.clicked],
    setBtn1Toggle:             [v.btn1 === m.source, m.clicked],
    setBtn2Toggle:             [v.btn2 === m.source, m.clicked],
    setRandomBackgroundColor:  [v.main === m.source, m.clicked],
    setOfflineStatus:          [m.type === 'online' || m.type === 'offline'],
    setResize:                 ['resize' === m.type],
    setClearLocalStorage:      [v.btnClearLocalStorage === m.source, m.clicked],
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
  //attach "id"-ed elements to our view object (after giving window its own id)
  window.id = 'window'
  L.attachAllElementsById(v)
  
  
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
c.restorePriorModel = function(eventObject){
  //c.updateModel({target:{id:'dummy'},type: 'dummy'})   
  if(localStorage && localStorage.getItem('m')){
    m = JSON.parse(localStorage.getItem('m'))// Use it, then ...
    //localStorage.removeItem('m') // ... lose it.
  }
  
  Object.keys(m.modelMethodQualifiers).forEach(methodName =>{
    m.isOnline = navigator.onLine  
    let prefix = methodName.slice(0,3)
    let newMethodName = 'show' + methodName.slice(3)    
    if(prefix === 'set' && c[newMethodName]){
      c[newMethodName]()
    }    
  })  
  //localStorage.removeItem('m')
  if(m.shroudIsVisible){
    v.shroud.styles('visibility: visible')('opacity: 1')
  }
  if(m.popupIsVisible){
    v.popupHolder.styles('visibility: visible')('opacity: 0.85')    
  }
  m.isOnline = true;
}