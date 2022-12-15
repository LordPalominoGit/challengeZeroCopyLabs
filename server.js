const express = require("express");

const bodyParser= require('body-parser');
const low = require('lowdb')
const Filesync = require('lowdb/adapters/FileSync')

const adapter = new Filesync('users.json')
const db = low(adapter);

const app = express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.listen(3000,function(){
console.log('Listening on port: 3000');
});

function login(_email,_password,users){
    var user =users.find(x=> x.email==_email && x.password==_password);
    return user;
}

app.post('/login', (req, res) => {
    const users=db.get("users").value();
    user =login(req.body.mail,req.body.password,users); 
    if(user != undefined){        
        res.render("profile.ejs",{user:user})
    }else{
        res.render("index.ejs",{haserror:true})
    }
});

app.post('/edit', (req, res) => {
    const id=req.body._id;
    const age=req.body.age;
    const fname=req.body.fname;
    const lname=req.body.lname;
    const eyeColor=req.body.eyeColor;
    const company=req.body.company;
    const phone=req.body.phone;
    const address=req.body.address;

    const name= {first:fname,last:lname};
    
    db.get("users").find({_id:id}).assign({age:age,eyeColor:eyeColor,company:company,phone:phone,address:address,name:name}).write();

    const users=db.get("users").value();
    const user =users.find(x=> x._id==id);
    res.render("profile.ejs",{user:user})
});

app.get('/login', (req, res) => {
    res.render("index.ejs",{haserror:true})
});

app.get('/', (req, res) => {
    res.render("index.ejs",{haserror:false})
});
