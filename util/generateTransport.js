const bnUtil = require('../bn-connection-util');
const transportNamespace = 'th.exp.transport';
const transactionType = 'CreateTransport';

// Change this for populating other versions
bnUtil.cardName='admin@export';
if(process.argv.length < 3){
    console.log("Usage: node populate-th-exp   <card-name> ")
    console.log("Populating Network using a card: ",bnUtil.cardName);
} else {
    bnUtil.cardName = process.argv[2];
    console.log("Populating Network using a card: ",bnUtil.cardName);
}
bnUtil.connect(main);

function main(error){
    if(error){
        console.log(error)
        process.exit(1)
    }
    createTransports('CG101','EWR','SEA',new Date(), 3, 11,00);
    let nextDay = new Date(new Date().getTime()+24*60*60*1000);
    createTransports('CG102','SEA','ATL', nextDay, 3, 14,30);
    nextDay = new Date(nextDay.getTime()+2*24*60*60*1000);
    createTransports('CG103','ATL','EWR', nextDay, 3, 18,15);
}

function  createTransports(number, origin, destination, startDate, frequency, departureTimeHour, departureTimeMinute){

    var x = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    x = new Date(x.getTime()+departureTimeHour*60*60*1000+departureTimeMinute*60*1000);

    let    transports = [];
    const  bnDef = bnUtil.connection.getBusinessNetwork();
    const  factory = bnDef.getFactory();

    var ctr = 0 ;
    const iterations = 4;
    for(var i=0; i < iterations; i++){
        let sched = new Date(x.getTime()+(i+1)*frequency*24*60*60*1000);
        
        let transaction = factory.newTransaction(transportNamespace,transactionType);
        transaction.setPropertyValue('transportNumber',number);
        transaction.setPropertyValue('origin', origin);
        transaction.setPropertyValue('destination' , destination);
        transaction.setPropertyValue('schedule' , sched);
        bnUtil.connection.submitTransaction(transaction).then(()=>{
            console.log('Added Transport : ',number,ctr);
            ctr++;
        }).catch((error)=>{
            console.log(error);
            bnUtil.connection.disconnect();
        })
    }
}