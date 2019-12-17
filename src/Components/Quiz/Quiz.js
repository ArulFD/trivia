import React from "react";
import * as ActionTypes from "../../Store/Actions/actionTypes";
import { connect } from "react-redux";
import "./quiz.css";
import * as actions from "../../Store/Actions/index";

class Quiz extends React.Component{

    componentDidMount(){
        let gameAPI = "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple";
        this.props.Authentication(gameAPI);
    }

    shuffle = array => {
        return array.sort(() => Math.random() - 0.5);
    }

    nextHandler = (selectAns, correctAns) =>{
        let nextQuestion = {
            answerStatus: correctAns === selectAns,
            correctAns: correctAns,
            selectAns: selectAns
        };

        this.props.nextQuestion(nextQuestion, parseInt(this.props.currentQ)+1);
    }
    render(){
        let currentQuestion = [];
        for(let values in this.props.currentQuestion){
            currentQuestion[values] = this.props.currentQuestion[values];
        }
        let arrElem = {...currentQuestion.config};        
        let arrOptions = Object.values({...arrElem.incorrect_answers});
        arrOptions.push(arrElem.correct_answer);
        let options = this.shuffle(arrOptions);

        let RenderValue = <div className="question">
            <h2>Round {parseInt(currentQuestion.id)+1}/{this.props.totalQ}</h2> 
            <h3>{arrElem.question}</h3>
            <ul>
                {options.map( (elem, ind) => {
                    return <li 
                    onClick={()=> this.nextHandler(elem, arrElem.correct_answer)} 
                    key={ind}>
                        {elem}
                    </li>
                })}
            </ul>
        </div>;
        if(this.props.results.length == this.props.totalQ){
            RenderValue = <h1>YOUR SCORE  - {Math.floor((this.props.score / this.props.totalQ) * 100)}%</h1>
        }

        return RenderValue;
    }
}

const getStatesToProps = state => {
    return {
        currentQuestion: state.currentQuestion,
        currentQ: state.currentQ,
        totalQ: state.totalQ,
        score: state.score,
        results: state.results
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    Authentication: (gameAPI) => dispatch(actions.quiz(gameAPI)),
    nextQuestion: (nextQuestion, nextID) => dispatch(actions.nextQ(nextQuestion, nextID))

  }
}

export default connect(getStatesToProps, mapDispatchToProps)(Quiz);