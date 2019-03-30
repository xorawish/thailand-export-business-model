/**
 * @param {th.exp.transport.CreateTransport} transportData
 * @transaction
 */

function    createTransport(transportData) {

    var timeNow = new Date().getTime();
    var schedTime = new Date(transportData.schedule).getTime();
    if(schedTime < timeNow){
        throw new Error("Scheduled time cannot be in the past!!!");
    }

    return getAssetRegistry('th.exp.transport.Transport')
    
        .then(function(transportRegistry){
            var  factory = getFactory();

            var  NS =  'th.exp.transport';

            var  transportId = generateTransportId(transportData.transportNumber,transportData.schedule);
            var  transport = factory.newResource(NS,'Transport',transportId);
            transport.transportNumber = transportData.transportNumber;

            var route = factory.newConcept(NS,"Route");

            route.origin = transportData.origin;
            route.destination = transportData.destination;
            route.schedule = transportData.schedule;

            transport.route = route;
            
            var event = factory.newEvent(NS, 'TransportCreated');
            event.transportId = transportId;
            emit(event);

            return transportRegistry.add(transport);
        });
}

function generateTransportId(transportNum, schedule){
    var dt = new Date(schedule)

    var month = dt.getMonth()+1;
    if((month+'').length == 1)  month = '0'+month;
    var dayNum = dt.getDate();
    if((dayNum+'').length == 1)  dayNum = '0'+dayNum;

    return transportNum+'-'+month+'-'+dayNum+'-'+(dt.getFullYear()+'').substring(2,4);
}

/**
 * @param {th.exp.transport.AssignCargo} transportCargoData
 * @transaction
 * **/

function    AssignCargo(transportCargoData){
    var transportRegistry={}
    return getAssetRegistry('th.exp.transport.Transport').then(function(registry){
        transportRegistry = registry
        return transportRegistry.get(transportCargoData.transportId);
    }).then(function(transport){
        if(!transport) throw new Error("Transport : "+transportCargoData.transportId," Not Found!!!");
        var   factory = getFactory();
        var   relationship = factory.newRelationship('th.exp.cargo','Cargo',transportCargoData.cargoId);
        transport.cargo = relationship;
        return transportRegistry.update(transport);
    }).then(function(){
        
        var event = getFactory().newEvent('th.exp.transport', 'CargoAssigned');
        event.transportId = transportCargoData.transportId;
        event.cargoId = transportCargoData.cargoId;
        emit(event);
    }).catch(function(error){
        throw new Error(error);
    });

}