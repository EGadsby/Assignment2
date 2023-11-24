// changed this from how it was before because this allows us to split the code into smaller cleaner sections, 
// furthermore this allows us to retrieve the access token

let express = require('express')
let cors = require('cors')
let app = express()
const spotifyController = require('./controllers/spotifyController')

app.use(cors())



app.use('/spotify', spotifyController)

let port = process.env.PORT || 8888
console.log('Listening on port ' + port + '. Go /login to initiate authentication flow.')
app.listen(port)