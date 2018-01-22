import axios from 'axios'
import {FETCH_USER, FETCH_SURVEYS} from './types'

export const handleToken = (token) => async dispatch => {
    const res = await axios.post('/api/stripe', token)
    dispatch({
        type: FETCH_USER, 
        payload: res.data
    })
}

export const fetchUser = () => async dispatch => {
    const res = await axios.get('/api/current_user')
    dispatch({
        type: FETCH_USER,
        payload: res.data
    })
}

export const submitSurvey = (values, history) => async dispatch => {
    //push应该放在post后面, 但是post经常response有问题, 暂时放在这里
    history.push('/surveys')
    const res = await axios.post('/api/surveys', values)
    dispatch({
        type: FETCH_USER,
        payload: res.data
    })
}

export const fetchSurveys = () => async dispatch => { 
    const res = await axios.get('/api/surveys')
    dispatch({
        type: FETCH_SURVEYS,
        payload: res.data
    })
}

