document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'https://opentdb.com/api.php?amount=10&category=31&difficulty=easy&type=multiple';
  const quizContainer = document.getElementById('quiz');
  const questionElement = document.getElementById('question');
  const answersElement = document.getElementById('answers');
  const submitButton = document.getElementById('submit');
  const timerElement = document.getElementById('timer');
  const scoreContainer = document.getElementById('score-container');
  const scoreElement = document.getElementById('score');

  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let timer;
  let timeLeft = 30; // 30 seconds for each question

  // Create a new <img> element
const img = document.createElement('img');



  function startTimer() {
      timerElement.innerText = `Time left: ${timeLeft}s`;
      timer = setInterval(() => { //The setInterval() method in JavaScript repeatedly calls a function or executes a code snippet, with a fixed time delay between each call. It continues calling the function until clearInterval() is called or the window is closed.
          timeLeft--;
          timerElement.innerText = `Time left: ${timeLeft}s`;
          if (timeLeft <= 0) {
              clearInterval(timer);
              checkAnswer(); // Auto-submit when time runs out
          }
      }, 1000);
  }

  function fetchQuestions() {
      fetch(API_URL) //makes request to the API url 
      //fetch is a built-in function in java script to make network request 
          .then(response => response.json()) //converting the response to json format
          .then(data => { //once we have the response now we will
              questions = data.results; //store the list of quiz questions(response) in the questions array
              showQuestion(); //to display the questions 
          });
  }

  function showQuestion() {
      if (currentQuestionIndex >= questions.length) {
          endQuiz();
          return;
      }

      const currentQuestion = questions[currentQuestionIndex]; //geting the current question 
      questionElement.innerHTML = decodeURIComponent(currentQuestion.question); //The decodeURIComponent() function decodes a Uniform Resource Identifier (URI) component previously created by encodeURIComponent() or by a similar routine.
      //displaying the current question 
      answersElement.innerHTML = '';
      //preparing answers 
      //Create an array with the incorrect answers.
      const answers = [...currentQuestion.incorrect_answers];
      //Randomly insert the correct answer into this array.
      const correctAnswerIndex = Math.floor(Math.random() * (answers.length + 1)); 
      

      answers.splice(correctAnswerIndex, 0, currentQuestion.correct_answer);

      answers.forEach(answer => {
          const answerButton = document.createElement('button');
          answerButton.classList.add('answer');
          answerButton.innerHTML = decodeURIComponent(answer);
          answerButton.addEventListener('click', () => selectAnswer(answerButton, answer === currentQuestion.correct_answer));
          answersElement.appendChild(answerButton);
      });

      timeLeft = 30; // Reset timer
      startTimer();
  }

  function selectAnswer(button, isCorrect) {
      const buttons = document.querySelectorAll('.answer');
      buttons.forEach(btn => btn.disabled = true);
      button.style.backgroundColor = isCorrect ? 'lightgreen' : '#FFCCCB';
      if (isCorrect) {
          score++;
      }
      clearInterval(timer); 
  }

  function checkAnswer() {
      const selectedButton = document.querySelector('.answer[style]');
      if (!selectedButton) { 
        // if no such button is found (i.e., no answer has been selected)
          const buttons = document.querySelectorAll('.answer');
          buttons.forEach(btn => btn.style.backgroundColor = 'lightcoral');
      }
      setTimeout(() => {
          currentQuestionIndex++; //Increase the question index by 1 to move to the next question
          showQuestion();
      }, 1000);
  }

  function endQuiz() {
      quizContainer.style.display = 'none';
      scoreContainer.style.display = 'block';
      scoreElement.innerText = `Your score: ${score}/${questions.length}`;
  }

  submitButton.addEventListener('click', checkAnswer);
  fetchQuestions();
});
