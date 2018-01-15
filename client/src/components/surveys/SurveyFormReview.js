//
import React from 'react';
import _ from 'lodash'
import {connect} from 'react-redux'
import formValues from 'redux-form/lib/formValues';
import formFields from './formFields'
import {withRouter} from 'react-router-dom'
import * as actions from '../../actions'

const SurveyReview = ({onCancel, formValues, submitSurvey, history}) => {

    const reviewFields = _.map(formFields, ({name, label}) => {
        return (
            <div key={name}>
                <label>{label}</label>
                <div>
                    {formValues[name]}
                </div>
            </div>
        )
    })

    return (
        <div>
            <h5>please confirm your entries</h5>
            {reviewFields}
            <button className='yellow darken-3 white-text darken-3 btn-flat' onClick={onCancel}>
                back
            </button>
            <button onClick={() => submitSurvey(formValues, history)} 
                className='green btn-flat right white-text'>
                Send Survey
                <i className='material-icons right'></i>
            </button>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    return {
        formValues: state.form.surveyForm.values
    }
}

export default connect(mapStateToProps, actions)(withRouter(SurveyReview));
