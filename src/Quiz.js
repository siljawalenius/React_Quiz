//this is a class component
//use snippet rce

import React, { Component } from "react";
import { quizData } from "./quizQuestions";
import "./style.css";
import MetaTags from "react-meta-tags";

const url = "https://opentdb.com/api.php?amount=5&category=25&type=multiple";

let questions = [];
let availableQuestions = [];

const getQuestions = async () => {
  return fetch(url)
    .then((response) => response.json()) //turn the response into a json file

    .then((loadedQuestions) => {
      //console.log(loadedQuestions.results)
      questions = loadedQuestions.results.map((loadedQuestion) => {
        const formattedQuestion = {
          question: loadedQuestion.question,
        };

        //console.log(formattedQuestion)
        availableQuestions.push(formattedQuestion);
        //console.log(availableQuestions)
        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
        answerChoices.splice(
          formattedQuestion.answer - 1,
          0,
          loadedQuestion.correct_answer
        );

        answerChoices.forEach((choice, index) => {
          formattedQuestion["choice" + (index + 1)] = choice;
        });

        //console.log ("answers" + availableOptions)
        return formattedQuestion;
      });
    });
};

export class Header extends Component {
  render() {
    return (
      <div className="wrapper">
        <MetaTags>
          <title>React Quiz</title>
          <meta
            id="meta-description"
            name="description"
            content="Some description."
          />
          <meta id="og-title" property="og:title" content="MyApp" />
          <meta id="og-image" property="og:image" content="path/to/image.jpg" />
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        </MetaTags>
      </div>
    );
  }
}

export class Quiz extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //state params we need to see whats up currently
      userAnswer: null, //user's input answer
      currentIndex: 0, //current question number
      options: [], //answer options
      quizEnd: false, //true only for the last quiz question
      score: 0, //user score
      nextDisabled: true, //disable the next button until a user selects an option
      currentQuestion: null, //current question text
    };
  }

  loadQuiz = async () => {
    await getQuestions();
    availableQuestions = [...questions];

    const { currentIndex } = this.state; //get current quiz state

    let answerString = `choice` + availableQuestions[currentIndex].answer;

    this.setState(() => {
      return {
        question: availableQuestions[currentIndex].question,
        options: [
          availableQuestions[currentIndex].choice1,
          availableQuestions[currentIndex].choice2,
          availableQuestions[currentIndex].choice3,
          availableQuestions[currentIndex].choice4,
        ],
        answer: availableQuestions[currentIndex].answerString,
      };
    });
  };

  handleNextQuestion = () => {
    //load and handle next question
    const { userAnswer, answer, currentIndex, score, options } = this.state; //get current values of all these things

    //let answerString = `choice` + availableQuestions[currentIndex].answer;
    let userResponse = availableQuestions[currentIndex].answer;

    if (userAnswer === options[userResponse - 1]) {
      //if user answer is correct, increase the score
      this.setState({
        score: score + 1,
      });
      console.log("correct");
    }
    this.setState({
      currentIndex: this.state.currentIndex + 1,
      userAnswer: null,
    });
  };

  handleFinish = () => {
    const { userAnswer, answer, currentIndex, score, options } = this.state;

    let userResponse = availableQuestions[currentIndex].answer;

    if (userAnswer === options[userResponse - 1]) {
      this.setState({
        score: score + 1,
      });
      console.log("correct");
    }

    if (this.state.currentIndex === quizData.length - 1) {
      this.setState({
        quizEnd: true,
      });
    }
  };

  componentDidMount() {
    this.loadQuiz();
    //console.log(questions)
  }

  checkAnswer = (answer) => {
    //take an answer, allow the user to click next
    this.setState({
      userAnswer: answer,
      nextDisabled: false,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    //you have to include these params always
    const { currentIndex } = this.state; //new current index now

    let answerString = `choice` + availableQuestions[currentIndex].answer;
    //console.log("asnwerstring : " + answerString)

    //we only want to set a new q when the index has changed
    if (this.state.currentIndex !== prevState.currentIndex) {
      this.setState(() => {
        return {
          question: availableQuestions[currentIndex].question,
          options: [
            availableQuestions[currentIndex].choice1,
            availableQuestions[currentIndex].choice2,
            availableQuestions[currentIndex].choice3,
            availableQuestions[currentIndex].choice4,
          ],
          answer: availableQuestions[currentIndex].answerString,
        };
      });
    }
  }

  render() {
    //get all the states we need
    const { question, options, currentIndex, userAnswer, quizEnd } = this.state;

    //if the quiz ends, do this

    if (quizEnd) {
      return (
        <div>
          <h1>Nice job! Your score is {this.state.score} / 5</h1>

          <button onClick={() => window.location.reload(false)}>
            {" "}
            Try Again?{" "}
          </button>
        </div>
      );
    }

    return (
      <div>
        <h2>{question}</h2>
        <span className="questionNum">{`Question ${currentIndex + 1} of ${
          quizData.length
        }`}</span>
        {options.map((option, i) => (
          <p
            key = {i}
            className={`options ${userAnswer === option ? "selected" : null}`}
            onClick={() => this.checkAnswer(option)}
          >
            {option}
          </p>
        ))}

        {currentIndex < quizData.length - 1 && (
          <button
            disabled={this.state.nextDisabled}
            onClick={this.handleNextQuestion}
          >
            Next Question
          </button>
        )}
        {currentIndex === quizData.length - 1 && (
          <button
            onClick={this.handleFinish}
            disabled={this.state.nextDisabled}
          >
            Finish
          </button>
        )}
      </div>
    );
  }
}

export default Quiz;
