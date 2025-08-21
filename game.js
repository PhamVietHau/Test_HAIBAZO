//Get all DOM needed
const squareContainer = document.querySelector("#squareContainer");
const buttonStart = document.querySelector(".start-game");
const inputPoint = document.querySelector(".input-point");
const buttonReset = document.querySelector(".reset-game");
const timePlay = document.querySelector(".time-play");
const nextPointDisplay = document.querySelector(".next-point");
const footer = document.querySelector(".footer");
const circleSize = 40;
const notification= document.querySelector(".notification");
const btnAutoPlayOn = document.querySelector(".auto-play-on")
const btnAutoPlayOff = document.querySelector(".auto-play-off")
//Important variable
var playTime = 0;
var interVal;
var timeoutCircle;


//get input point
function getValueInputPoint() {
    var point = inputPoint.value;
    return point;
}
//X
 function randomX() {
    //get with of the container
    var containerWidth = squareContainer.offsetWidth;
    var maxX = containerWidth - circleSize;
    //set ramdom X
    var X = Math.floor(Math.random() * (maxX + 1));
    return X;
 }
//Y
 function randomY() {
    //get  height of the container
    const containerHeight = squareContainer.offsetHeight;
    const maxY = containerHeight - circleSize;
    //set random Y
    const Y = Math.floor(Math.random() * (maxY + 1));
    return Y;
 }
//create circle
function createCircle(n){
    const circle = document.createElement('div');
    //set size circle
    circle.style.width = `${circleSize}px`;
    circle.style.height = `${circleSize}px`;
    //create circle
    circle.classList.add('circle');
    circle.style.textAlign = 'center';
    circle.textContent = n;
    circle.setAttribute('value', n);
    return circle;
}

//randomly circles
function randomCircle(point) {
    var count = 0;
    var amountCircles = point;
    var fragment = document.createDocumentFragment(); //Fragment to hold circles before appending to DOM
    for (let i = 0; i < point; i++) {
        var circle = createCircle(i + 1);
        // Set random position 
        var x = randomX();
        var y = randomY();
        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;
        // Set z-index to stack circles
        circle.style.zIndex = amountCircles;
        amountCircles--;
        count++;
        fragment.appendChild(circle); // append each circle to the fragment
    }
    squareContainer.appendChild(fragment); // append the fragment to the container
}
//Time play
function updateTimer() {
     interVal = setInterval(() => {
        playTime+=0.10;
        timePlay.textContent = playTime.toFixed(1); // fix at 1/10
    }, 100); // Update every second
}
///////////////////////////////
//CONTROLL 
// Reset game 
var reset = false; // Set reset to true
function resetGame() {
    playTime =0; // Call the updateTimer function with reset
    squareContainer.innerHTML = '';
    reset = true; // Set reset to true
    arrMain = [];
    arrTemp = [];
    console.log(arrTemp);
    
    // Reset the point removal
    // timePlay.textContent = '0.0'; // Reset the timer display
    startGame(); // Restart the game
}

var checkLength = squareContainer.children.length===0;
var myNodelist;
//Start game
function startGame() {
    reset = false; // Reset the reset flag
    var point = getValueInputPoint();
    var isValidNumber = !isNaN(point) && point > 0; 
    if(!isValidNumber) {
        return alert("Please enter a valid number");
    }
    squareContainer.innerHTML =''; 
    randomCircle(point);
    //Display
    notification.innerHTML = "Let's start";
    notification.style.color="unset"
    clearInterval(autoPlayInterval)
    clearInterval(interVal);
    updateTimer(); // Start the timer
    buttonStart.style = "display: none"; // Disable the start button
    buttonReset.style = "display: block"; // Enable the reset button
    btnAutoPlayOn.style.display='block'
    btnAutoPlayOff.style.display='none'
    myNodelist = document.querySelectorAll(".circle");
    console.log(myNodelist.length);
    footer.style.display = "block"; // Show the footer
    arrMain=[];
    arrTemp =[];
    copyValueNodelist(); // Copy the values of the node list
    nextPointDisplay.innerHTML = myNodelist[0].getAttribute('value'); // Display the first value in the next point
    
}

function winGame()  {
    clearInterval(interVal);
    buttonStart.style = "display: block"; 
    buttonReset.style = "display: none";
    notification.innerHTML = "All Cleared";
    notification.style.color = "green"
    playTime = 0; // Reset play time
    myNodelist = []; // Reset the node list
};

function looseGame()  {
    clearInterval(interVal);
    stopCountDownCircle(listDowncount);
    buttonStart.style = "display: block"; 
    buttonReset.style = "display: none";
    // myNodelist.style.tran
    stopPointFading();
    notification.innerHTML = "You lose!";
    notification.style.color = "red"
    playTime = 0; // Reset play time
    myNodelist = []; // Reset the node list
};



