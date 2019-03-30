/**
 * Create Transport Transaction
 * @param {th.exp.transport.CreateTransport} transportData
 * @transaction
 */
function    createTransport(transportData) {
    // 1. Get the asset registry
    return getAssetRegistry('th.exp.transport.Transport')
        .then(function(transportRegistry){
            // Now add the Transport

            // 2. Get resource factory
            var  factory = getFactory();
            var  NS =  'th.exp.transport';

            // 3. Create the Resource instance
            var  transportId = 'sample ID';  
            
            var  transport = factory.newResource(NS,'Transport',transportId);
            
            // 4. Set the relationship
            transport.transportNumber = transportData.transportNumber;

            // 5. Create a new concept using the factory & set the data in it
            var route = factory.newConcept(NS,"Route");

            route.origin = transportData.origin;
            route.destination = transportData.destination;
            route.schedule = transportData.schedule;
            transport.route = route;

            // 6. Emit the event TransportCreated
            var event = factory.newEvent(NS, 'TransportCreated');
            event.transportId = transportId;
            emit(event);

            return transportRegistry.addAll([transport]);
        });
}
