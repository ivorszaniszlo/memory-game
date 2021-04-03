const imgList = [
'<img src="img/1.jpg" alt="púder">', 
'<img src="img/1.jpg" alt="púder">', 
'<img src="img/2.jpg" alt="gyertya">', 
'<img src="img/2.jpg" alt="gyertya">', 
'<img src="img/3.jpg" alt="táska">', 
'<img src="img/3.jpg" alt="táska">', 
'<img src="img/4.jpg" alt="gömb">', 
'<img src="img/4.jpg" alt="gömb">',  
'<img src="img/5.jpg" alt="körömlakk">', 
'<img src="img/5.jpg" alt="körömlakk">', 
'<img src="img/6.jpg" alt="nyaklánc">', 
'<img src="img/6.jpg" alt="nyaklánc">', 
];

const cardDeck = document.querySelector('.deck');
const counter = document.querySelector('.moves');
const starRating = document.querySelector('.stars');
const myStopWatch = document.getElementById('stopWatch');
const clone = document.querySelector('.clone');
const overlay = document.querySelector('.overlay');
const reset = document.querySelector('.reset');
const cardArray = [];
const flippedCards = [];
const matchedCards = [];
const startTrigger = [];
var totalClicks = 0;
var totalMatched = 0;
var seconds = 0;
var minutes = 0;
var mySeconds;
var myMinutes;
var t;

  /* ===========================================================================================*
   *                                      TIMER START                                           *
   * ===========================================================================================*/

function _timer(callback)
{
    var time = 0;     //  The default time of the timer
    var mode = 0;     //   Mode: count up or count down
    var status = 0;    //    Status: timer is running or stoped
    var timer_id;    //    This is used by setInterval function
    
    // this will start the timer ex. start the timer with 1 second interval timer.start(1000) 
    this.start = function(interval)
    {
        interval = (typeof(interval) !== 'undefined') ? interval : 1000;
 
        if(status == 0)
        {
            status = 1;
            timer_id = setInterval(function()
            {
                switch(mode)
                {
                    default:
                    if(time)
                    {
                        time--;
                        generateTime();
                        if(typeof(callback) === 'function') callback(time);
                    }
                    break;
                    
                    case 1:
                    if(time < 86400)
                    {
                        time++;
                        generateTime();
                        if(typeof(callback) === 'function') callback(time);
                    }
                    break;
                }
            }, interval);
        }
    }
    
    //  Same as the name, this will stop or pause the timer ex. timer.stop()
    this.stop =  function()
    {
        if(status == 1)
        {
            status = 0;
            clearInterval(timer_id);
        }
    }
    
    // Reset the timer to zero or reset it to your own custom time ex. reset to zero second timer.reset(0)
    this.reset =  function(sec)
    {
        sec = (typeof(sec) !== 'undefined') ? sec : 0;
        time = sec;
        generateTime(time);
    }
    
    // Change the mode of the timer, count-up (1) or countdown (0)
    this.mode = function(tmode)
    {
        mode = tmode;
    }
    
    // This methode return the current value of the timer
    this.getTime = function()
    {
        return time;
    }
    
    // This methode return the current mode of the timer count-up (1) or countdown (0)
    this.getMode = function()
    {
        return mode;
    }
    
    // This methode return the status of the timer running (1) or stoped (1)
    this.getStatus
    {
        return status;
    }
    
    // This methode will render the time variable to hour:minute:second format
    function generateTime()
    {
        var second = time % 60;
        var minute = Math.floor(time / 60) % 60;
        var hour = Math.floor(time / 3600) % 60;
        
        second = (second < 10) ? '0'+second : second;
        minute = (minute < 10) ? '0'+minute : minute;
        hour = (hour < 10) ? '0'+hour : hour;
        
        $('div.timer span.second').html(second);
        $('div.timer span.minute').html(minute);
        $('div.timer span.hour').html(hour);
    }

}
 

/**************************************** T I M E R   E N D   ********************************/

/* ===========================================================================================*
 *                                      R A T I N G  S T A R T                                *
 * ===========================================================================================*/

//  This function assigns player star rating based on number of clicks to complete the game
function rating() {
  if (totalClicks <= 20) {
    starRating.innerHTML = `
    <li><i class="fa fa-star"></i></li>
    <li><i class="fa fa-star"></i></li>
    <li><i class="fa fa-star"></i></li>`;
  } else if (totalClicks >= 21 && totalClicks <= 30) {
    starRating.innerHTML = `
    <li><i class="fa fa-star"></i></li>
    <li><i class="fa fa-star"></i></li>`;
  } else if (totalClicks >= 31) {
    starRating.innerHTML = `
    <li><i class="fa fa-star"></i></li>`;
  } else {
    starRating.innerHTML = `
    <li><i class="fa fa-star"></i></li>
    <li><i class="fa fa-star"></i></li>
    <li><i class="fa fa-star"></i></li>`;
  }
}
//  Insert Default Star Rating at Start of Game
rating();

/************************************** R A T I N G    E N D   ********************************/

/* ===========================================================================================*
 *                                      G A M E   S T A R T                                   *
 * ===========================================================================================*/

