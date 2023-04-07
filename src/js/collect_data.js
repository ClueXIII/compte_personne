const btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();

// Adresse MAC de l'Arduino Bluetooth
const address = '20:13:08:28:12:42'; // AT+ADDR? => 2013:8:281242

// UUID du service Bluetooth
const uuid = '00000000-0000-1000-8000-00805f9b34fb'; //celon chat gpt

// Connecte à l'Arduino Bluetooth
btSerial.connect(address, 1, async function() {
  console.log('Connected to Arduino Bluetooth.');

  // Récupère la valeur envoyée par l'Arduino
  btSerial.on('data', async function(buffer) {
    const data = await parseInt(buffer.toString()); // Convertit le buffer en chaîne de caractères
    console.log('Received data: ' + data); // Affiche la valeur reçue
  });
}, function() {
  console.log('Failed to connect to Arduino Bluetooth.');
});

// Ferme la connexion Bluetooth
btSerial.close();

