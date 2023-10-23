
import {API_KEY } from "../constants.js";
export class GeoLocation {
  /*
  let mapDiv;
  let mapInput;
  let mapSearchBox;
  */
 
  constructor (mapDiv,mapInput,mapSearchBox) {
    this.mapDiv=mapDiv;
    this.mapInput=mapInput;  
    this.mapSearchBox=mapSearchBox;
  }

  loadBingAPI() {
    const script = document.createElement("script");
    script.src = `https://www.bing.com/api/maps/mapcontrol?key=${API_KEY}&callback=showMap`;
    script.defer = true;
    document.body.append(script);
    
  }

  /* Para crearnos marcadores */
  createMarker(map, { latitude, longitude }, title, color = "blue") {
    // eslint-disable-next-line no-undef
    const pin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(latitude, longitude), { title, color });
    map.entities.push(pin);
  }

  getLocation() {
    return new Promise((resolve, reject) => {
      
      navigator.geolocation.getCurrentPosition(
        pos => {
          resolve(pos.coords);
        },
        error => {
          switch (error.code) {
          case error.PERMISSION_DENIED: // User didn't allow the web page to retrieve location
            reject("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE: // Couldn't get the location
            reject("Location information is unavailable.");
            break;
          case error.TIMEOUT: // The maximum amount of time to get location information has passed
            reject("The request to get user location timed out.");
            break;
          default:
            reject("An unknown error occurred.");
            break;
          }
        }
      );
    });
  }

  async showMap()   {  // requiere que le pasemos map o quizas al ejecutarlo lo obtenga
    const Microsoft = window.Microsoft;
    
    const coords = await this.getLocation();
    //console.log ("coordenadas");
    //console.log (coords);
    
    const mapi = document.createElement("h1");
    mapi.textContent ="Map preview";
    this.mapDiv.appendChild(mapi);

    const map = new Microsoft.Maps.Map(this.mapDiv), {
      credentials: API_KEY,

      center: new Microsoft.Maps.Location(coords.latitude, coords.longitude),
      mapTypeId: Microsoft.Maps.MapTypeId.road,
      zoom: 16/* zoom */
    };

    /* Activar sugerencias automáticas */

    Microsoft.Maps.loadModule("Microsoft.Maps.AutoSuggest", () => {
      const manager = new Microsoft.Maps.AutosuggestManager({ map });
      manager.attachAutosuggest("#place", "#location-container", result => {
        this.createMarker(map, result.location, "", "red");
        map.setView({ center: result.location });
        // Las coordenadas están en result.location.latitude y result.location.longitude
      });
    });

    /* Con marcadores */
    // Cada click en el mapa crea un marcador y centra el mapa en esa posición
    Microsoft.Maps.Events.addHandler(map, "click", (e) => {
      this.createMarker(map, e.location, "", "red");
      map.setView({ center: e.location });
    });



  }

}