"use strict";
import { PostService } from "./classes/posts-service.js";
//import { GeoLocation } from "./classes/geolocation.js";
import {API_KEY } from "./constants.js";

// Your code goes here 
// Student: Gregorio Solís Pérez
// 11893345
// 10/21/2023

const postService = new PostService();
/* const geolocation= new GeoLocation(document.getElementById("map"),
  "#alocation-container",
  "#place");
*/
const imgPreview = document.getElementById("imgPreview");
const imgInput = document.getElementById("image");
const form = document.querySelector("#newPlace");
const errorMsg = document.getElementById("errorMsg");
const rbPostLocation = document.getElementById("postLocation");
const rbPostPhoto = document.getElementById("postPhoto");
const groupPhoto = document.getElementById("photo-group");
const groupLocation= document.getElementById("location-group");
const _PHOTO=1;
const _LOCATION = 2;

let userSuggestLat=0;
let userSuggestLng =0;
let userSuggestMap=getStaticImg(0,0);
let imgOption= _PHOTO;

/*geolocation.loadBingAPI(); // enable uses of Geolocation:*/

// Radiobutton listeners
rbPostLocation.addEventListener ("click",()=>{
  groupPhoto.classList.add("d-none");
  groupLocation.classList.remove("d-none");
  loadBingAPI(API_KEY);
  window.showMap = showMap;
  imgOption = _LOCATION;
  //const center = map.getCenter();
  //createMarker(map, center, "Estás aquí");
  //geolocation.showMap();
});
rbPostPhoto.addEventListener ("click",()=>{
  groupPhoto.classList.remove("d-none");
  groupLocation.classList.add("d-none");
  imgOption = _PHOTO;
});

// Form SUBMIT
form.addEventListener("submit", e => {
  e.preventDefault(); // to disable the default behavior
  // Left another way to access the values only to remember it
  const title = form.title.value; //querySelector('#title').value;
  const description = form.description.value;//querySelector('#description').value;
  let image ="";
  if (imgOption===_PHOTO){
    image = imgPreview.src; // form.image.files[0]; //querySelector('#image').files[0];   
  } else {
    image = userSuggestMap;
  }
  const mood = form.querySelector("#mood").value;

  // Check if POST is empty
  if (title === "" || description === "" || image === undefined) {
    // Post is empty
    errorMsg.classList.remove("hidden");
    setTimeout(function () {
      errorMsg.classList.add("hidden");
    }, 3000);
    return;
  }
  // Check image size
  if (String(image).length > 1000000) {
    alert("Image too big, please select another ");
    imgInput.value = "";
    console.log(imgPreview);
    imgPreview.classList.add("d-none");
    return;
  }
  // Prepare body
  let body = getJson(imgOption,title, description, image, mood,userSuggestLat,userSuggestLng);

  postService.post(body).then(resultado => {
    console.log(resultado);
  }).catch(error => {
    console.log(error);
  });
  // Reset image preview and form
  imgPreview.classList.add("d-none");
  form.reset();

});

function getJson(option,title, description, fileName, mood, lat, lng) {
  let body = new Object();
  body.title = title;
  body.description = description;

  body.image = fileName;  //imgPreview.src ;
  // Date is not send because Server assigns in automatic
  //const date = new Date ();
  //body.date = new Date ().toString();
  body.mood = +mood;
  if (option === _LOCATION){
    body.lat = lat;
    body.lng = lng;
  }
  //return JSON.stringify(body);  it was not necesary because later on it is transform to JSON format
  return body;
}

// Listeners
form.image.addEventListener("change", () => {
  let file = form.image.files[0];

  if (file && file.type.startsWith("image")) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    
    
    reader.addEventListener("load", () => {
      imgPreview.classList.remove("d-none");
      imgPreview.src = reader.result;
    });
  }
});

// Location

getLocation().then((coords) => {
  const p = document.getElementById("coordenadas");
  p.textContent = "Latitud: " + coords.latitude + ". Longitud: " + coords.longitude  +
                              " (Precisión: " + coords.accuracy + ")";
});

function getLocation() {
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

function loadBingAPI(apiKey) {
  const script = document.createElement("script");
  script.src = `https://www.bing.com/api/maps/mapcontrol?key=${apiKey}&callback=showMap`;
  script.defer = true;
  document.body.append(script);
}

/* Para crearnos marcadores */
function createMarker(map, {latitude, longitude}, title, color = "blue") {
  // eslint-disable-next-line no-undef
  const pin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(latitude, longitude), { title, color });
  map.entities.push(pin);
}

function getStaticImg (latitude,longitude) {
  const latlon = latitude + "," + longitude;
  const imgUrl = `https://dev.virtualearth.net/REST/v1/Imagery/Map/Road/${latlon}/15?mapSize=600,300&pp=${latlon};66&mapLayer=Basemap,Buildings&key=${API_KEY}`;
  return imgUrl;
}

async function showMap() {
  const Microsoft = window.Microsoft;
  const coords = await getLocation();
  const map = new Microsoft.Maps.Map(document.getElementById("map"), {
    credentials: API_KEY,
    center: new Microsoft.Maps.Location(coords.latitude, coords.longitude),
    mapTypeId: Microsoft.Maps.MapTypeId.road,
    zoom: 16/* zoom */
  });    

  /* Activar sugerencias automáticas */

  Microsoft.Maps.loadModule("Microsoft.Maps.AutoSuggest", () => {
    const manager = new Microsoft.Maps.AutosuggestManager({ map });
    manager.attachAutosuggest("#place", "#location-container", result => {
      createMarker(map, result.location, "", "red");
      map.setView({center: result.location});
      // Las coordenadas están en result.location.latitude y result.location.longitude
      userSuggestLat= result.location.latitude;
      userSuggestLng= result.location.longitude;
      userSuggestMap = getStaticImg(userSuggestLat,userSuggestLng);
      
    });
  });

  /* Con marcadores */
  // Cada click en el mapa crea un marcador y centra el mapa en esa posición
  Microsoft.Maps.Events.addHandler(map, "click", (e) => {
    createMarker(map, e.location, "", "red");
    map.setView({center: e.location});
  });
  
}


