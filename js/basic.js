//Select Element
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let quizInfo = document.querySelector(".quiz-info");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector('.countdown');

//Set Options
let currentIndex = 0;
let rightAnswers= 0;
let countdownInterval;


function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200){

            let questionsObject = JSON.parse(this.responseText); 
 //    console.log(questionsObject);

            let questionsCount = questionsObject.length;
 //    console.log(questionsCount);

            //Create Bullets + Set questions Count
            createBullets(questionsCount);
             //Set the number of question in span tag
 
      // Start CountDown
      countdown(3, questionsCount);

             //Add Question Data
             AddQuestionData(questionsObject[currentIndex], questionsCount);
    
    //click on submit
    submitButton.onclick = () => {
        //get right answer
        let theRightAnswer = questionsObject[currentIndex].right_answer;
   //     console.log(theRightAnswer);

        //Increase Index
        currentIndex++;

        //checkAnswer()
        checkAnswer(theRightAnswer, questionsCount);

        //remove previos quistion
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        
             //Add Question Data
             AddQuestionData(questionsObject[currentIndex], questionsCount);

             // handle bullets class
handleBullets();

             //start countDown
             clearInterval(countdownInterval);

             // Timer 
          //   startTimer();
             countdown(3, questionsCount);
// Show results
showResults(questionsCount);

     };
            }
    };

    myRequest.open("GET", "html_questions.json", true);
    myRequest.send();
}

getQuestions();


function createBullets(num) {
    countSpan.innerHTML = num;
  // Create Bullet
    for (let i = 0; i < num; i++) {
        let theBullet = document.createElement("span");
    //check if it's First span
        if (i === 0) {
        theBullet.className ="on";
    }
    //Apend Bullets to main Bullet Container
    bulletsSpanContainer.appendChild(theBullet);
}
}

function AddQuestionData(obj, count) {
    if (currentIndex < count){
      
        // console.log('obj');
  //console.log('count');

//create h2 question title
let questionTitle = document.createElement("h2");
//create h2 question text
let questionText = document.createTextNode(obj.title);

//appand text to h2
questionTitle.appendChild(questionText);

//appand text to the quiz area
quizArea.appendChild(questionTitle);


//create the answers
for(let i=1; i<=4; i++) {
    //create main answer div
    let mainDiv = document.createElement("div");

    //add class to main div
    mainDiv.className = 'answer';

    //create Radio Input
    let radioInput = document.createElement("input");

    //add type + Name + Id + Data Attribute
    radioInput.name="question";
    radioInput.type="radio";
    radioInput.id=`answer_${i}`;
    radioInput.dataset.answer = obj[`answer_${i}`];


    //make first option cheched by default
    if (i===1){
        radioInput.checked=true;
    }
    //create label
    let theLabel = document.createElement("label");

    //Add for attribute
    theLabel.htmlFor= `answer_${i}`;

    //create label text
    let theLabelText = document.createTextNode(obj[`answer_${i}`]);

    //add the text to label
    theLabel.appendChild(theLabelText);

    //Add Input + label to main div
    mainDiv.appendChild(radioInput);
    mainDiv.appendChild(theLabel);

    //append all divs to anwers area
    answersArea.append(mainDiv);
}
}
   

}

function checkAnswer (rAnswer, count){
//    console.log(rAnswer);
 //   console.log(count);
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;
    
    for (let i = 0 ; i < answers.length; i ++) {
 if (answers[i].checked){
    theChoosenAnswer = answers[i].dataset.answer;
}
}
//console.log(`RightAnswer Is: ${rAnswer}`);
//console.log(`ChoosenAnswer Is: ${theChoosenAnswer}`);

if (rAnswer === theChoosenAnswer) {
rightAnswers++;
//console.log("Bravo Good Answer");
}
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = 'on';
        }
    });
}

function showResults(count) {
    let theResults;
    if (currentIndex === count) {
       // console.log("Questions IIs Finished");
       quizArea.remove();
       answersArea.remove();
       submitButton.remove();
       bullets.remove();
 
       if (rightAnswers > count /2 && rightAnswers < count){
theResults = `<span class="good">Good</span>, (( ${rightAnswers} From ${count} Is Your Result))`;
resultsContainer.style.backgroundImage="url(https://media.giphy.com/media/9Www30GgMqxrkJTsX5/giphy.gif) ";
}
       else if (rightAnswers === count) {
        theResults = `<span class="perfect">"Great Job! You Got All Right Answers Of This Quiz With A Score of :"</span> , (( ${rightAnswers}  From ${count} Is Your Result))`;
        resultsContainer.style.backgroundImage="url(https://media.giphy.com/media/9Www30GgMqxrkJTsX5/giphy.gif) ";
    } else {
        theResults = `<br><span class="bad">"Sorry Try Again"</span>, <br> (( ${rightAnswers} From ${count} Is Your Result))`;
        resultsContainer.style.backgroundImage="url(https://cdn.vectorstock.com/i/preview-1x/07/87/bad-test-result-teen-icon-flat-isolated-vector-40910787.jpg) ";
    }

       resultsContainer.innerHTML = theResults;
       resultsContainer.style.padding = '40px';
        resultsContainer.style.marginTop = "10px";
       resultsContainer.style.height = "270px";
         resultsContainer.style.backgroundRepeat  = 'no-repeat';
     }

}

// timer

function countdown(duration, count){
    if (currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {
             minutes = parseInt(duration/60);
             seconds = parseInt(duration%60);

             minutes = minutes <10 ? `0${minutes}`: minutes ;
             seconds = seconds <10 ? `0${seconds}`: seconds ;

             countdownElement.innerHTML = `${minutes}:${seconds}`;

             if (--duration < 0){
                clearInterval(countdownInterval);
//console.log("Finished"); 
//showResults(count);
submitButton.click();
             }
            }, 1000);
}
} 