//  End of game: This function constructs modal at game end
function matchedGame() {
  if (totalMatched === 12) {
	 timer.stop();
     timer.mode(1);
	 overlay.classList.remove('hidden');
    /*setTimeout(() => {
      const modal = document.createElement('div');
      modal.classList.add('modal');
      modal.innerHTML = `<div class='modal-content'>
      <h1>Congratulations!</h1>
      <p>Thank's for playing the Brilliant Economists Memory Game.</p>
      <p>You completed the game in <span>${totalClicks}</span> Moves with a time of <span>${myStopWatch.textContent}</span> minutes</p><br>
      <div id='modal-stars'>Your Star Rating is: <ul>${starRating.innerHTML}</ul> 
      </div><br>
      <p>If you would like to play again click the button below.</p>
      <button id='modal-reset' type ="button" onclick="refreshPage()">Play Again</button>
      </div>`;
      document.body.appendChild(modal);
    }, 2000);*/
  }
}

//  This function removes flipped class if selected cards do not match add matched class if matched
function checkFlipped() {
  if (flippedCards.length === 2 && flippedCards[0].innerHTML !== flippedCards[1].innerHTML) {
    setTimeout(() => {
      for (let i = 0; i < flippedCards.length; i += 1) {
        flippedCards[i].classList.remove('flipped');
      }
      //  Clear flippedCards Array
      flippedCards.splice(0, 12);
    }, 2000);
  } else if (flippedCards.length === 2 && flippedCards[0].innerHTML === flippedCards[1].innerHTML) {
    for (let i = 0; i < flippedCards.length; i += 1) {
      flippedCards[i].classList.add('matched');
      matchedCards.push(this);
      totalMatched += 1;
    }
    //  Clear flippedCards Array
    flippedCards.splice(0, 12);
    //  Call matchedGame function
    matchedGame();
  }
}

//  Loops over imgList Array - Constructs Cards - Pushes to Card Array
function createCards() {
  for (let i = 0; i < imgList.length; i += 1) {
    const cards = document.createElement('div');
    cards.classList.add('card');
    cards.innerHTML = `<div class='back'>${imgList[i]}</div>
    <div class='front'><i class="fa fa-line-chart" style="font-size:2em;color:#ffffff;"></i></div>`;
    cardArray.push(cards);
  }
  //  Loops and Shuffles Card Array
  for (let i = cardArray.length - 1; i >= 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const itemAtIndex = cardArray[randomIndex];
    cardArray[randomIndex] = cardArray[i];
    cardArray[i] = itemAtIndex;
  }
}
// Call createCards function
overlay.classList.add('hidden');
  createCards();


cardArray.forEach((card) => {
  //  Adds Event Listener to Cards - Assigns Flipped Class to Flipped Cards
  card.addEventListener('click', () => {
    //  Prevents Event Listener/Counter Iteration (Double Click) If classList.length > 1
    if (card.classList.length < 2) {
      //  Push Clicked Cards Into flippedCards Array
      flippedCards.push(card);
      //  Push Clicked Cards Into startTrigger Array
      startTrigger.push(card);
      //  limit the number of flipped cards to two
      if (flippedCards.length < 3) {
        card.classList.add('flipped');
        // Track totalClicks
        totalClicks += 1;
        //  Update Counter
        counter.innerHTML = totalClicks;
      }
      //  Trip Start Time
      if (startTrigger.length === 1) {
		timer.reset(60);
		timer.start(1000);
      }
      //  Test Rating With Every Click
      rating();
      //  Test flippedCards for Pair Match
      checkFlipped();
    }
  });
  //  Append Shuffled Cards to HTML Document
  cardDeck.appendChild(card);
});


//This function reloads/restarts the game
function refreshPage(){
	   // pauses countdown
      timer.stop();
	  Swal.fire({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Biztos benne?',
		text: "A jelenlegi folyamat megszakad!",
		type: 'warning',
			animation: false,
		customClass: 'animated tada',
		showCancelButton: true,
		confirmButtonColor: '#9BCB3C',
		cancelButtonColor: '#EE0E51',
		confirmButtonText: 'Igen, újraindítom a játékot!',
		cancelButtonText: 'Nem, visszavonom!',
		cancelButtonAriaLabel: 'Folytatom a játékot!',
	  }).then((result) => {
		if (result.value) {
			location.reload();
			 overlay.classList.add('hidden');
		}
		else 
			timer.start(1000);
		})
};

/******************************************  G A M E   E N D   ***************************************/
// example use
var timer;
 
$(document).ready(function(e) 
{
    timer = new _timer
    (
        function(time)
        {
            if(time == 0)
            {
                timer.stop();
                alert('Sajnos lejárt az idő, próbáld újra!');
				location.reload();
				overlay.classList.add('hidden');
			
				  for (let i = 0; i < flippedCards.length; i += 1) {
					flippedCards[i].classList.remove('flipped');
				  }
				  //  Clear flippedCards Array
				  flippedCards.splice(0, 12);
  
            }
        }
    );
    timer.reset(60);
    timer.mode(0);
});