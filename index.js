var pizzapi = require('pizzapi');
var map;

var davidHsu = new pizzapi.Customer({
   address: '7030 Preinkert Dr., College Park, MD, 20742',
   firstName: 'David',
   lastName: 'Hsu',
   phone: '1-800-The-White-House',
   email: 'br'
});

/*Creates the map using the Google Maps API*/
function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 38.8977, lng: 77.0365},
      zoom: 18,
      zoomControl: true,
      zoomControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT
      },
      streetViewControl: false,
    });
	map.setOptions({minZoom:6});

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        map.setCenter(pos);

      }, function() {
        handleLocationError(true);
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false);
    }
}

/*Drops a pizza marker on the map at the specified location*/
function dropPizza(pos) {
  var pizza = 'images/pizza.png';
  var timestamp = new Date().getTime();
  var marker = new google.maps.Marker({
    position: pos,
    map: map,
    timestamp: timestamp,
    animation: google.maps.Animation.DROP,
    title: 'Itza Pizza!',
    icon: pizzza,
  });
}


//function findStores(customer) {
   pizzapi.Util.findNearbyStores(
      davidHsu.address,
      'Delivery',
      function(storeData) {
         storeData.result.Stores.forEach(function(entry) {
            var mystore = new pizzapi.Store({
               ID: entry.StoreID
            });

            console.log(entry.AddressDescription);

            var pos = getPos(entry.AddressDescription);

            dropPizza(pos);

            var order = makeOrder(mystore.ID);

            order.validate(function(result) {
               console.log("Order Made");
            });

         //order.price(function(result) {
         //   console.log("Price!");
         //});


         });
      //console.log('\n\n##################\nNearby Stores\n##################\n\n',storeData.result.Stores);
   }
);
//}
function makeOrder(storeID) {
   var order = new pizzapi.Order({
      customer: davidHsu,
      storeID: storeID,
      deliveryMethod: 'Delivery'
   });

   order.addItem(new pizzapi.Item({
      code: '14SCREEN',
      options: {},
      quantity: 1
   }));

   /*
   var cardInfo = new order.PaymentObject();
   cardInfo.Amount = order.Amounts.Customer;
   cardInfo.Number = cardNumber;
   cardInfo.CardType = order.validateCC(cardNumber);
   cardInfo.Expiration = '0224';
   cardInfo.SecurityCode = '102';
   cardInfo.PostalCode = '20854';
   order.Payments.push(cardInfo);
   */

   return order;
}