//////////////////////////////
//GAME PLAY
var arrMain //coppy all values of nodelist
var arrTemp //shift values of array main to set time out
function copyValueNodelist() {
    for(let i = 0; i < myNodelist.length; i++) {
        arrMain.push(parseInt(myNodelist[i].getAttribute('value')));
    }
}


    //Envent click point
    squareContainer.addEventListener('click', function(event) {
        var checkCircle = event.target.classList.contains('circle');
        var checkLenght = myNodelist.length > 0;
        //If Check click circle out of if statement, it will make game immediatly loose  
            if (checkCircle && checkLenght) {
            //Place here to prevent click on blank space
            var clickValue = parseInt(event.target.getAttribute('value'));
            var valueRequired = arrMain.shift(); // Get the first value from the main arra
            // Check if the clicked circle is the next in sequence
            var checkValue = clickValue === valueRequired?
                pointRemove(valueRequired): looseGame();
            }
    });

//Fade out point after 3s
function pointRemove(value){
    var timeOut = 3;//seconds
    arrTemp.push(value)
    var lenghtOfTemp = arrTemp.length;
    var lenghOfNodeList = myNodelist.length;
    //display time count when arrtemp value equal to nodelist value at lasted index in arrtemp
    if(arrTemp[lenghtOfTemp-1] == myNodelist[lenghtOfTemp-1].getAttribute('value')) {
        displayTimeOutOfCircle(lenghtOfTemp-1);
    }
    for(let i = 0; i < lenghtOfTemp; i++) {
        myNodelist[i].classList.add('true-click');
        if(lenghtOfTemp === lenghOfNodeList) {
                footer.style.display = 'none';
        }else {
            nextPointDisplay.innerHTML = myNodelist[i+1].getAttribute('value');
        }
        timeoutCircle = setTimeout(() => {
            //If It's the last value then set time out to win
            var lastValueNodeList = parseInt(myNodelist[lenghOfNodeList-1].getAttribute('value'));
            var lastValueTemp = parseInt(arrTemp[lenghtOfTemp-1]);
            var checkContainTrueClick = myNodelist[lenghOfNodeList-1].classList.contains('true-click')
            if(lenghtOfTemp === lenghOfNodeList && lastValueTemp === lastValueNodeList && checkContainTrueClick ) {
                winGame();
                return;
            }
        }, timeOut * 1000);

    }  
}
// Display time count down in circle
var listDowncount=[]
function displayTimeOutOfCircle(i) {
    var timeoutCircle = 3; 
    //create object to contain interval every circle
    var obj = {
        interval: null
    }
    listDowncount.push(obj);
    //Create tag p count down
    const circleTimeCount = document.createElement('p');
    circleTimeCount.style.fontSize = '12px';
    circleTimeCount.style.color = 'white';  
    circleTimeCount.style.margin = '0';
    
    obj.interval = setInterval(() => {
        timeoutCircle -= 0.1; // Decrease the timeout by 0.1 seconds
        if( !(timeoutCircle > 0)) {
            clearInterval(obj.interval); // Clear the interval when timeout reaches 0
        }
        circleTimeCount.textContent = timeoutCircle.toFixed(1); // Update the text content
        
    }, 100); // Update every ms
    console.log(listDowncount)
    myNodelist[i].appendChild(circleTimeCount)
}
///////////////////
//LOOSE EVENT
function stopCountDownCircle(list) {
    // clearInterval(CircleInterVal);
    list.forEach(timer => clearInterval(timer.interval))
}    

function stopPointFading(){
    myNodelist.forEach(circle => {
        const currentOpacity = getComputedStyle(circle).opacity;
        circle.style.transition = "none"; // turn off transition 
        circle.style.opacity = currentOpacity; // hold current opacity
    });
}
///////////////////
//AUTO PLAY
var autoPlayInterval;
function AutoPlayOn(second){
    autoPlayInterval = setInterval(function() {
        if (arrMain.length > 0) {
            var valueRequired = arrMain.shift(); // Get the first value from the main array
            // Simulate clicking the next circle in sequence
            pointRemove(valueRequired);
        } else {
            clearInterval(autoPlayInterval);
        }
    }, second*1000); // Adjust interval as needed
    btnAutoPlayOn.style.display='none'
    btnAutoPlayOff.style.display='block'

}
function AutoPlayOff(){
    clearInterval(autoPlayInterval)      
    btnAutoPlayOn.style.display='block'
    btnAutoPlayOff.style.display='none'
}