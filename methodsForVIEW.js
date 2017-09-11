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
      if(button.classList.contains('' + index)){
        button.classList.remove('btnOut')
        button.classList.add('btnIn')
        button.style.background = (className === 'btnMinus')? 'red' : 'hsl(120, 100%, 75%)'
        setTimeout(function(){
          button.classList.remove('btnIn')
          button.classList.add('btnOut')
          button.style.background = '#eee'
        }, m.TOGGLE_DELAY)
      }
    })   
  }
  //--------------------------------------//
  function showScore(index){
    const scoresArray = [...document.getElementsByClassName('score')]
    scoresArray.forEach( scoreHolder => {
      if(scoreHolder.classList.contains('' + index)){
        scoreHolder.value = m.players[index].score
      }
    })
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
 
  setTimeout(function(){
    c.showBtn1Toggle()
    c.showBtn2Toggle()     
  }, 500) 
}

c.showEnterName = function(){
  c.showShroudVisible()
  v.nameInput
    .styles
      ('visibility: visible')
  v.nameInput.value = m.source.value
}

c.showShroudVisible = function(){
  v.shroud
    .styles
      ('opacity: 1') 
      ('visibility: visible')
}

c.showOfflineStatus = function(){
  if(m.isOnline){
    v.offlineMessage.style.color = "transparent"
  }
  else if(!m.isOnline){
    v.offlineMessage.style.color = "red"
  }
}


