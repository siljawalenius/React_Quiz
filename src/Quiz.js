//this is a class component 
//use snippet rce

import React, { Component } from 'react'
import {quizData} from './quizQuestions'
import './style.css'

export class Quiz extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             userAnswer: null,
             currentIndex: 0,
             options: [],
             quizEnd: false, //true only for the last quiz question
             score:0,
             nextDisabled:true //disable the next button until a user selects an option
        }
    }
    
    loadQuiz = () =>{
        const {currentIndex} = this.state; //get current quiz state
        this.setState(() => {
            return {
                question: quizData[currentIndex].question,
                options: quizData[currentIndex].options,
                answer: quizData[currentIndex].answer
            }
        })
    }

    handleNextQuestion = () =>{ //load and handle next question
        const {userAnswer, answer, score} = this.state  //get current values of all these things

        if(userAnswer === answer ){ //if user answer is correct, increase the score
            this.setState({
                score: score + 1
            })
        }
        this.setState({
            currentIndex: this.state.currentIndex + 1,
            userAnswer:null
        })
    }

    handleFinish = () =>{
        const {userAnswer, answer, score} = this.state

        if (userAnswer === answer){
            this.setState({
                score: score + 1 
            })
        }


        if(this.state.currentIndex === quizData.length -1){
            this.setState({
                quizEnd:true
            })
        }
    }

    componentDidMount() {
        this.loadQuiz();
    }

    checkAnswer = (answer) =>{ //take an answer, allow the user to click next
        this.setState({
            userAnswer: answer,
            nextDisabled:false
        })
    }

    componentDidUpdate(prevProps, prevState){ //you have to include these params always
        const {currentIndex} = this.state; //new current index now

        //we only want to set a new q when the index has changed
        if(this.state.currentIndex !== prevState.currentIndex){
            this.setState(() => {
                return {
                    question: quizData[currentIndex].question,
                    options: quizData[currentIndex].options,
                    answer: quizData[currentIndex].answer
                }
            });
        }
    }
    



    render() {
        //get all the states we need
        const {question, options, currentIndex, userAnswer, quizEnd} = this.state

        //if the quiz ends, do this 

        if (quizEnd){
            return(
                <div>
                    <h1>Nice job! Your score is {this.state.score} / 5</h1>

                    <button onClick = {() => window.location.reload(false)}> Try Again? </button>
                </div>

            )
        }



        return (
            <div>
                <h2>{question}</h2>
                <span>{`Question ${currentIndex+1} of ${quizData.length}`}</span>
                {
                    options.map(option => 
                        <p key = {option.id} className = {`options ${userAnswer === option ? "selected" : null}`} 
                        onClick = {() => this.checkAnswer(option)}
                        >
                            {option}
                        </p>
                    )
                }

                {currentIndex < quizData.length -1 && 
                <button disabled = {this.state.nextDisabled}
                        onClick = {this.handleNextQuestion}
                    >
                    Next Question
                </button>}
                {currentIndex === quizData.length-1 && 
                    <button onClick = {this.handleFinish} 
                    disabled = {this.state.nextDisabled}>
                        Finish
                    </button>}
            </div>
        )
    }
}

export default Quiz
