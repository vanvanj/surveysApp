const _ = require('lodash')
const Path = require('path-parser')
const {URL} = require('url')
const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requireLogin')
const requireCredit = require('../middlewares/requireCredit')
const Mailer = require('../services/Mailer')
const surveyTemplate = require('../services/emailTemplates/surveyTemplate')

const Survey = mongoose.model('surveys')

module.exports = app => {
    app.get('/api/surveys', (req, res) => {
        // Survey.find({
        //     _user: req.user.id
        // }).select({
        //     recipients: false
        // }).then(surveys => {
        //     res.send((surveys));
        // })
        res.send('this is api/surveys')
    })

    app.get('/api/surveys/thanks', function(req, res) {
        res.send('thanks for voting!')
    })

    app.get('/api/surveys/:surveyId/:choice', function(req, res) {
        res.send('thanks for voting!')
    })

    //"webhook": "./sendgrid_webhook.sh"
    app.post('/api/surveys/webhooks', (req, res) => {
        const p = new Path('/api/surveys/:surveyId/:choice')
        _.chain(req.body)
            .map(req.body, event => {

                const match = p.test(pathname)
                if (match) {
                    return {
                        email: email,
                        surveyId: match.surveyId,
                        choice:match.choice
                    }
                }
            })
            .compact()
            .unionBy('email', 'surveyId')
            .each(event => {
                Survey.updateOne({
                    id: surveyId,
                    recipients: {
                        $elemMatch: {
                            email,
                            responded: false
                        }
                    }
                }, {
                    $inc :{ [choice]: 1},
                    $set :{ 'recipients.$.reponded': true}
                })
            }).exec()
            .value()

        res.send({});

    });

    app.post('/api/surveys', requireCredit, requireLogin, (req, res) => {
        const { title, subject, body, recipients } = req.body

        const survey = new Survey({
            title,
            subject,
            body,
            recipients: recipients.split(',').map(email => ({email: email.trim()}) ),
            _user: req.user.id,
            dateSent: Date.now()
        })

        const mailer = new Mailer(survey, surveyTemplate(survey))

        mailer.send().then(response => {
            survey.save()
            res.send(recipients + 'sended')
            req.user.credits -= 1
            // req.user.save().then(user => {
            // })
            res.send('email is sended')
        }).catch(err => {
            res.status(422).send(err)
        })
    })
}