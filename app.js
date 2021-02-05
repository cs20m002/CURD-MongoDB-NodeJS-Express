require('./models/db');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
const employeeController = require('./controllers/employee.Controller');

const app = express()
app.use(bodyparser.urlencoded({
    extended:true
}));
app.use(bodyparser.json());


const port = 3000

app.set('views',path.join(__dirname,'/views/'));
app.engine('hbs',exphbs({extname:'hbs',defaultLayout:'mainLayout', layoutsDir:__dirname + '/views/layouts/'}));
app.set('view engine','hbs');

app.use('/', employeeController);

app.listen(port,()=>{
    console.log(`Server listening at http://localhost:${port}`)
})