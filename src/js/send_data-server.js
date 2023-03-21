const sqlite3 = require('sqlite3')
const express = require("express");
const cors = require('cors');
const app = express();


let db = new sqlite3.Database('nbr_personnes.sqlite', err => {
  if (err) throw err
  console.log('data base "nbr_personnes.db" bien active')
})

async function set_api(){
  app.use(cors())
  app.get(`https://pedago.univ-avignon.fr/~uapv2305333/compte_personnes/stats`,async (req,res) =>{
    db.all('SELECT * FROM salle_api', async (err, data) => {
      validator = 0
      for (let i = 0; i < data.length; i++) { //je ne comprend rien ici ?
        if (data[i].name === req.params.name) {
          validator = 1
          db.all('SELECT * FROM ' + req.params.name + '_players_online', (err, dataa) => {
            res.json({
              name: req.params.name,
              ip: data[i].ip,
              data: dataa
            })
          })
        }
      }
      if (validator==0){
        res.json({
          message: "Cette salle n'est pas encore en place dans notre api."
        })
      }
    })
  })
  app.get(`https://pedago.univ-avignon.fr/~uapv2305333/compte_personnes/stats`,async (req,res) =>{
    db.all('SELECT * FROM serveur_api', async (err, data) => {
      res.json({
        serveur: data
      })
    })
  })
}
set_api()

app.listen(500,() => console.log('listening on port 500'))
