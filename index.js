const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const jsforce = require('jsforce')

const app = express()
const PORT = process.env.PORT || 5000

dotenv.config();

const AuthenticationClient = require('auth0').AuthenticationClient;
const auth0 = new AuthenticationClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.post('/login', async (req, res, next) => {
  const auth0Result = await auth0.oauth.passwordGrant({
    username: req.body.email,
    password: req.body.password,
    realm: 'Username-Password-Authentication'
  }).catch(e => {
    next(e)
  })
  if (!auth0Result) {
    res.status(401).send('Wrong email or password.');
  } else {
    const conn = new jsforce.Connection({
      loginUrl: process.env.SALESFORCE_LOGIN_URL
    })
    const salesforceResult = await conn.login(
      process.env.SALESFORCE_CDW_USERNAME,
      process.env.SALESFORCE_CDW_PASSWORD + process.env.SALESFORCE_CDW_TOKEN
    ).catch(e => {
      next(e)
    })
    const response = {
      "access_token": conn.accessToken,
      "instance_url": conn.instanceUrl
    }
    res.send(response)
  }
})

