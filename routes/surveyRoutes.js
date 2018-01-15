const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requireLogin')
const requireCredit = require('../middlewares/requireCredit')
const Mailer = require('../services/Mailer')
const surveyTemplate = require('../services/emailTemplates/surveyTemplate')

const Survey = mongoose.model('surveys')

module.exports = app => {

    app.get('/api/surveys/thanks', function(req, res) {
        res.send('thanks for voting!')
    });

    app.post('/api/surveys/webhooks', (req, res) => {
        console.log('!!!!')

        console.log(req.body)
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
