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

app.post('/login', (req, res, next) => {
  (async () => {
    const auth0Result = await auth0.oauth.passwordGrant({
      username: req.body.email,
      password: req.body.password,
      realm: 'Username-Password-Authentication'
    });
    if (!auth0Result) {
      res.status(401).send('Invalid login email or password.');
    } else {
      await createSalesforceConnection(res);
    }
  })().catch(next);
})

app.post('/token', (req, res, next) => {
  (async () => {
    if (req.body.refreshKey !== process.env.REFRESH_KEY) {
      res.status(401).send('Invalid key.');
    }
    await createSalesforceConnection(res);
  })().catch(next);
})

async function createSalesforceConnection(res) {
  const conn = new jsforce.Connection({
    loginUrl: process.env.SALESFORCE_LOGIN_URL
  });
  const salesforceResult = await conn.login(
    process.env.SALESFORCE_CDW_USERNAME,
    process.env.SALESFORCE_CDW_PASSWORD + process.env.SALESFORCE_CDW_TOKEN
  );
  if(!salesforceResult){
    res.status(401).send('Invalid integration username, password, security token; or user locked out.');
  } else {
    const response = {
      "access_token": conn.accessToken,
      "instance_url": conn.instanceUrl,
    };
    res.send(response);
  }
}