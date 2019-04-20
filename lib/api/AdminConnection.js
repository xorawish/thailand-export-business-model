'use strict';

// Need the card store instance
const AdminConnection = require('composer-admin').AdminConnection;

// Used as the card for all calls
const   cardNameForPeerAdmin   = "PeerAdmin@hlfv1";
const   cardNameForNetworkAdmin   = "admin@export";
const   appToBePinged = "export";

// 1. Create Admin Connection object for the fabric
var walletType = { type: 'composer-wallet-filesystem' }
var adminConnection = new AdminConnection(walletType);

// 2. Initiate a connection as PeerAdmin
return adminConnection.connect(cardNameForPeerAdmin).then(function(){

    console.log("Admin Connected Successfully!!!");
    // Display the name and version of the network app
   listBusinessNetwork();
}).catch((error)=>{
    console.log(error);
});


// Extracts information about the network
function listBusinessNetwork(){
    // 3. List the network apps
    adminConnection.list().then((networks)=>{
        console.log("1. Successfully retrieved the deployed Networks: ",networks);

        networks.forEach((businessNetwork) => {
            console.log('Business Network deployed in Runtime', businessNetwork);
         });
        // 4. Disconnect
        return adminConnection.disconnect().then(function(){
            reconnectAsNetworkAdmin();
        });

        
    }).catch((error)=>{
        console.log("Error=",error);
    });
}

// Ping the network
function reconnectAsNetworkAdmin(){
   
    // 5. Reconnect with the card for network admin
    return adminConnection.connect(cardNameForNetworkAdmin).then(function(error){
        
        console.log("2. Network Admin Connected Successfully!!!");
        // 6. Ping the BNA 
        
        adminConnection.ping(appToBePinged).then(function(response){
            console.log("Ping response from "+appToBePinged+" :",response);
            // 7. Disconnect
            adminConnection.disconnect();
        }).catch((error)=>{
            console.log("Error=",error);
        });

    });

    
}
