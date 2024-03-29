//sqliteviewer.flowsoft7.com => lire db

const sqlite3 = require('sqlite3')
const btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();


let db = new sqlite3.Database('nbr_personnes.sqlite', err => {
    if (err) throw err
    console.log('data base "nbr_personnes.sqlite" bien active')
  })

async function add_salle_api(salle,adrs_mac, couleur, capacite){
  db.run('CREATE TABLE IF NOT EXISTS salle_api(id INTEGER PRIMARY KEY AUTOINCREMENT,salle VARCHAR, adrs_mac VARCHAR, couleur VARCHAR, capacite INTEGER)') // on crée la table si elle n'existe pas
  db.all('SELECT * FROM salle_api', async (err, data) => { // on récupère les données de la table
    validator = 0
    for (let i = 0; i < data.length; i++) { //on compare les données de la table avec la salle que l'on veut ajouter
      if(data[i].salle === salle) {
        console.log("Cette salle est déjà en place dans l'api") //si elle existe déjà on affiche un message
        validator = 1 //on passe le validateur à 1 pour signifier que la salle existe déjà et qu'il ne faut pas la rajouter
      }
    }
    if(validator==0){ //si le validateur est à 0 on ajoute la salle
      db.run('INSERT INTO salle_api(salle,adrs_mac,couleur,capacite) VALUES(?,?,?,?)', [salle,adrs_mac,couleur,capacite]); // on ajoute la salle dans la table
      db.run('CREATE TABLE ' + salle + '_nbr_personnes(id INTEGER PRIMARY KEY AUTOINCREMENT,hour VARCHAR, nbr_personnes INTEGER)') // on crée la table pour les données de la salle
      db.all('SELECT * FROM salle_api', async (err, data) => {
      })
    }
    else {
      return 0 //on retourne 0 pour signifier que la salle existe déjà
    }
  })
}

add_salle_api("C0_21","20:13:08:28:12:42","#ffffff", 30)// on ajoute la salle C0-21

async function getdata_salle(){ // fonction qui récupère les données des salles
  let minute = new Date().getMinutes();// on récupère les minutes so edited
if (minute % 1 === 0) {// si les minutes sont un multiple de 5 alors on effectue le programme => on récupère les données toutes les 5 minutes
  db.all('SELECT * FROM salle_api', async (err, data) => { // on récupère les données de la table => les salles
    for (let i = 0; i < data.length; i++) { // on parcourt les salles
      await add_nbr_data(data[i].salle,data[i].adrs_mac) // on récupère les données de la salle grace a son nom et l'adresse mac du module bluetooh du compte personne
    }
  })
  setInterval(() => {
    db.all('SELECT * FROM salle_api', async (err, data) => {
      if (data.length !== 0){
        for (let i = 0; i < data.length; i++) {
          await add_nbr_data(data[i].salle,data[i].adrs_mac)
        }
      }
    })
  }, 10000);
} else {
  setTimeout(getdata_salle,10000)
}
}


async function add_nbr_data(salle, adrs_mac, couleur) { // fonction qui récupère les données de la salle en bluetooth
                                                        // Adresse MAC de l'Arduino Bluetooth
  const address = '20:13:08:28:12:42'; // AT+ADDR? => 2013:8:281242

// UUID du service Bluetooth
  const uuid = '00000000-0000-1000-8000-00805f9b34fb'; //selon chat gpt

// Connecte à l'Arduino Bluetooth
  btSerial.connect(address, 1, async function() {
    let i = 0;
    console.log('Connected to Arduino Bluetooth.');
    // Récupère la valeur envoyée par l'Arduino
    btSerial.on('data', function(buffer) { ////// Voir pourquoi cette fopnction s'execute plusieurs fois
      // Ferme la connexion Bluetooth
      btSerial.close();
      let bldata = parseInt(buffer,10); // Convertit le buffer en chaîne de caractères
      if (bldata < 100 && i == 1) {
        db.run('INSERT INTO ' + salle + '_nbr_personnes(hour,nbr_personnes) VALUES(?,?)', [getDateFormatted(), bldata]); // on ajoute les données dans la table de la salle (si cela ne marche pas, rajouter un await devant getDateFormatted())
        db.all('SELECT * FROM ' + salle + '_nbr_personnes', (err, data) => { // on récupère les données de la table de la salle
          console.log(data) //et on les affiche
          if (err)
            throw err;
        })
      }
      i++;
    });
  }, function() {
    console.log('Failed to connect to Arduino Bluetooth.');
    // Ferme la connexion Bluetooth
    btSerial.close();
  });
}

function getDateFormatted() {
  var now = new Date();
  var hour = (now.getHours() < 10 ? "0" + now.getHours() : now.getHours())
  var minutes = (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes())
  return hour + ":" + minutes;
}

getdata_salle();
