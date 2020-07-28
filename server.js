// requirement
require('dotenv').config();

// dependencies 

const pg=require('pg');
const superagent=require('superagent');
const cors=require('cors');
const express=require('express');
const methodOverride=require('method-override');

// main variables 

const PORT=process.env.PORT || 3030 ;
const client = new pg.Client(process.env.DATABASE_URL);
const app=express();

// uses 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public')); 
app.set('view engine', 'ejs');
// app.use(errorHandler);
// app.use('*',notFoundHandler);

// listen to port 

client.connect().then(()=>{

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})

})

// //// check
// app.get('/',homeHandler);
// function homeHandler(req,res){
//     res.status(200).send('it works good');
// }

/////////////////////////////
// route definition

app.get('/',homeHandler);

app.get('/addToDb',addToDbHandler);

app.get('/selectData',selectDataHandler);

app.get('/details/:joke_id',detailsHandler);

app.put('/update/:update_id',updateHandler);

app.delete('/delete/:delete_id',deleteHandler);





// route handlers 

function homeHandler(req,res){

let url=`https://official-joke-api.appspot.com/jokes/programming/ten`;

superagent.get(url).then(data=>{

    let jokesArray=data.body.map(val=>{
        return new Jokes(val);
    })
    res.render('index',{data:jokesArray});
})

}
/////////////////////////////////////////////////////

// constructor function

function Jokes(val){

this.type=val.type || 'no type';
this.setup=val.setup || 'no setup';
this.punchline=val.punchline || 'no punchline'

}

//////////////////////////////
function addToDbHandler(req,res){

    let {type,setup,punchline}=req.query;
    let sql=`INSERT INTO joketable ( type,setup,punchline ) VALUES ($1,$2,$3) ;`;
    let safeValues=[type,setup,punchline ];

    client.query(sql,safeValues).then(()=>{

        res.redirect('/selectData');
    })


}
/////////////////////////////////////////////////////

function selectDataHandler(req,res){

let sql=`SELECT * FROM joketable ;`;

client.query(sql).then(result=>{

    res.render('pages/favorite',{data:result.rows});
})

}

///////////////////////////////////////////

function detailsHandler(req,res){

    let param=req.params.joke_id;
    let sql=`SELECT * FROM joketable WHERE id=$1 ;`;
    let safeValues=[param];

    client.query(sql,safeValues).then(result=>{

        res.render('pages/details',{data:result.rows[0]});
    })


}

//////////////////////////////////////

function updateHandler(req,res){

    let {type,setup,punchline}=req.body;
    let param=req.params.update_id;
    let sql=`UPDATE joketable SET type=$1,setup=$2,punchline=$3 WHERE id=$4 ;`;

    let safeValues=[type,setup,punchline,param ];


client.query(sql,safeValues).then(()=>{

        res.redirect(`/details/${param}`);
    })

}


////////////////////////////////////////////


function deleteHandler(req,res){

    let param=req.params.delete_id;
    let sql=`DELETE FROM joketable WHERE id=$1 ;`;

    let safeValues=[param ];


client.query(sql,safeValues).then(()=>{

        res.redirect('/selectData');
    })

}


///////////////////////////////////////////////////






















// //////////////////
// // error handler 
// function errorHandler(err,req,res){
//     res.status(500).send(err);
// }

// // not found handler
// function notFoundHandler(req,res){
//     res.status(404).send('page not found');
// }