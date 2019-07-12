const exoress = require('express')
const app = exoress()
const port =8080
app.use('/' , exoress.static('website'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
    


