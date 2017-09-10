/*global L*/
/*global m*/
/*global v*/
/*global c*/

//===| functions that update the VIEW |=======//
c.showEvents = function(){
  const moveCount = (m.moved) ? ` (${m.moveCount})` : ``
  const info = `${m.id}, ${m.type}${moveCount}, prior event: ${m.eventObjects[1].type}`
  //const info = `EVENT: ${m.eventObjects[0].type},  PRIOR: ${m.eventObjects[1].type},  2-PRIOR: ${m.eventObjects[2].type}`
  //const info = `TIME: ${(m.elapsedTimes[0]/1000).toFixed(2)},  PRIOR: ${(m.elapsedTimes[1]/1000).toFixed(2)}`
  v.info.innerText = info
}
//--------------------------
c.showButtonClicked = function(){
  m.players.forEach((player, index) =>{
    if(player.btnPlusPressed){
      player.btnPlusPressed = false
      player.btnMinusPressed = false      
      toggleButton(index, "btnPlus")
      showScore(index)
    }
    else if(player.btnMinusPressed){
      player.btnPlusPressed = false
      player.btnMinusPressed = false  
      toggleButton(index, "btnMinus")
      showScore(index)      
    }
  })
  //-------------| helpers |--------------//
  function toggleButton(index, className){
    const buttonsArray = [...document.getElementsByClassName(className)]
    buttonsArray.forEach(button => {
      if(button.classList.contains(''+index)){
        button.classList.remove('btnOut')
        button.classList.add('btnIn')
        setTimeout(function(){
          button.classList.remove('btnIn')
          button.classList.add('btnOut')          
        }, m.TOGGLE_DELAY)
      }
    })   
  }
  //--------------------------------------//
  function showScore(index){
    const scoresArray = [...document.getElementsByClassName(className)]
  }
}

c.showRandomBackgroundColor = function(){
  v.main.styles(`background: ${m.randomBackgroundColor}`)  
}

c.showShroudHidden = function (){
  v.shroud
    .styles
      ('opacity: 0')
      ('visibility: hidden')
  v.popupHolder
    .styles
      ('opacity: 0') 
      ('visibility: hidden')  
  setTimeout(function(){
    c.showBtn1Toggle()
    c.showBtn2Toggle()     
  }, 500) 
}

c.showShroudVisible = function(){
  v.shroud
    .styles
      ('opacity: 1') 
      ('visibility: visible')
}

c.showPopup = function(){
  v.popupHolder
    .styles
      ('opacity: 0.85') 
      ('visibility: visible')  
}

c.showPopupToggle = function(){
  if(m.popupIsVisible){
    v.popupHolder
      .styles
        ('opacity: 0.85') 
        ('visibility: visible')     
  }
  else if(!m.popupIsVisible){
    v.popupHolder
      .styles
        ('opacity: 0') 
        ('visibility: hidden')  
  }
}

c.downloadCurrentImage = function(){
  v.popupHolder
      .styles
        ('opacity: 0') 
        ('visibility: hidden')   
  m.popupIsVisible = false  
  if(m.source === v.btnYes){
    setTimeout(function(){
      document.location.assign(m.currentImageUrl)       
    }, 1)
  }
}

c.showOfflineStatus = function(){
  if(m.isOnline){
    v.offlineMessage.style.color = "transparent"
  }
  else if(!m.isOnline){
    v.offlineMessage.style.color = "red"
  }
}

c.showClearLocalStorage = function(){
  if(m.btnClearLocalStorageIn){
    v.btnClearLocalStorage.setAttribute('class', 'btnIn')
    //alert("BEFORE:\n " + localStorage.getItem('m').replace(',','\n'))
    localStorage.clear('m')
    //alert("AFTER\n " + localStorage.getItem('m'))    
  }
  setTimeout(function(){
    m.btnClearLocalStorageIn = false
    v.btnClearLocalStorage.setAttribute('class', 'btnOut')    
  }, 300)

}
