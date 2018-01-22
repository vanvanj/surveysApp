import React, { Component } from 'react'
import {connect} from 'react-redux'
import {fetchSurveys} from '../../actions'

class SurveyList extends Component {

    componentDidMount() {
        this.props.fetchSurveys()
    }
    
    renderSurveys() {
        return this.props.surveys.map(survey => {
            return (
                <div className='card darken-1' key={survey.id}>
                    <div className='card content'>
                        <span className='card-title'>{survey.title}</span>
                        <p>
                            {survey.question}
                        </p>
                        <p className='right'>
                            sent on : {new Date(survey.dateSent).toLocaleDateString()}
                        </p>
                    </div>
                    <div className='card-action'>
                        <a>yes: {survey.yes}</a>
                        <a>no:{survey.no}</a>
                    </div>
                </div>
            )
        })
    }

    render() {
        return (
            <div>
               {this.renderSurveys} 
            </div>
        )
    }
}

const mapStateToProps = ({surveys}) => {
    return {
        surveys
    }
}

export default connect(mapStateToProps, {fetchSurveys})(SurveyList)
