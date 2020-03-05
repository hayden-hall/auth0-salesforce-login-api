# Login API for Hayden Hall Mobile App
<!-- [WIP] See the overview on the mobile app repo. -->
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Setup
1. Deploy this app to Heroku
2. Open Auth0 app and enable [Password] authentication type at advanced settings section. Then add your users.
3. Open the Heroku app setting and set config variables for Salesforce authentication.

## API 
### POST `/login`
#### Request
* Content-Type: `application/json`
* Body:
```json
{
    "email": "john@example.com",
    "password": "test1234!"
}
```

#### Reponsse
Success (200)
```json
{
    "access_token": "00D28000000W2x5!AQQAQNTgJ_KyS9.BuohNq9_Awami_.OL9MiZe24bTt75Un56KChhd7lfJ2J.R_XdgP2cvx_clufew6i9acH8FKG9wacaDdgj",
    "instance_url": "https://YOUR_INSTANCE_OR_DOMAIN.salesforce.com"
}
```

Error (401)
```
Invalid login email or password.
```
