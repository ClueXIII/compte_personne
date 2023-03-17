const btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();

// Adresse MAC de l'Arduino Bluetooth
const address = '20:13:08:28:12:42'; // AT+ADDR? => 2013:8:281242

// UUID du service Bluetooth
const uuid = '0000ffe0-0000-1000-8000-00805f9b34fb'; //celon chat gpt

// Connecte à l'Arduino Bluetooth
btSerial.connect(address, 1, function() {
    console.log('Connected to Arduino Bluetooth.');

    // Récupère la valeur envoyée par l'Arduino
    btSerial.on('data', function(buffer) {
        const data = buffer.readUInt8(0);
        console.log('Received data: ' + data);
    });
}, function() {
    console.log('Failed to connect to Arduino Bluetooth.');
});

// Ferme la connexion Bluetooth
btSerial.close();

