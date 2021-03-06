/*global L*/
/*global m*/
/*global v*/
/*global c*/

//========| functions that UPDATE MODEL |========//
c.updateBasicStates = function(eventObject){
  
  m.priorStartTime = m.startTime
  m.startTime = Date.now()
  
  m.elapsedTimes.unshift(m.startTime - m.priorStartTime)
  m.elapsedTimes.pop()
  
  m.eventObject = eventObject  
  m.eventObjects.unshift(eventObject)
  m.eventObjects.pop()

  m.type = eventObject.type
  m.source = eventObject.target
  m.id = m.source.id
  
  m.priorPressed.unshift(m.pressed)
  m.priorPressed.pop()  
  m.pressed = (m.type === 'mousedown' || m.type === 'touchstart')
  
  m.priorReleased.unshift(m.pressed)
  m.priorReleased.pop()   
  m.released = (m.type === 'mouseup'  || m.type === 'touchend') 
  
  m.priorMoved.unshift(m.moved)
  m.priorMoved.pop()
  m.moved = (m.type === 'mousemove' || m.type === 'touchmove')
  
  m.moveCount = m.moved ? ++m.moveCount : 0
  
  m.innerWidth = window.innerWidth
  m.isEnterKey = wasEnterKey()
  m.clicked = wasClicked()  
  //------| helper(s) |--------//
  function wasClicked(){
    return m.released &&
      (m.priorPressed[0] || m.priorMoved[0]) &&
      (m.elapsedTimes[0] > m.debounceTimeMin) &&
      (m.elapsedTimes[0] < m.debounceTimeMax)
  }
  //-------------------------------// 
  function wasEnterKey(){
    return  m.type === 'keyup' &&
            m.eventObject.which === 13 
  }
  //-------------------------------//
  //save the updated model in localStorage  
  c.updateLocalStorage()  
}
//-----------------
c.setUpdateName = function(){
  m.players[m.currentPlayerNumber].name = v.nameInput.value
}

//-------------------
c.setEnterName = function(){
  v.nameInput.focus()
  m.currentPlayerNumber = c.getPlayerNumber()
  m.players[m.currentPlayerNumber].name = m.source.value
  c.updateLocalStorage()
  c.setShroudVisible()  
}
//----------------------
c.setButtonClicked = function(){
  const playerNumber = c.getPlayerNumber()
  if(m.source.classList.contains('btnPlus')){
    m.players[playerNumber].btnPlusPressed = true;
    m.players[playerNumber].btnMinusPressed = false;
    m.players[playerNumber].score += 1;
  }
  else if (m.source.classList.contains('btnMinus')){
    m.players[playerNumber].btnPlusPressed = false;
    m.players[playerNumber].btnMinusPressed = true;
    m.players[playerNumber].score -= 1;    
  }
  c.updateLocalStorage()
}

//------------------
c.setRandomBackgroundColor = function(){
  const angle = 360 * Math.random()
  m.randomBackgroundColor = `hsl(${angle}, 50%, 50%)`
  c.updateLocalStorage()  
}
//-------------------
c.setShroudHidden = function (){
  m.shroudIsVisible = false  
  c.updateLocalStorage()  
}
//------------------
c.setShroudVisible = function(){
  m.shroudIsVisible = true
  v.nameInput.focus()  
  //c.updateLocalStorage()  
}
//---------------------

c.setOfflineStatus = function(){
  if(m.type === 'online'){
    m.isOnline = true;
  }
  else if(m.type === 'offline'){
    m.isOnline = false;
  }
  c.updateLocalStorage()  
}
//---------------------
c.setResize = function(){
  m.innerWidth = window.innerWidth
  c.updateLocalStorage()
}
//---------------------

