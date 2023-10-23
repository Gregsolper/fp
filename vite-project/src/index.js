"use strict";
import { PostService } from "./classes/posts-service.js";

let postList = new Object();
let postListArray = [];
//* let form = document.getElementById("newPlace");
//* let imgPreview = document.getElementById("imgPreview");
//* let errorMsg = document.getElementById("errorMsg");
let postContainer = document.getElementById("postContainer");
const dateOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: false,
};
const searchInput = document.querySelector("nav .form-control[name='search']");
const postService = new PostService();


window.onload = function () {
  getAllPosts();
};

async function getAllPosts() {
  try {
    //postList = await i.getListPost();       
    postList = await postService.getall();
    showPost(postList);
  } catch (e) {
    console.log("Index error on getAllPosts: " + e);
  }

}


function showPost(postList) {
  //console.log (" showpost: "+postList);
  // it has to look in the object for each element
  clearContainer();
  postList.forEach(function (element) {
    //console.log (element);
    postListArray.push(element);
    buildCard(element);
  });
}

function clearContainer() {
  // Erase all content from the container
  while (postContainer.firstChild) {
    postContainer.removeChild(postContainer.firstChild);
  }
}

function buildCard(element) {


  // Create the root element
  const card = document.createElement("div");
  card.classList.add("card", "mb-4", "shadow");

  // Notice should be numeric comparisson          <-- mood
  if (+element.mood === 1) card.classList.add("border-success");
  else if (+element.mood === 2) card.classList.add("border-danger");

  // Create the image element
  const image = document.createElement("img");
  image.classList.add("card-img-top");
  image.src = element.image;  //  <--             load image

  // Append the image element to the card element
  card.appendChild(image);

  // Create the card body element
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  // Create the card title element
  const cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");
  cardTitle.textContent = element.title; //   <---"Restaurant name";

  // Create the card text element
  const cardText = document.createElement("p");
  cardText.classList.add("card-text");
  cardText.textContent = element.description; // <-- "This is the description.";

  // Append the card title and card text elements to the card body element
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);

  // Append the cardBody to the card element
  card.appendChild(cardBody);

  // Create the card footer element
  const cardFooter = document.createElement("div");
  cardFooter.classList.add("card-footer", "bg-transparent");

  // Create the row element
  const row = document.createElement("div");
  row.classList.add("row");

  // Create the avatar element
  const avatar = document.createElement("div");
  avatar.classList.add("col-auto", "avatar", "ps-1", "pe-1");

  // Create the avatar image element
  const avatarImage = document.createElement("img");
  avatarImage.classList.add("rounded-circle");
  avatarImage.src = "./img/avatar.png";

  // Append the avatar image element to the avatar element
  avatar.appendChild(avatarImage);
  //-----------------------------------------------
  // Create detail
  const nameDate = document.createElement("div");
  nameDate.classList.add("col");

  // Create the name element
  const name = document.createElement("div");
  name.classList.add("name");
  name.textContent = "Bad guy";

  // Create the date amd small elements
  const date = document.createElement("div");
  const small = document.createElement("small");
  small.classList.add("text-muted");
  small.textContent = new Intl.DateTimeFormat("en-US", dateOptions).format(new Date(element.date)); // "21/9/2019 15:52:45";  //to do TODAY DATE

  //Append small to date division
  date.appendChild(small);

  //Append name and date to nameDate div
  nameDate.appendChild(name);
  nameDate.appendChild(date);

  // Create the delete division
  const divDelete = document.createElement("div");
  divDelete.classList.add("col-auto");
  const btnDelete = document.createElement("button");
  btnDelete.classList.add("btn", "btn-danger", "mr-3", "h-100", "delete");

  btnDelete.textContent = "Delete";
  divDelete.appendChild(btnDelete);

  // Append the name and date elements to the row element
  row.appendChild(avatar);
  row.appendChild(nameDate);
  row.appendChild(divDelete);

  // Create div thumbs
  const divThumbs = document.createElement("div");
  divThumbs.classList.add("col-auto");

  // Create the thumbs up element
  const thumbsUp = document.createElement("i");
  thumbsUp.classList.add("fa-regular", "fa-thumbs-up", "me-3");

  // Create the thumbs down element
  const thumbsDown = document.createElement("i");
  thumbsDown.classList.add("fa-regular", "fa-thumbs-down");

  // Turn on Likes acoording with theinformation
  if (element.likes === true) {
    thumbsUp.classList.add("text-primary");
  } else if (element.likes === false) {
    thumbsDown.classList.add("text-danger");
  }

  // Append the thumbs up and thumbs down elements to the row element
  divThumbs.appendChild(thumbsUp);
  divThumbs.appendChild(thumbsDown);
  row.appendChild(divThumbs);

  // Append the row element to the card footer element
  cardFooter.appendChild(row);

  // Append the card footer element to the card element
  card.appendChild(cardFooter);

  // Append the card element to the DOM
  postContainer.appendChild(card);

  // Add a click event listener to each thumbs up icon
  thumbsUp.addEventListener("click", () => {
    // Add the text-primary class if it"s not present already
    if (!thumbsUp.classList.contains("text-primary")) {
      thumbsUp.classList.add("text-primary");
      postService.postVote(element.id, true);
    } else {
      // Remove the text-primary class if it"s present
      thumbsUp.classList.remove("text-primary");
      postService.deleteVote(element.id);
    }

    // Remove the text-danger class from the thumbs down icon
    if (thumbsDown.classList.contains("text-danger"))
      thumbsDown.classList.remove("text-danger");


  });


  // Add a click event listener to each thumbs down icon
  thumbsDown.addEventListener("click", () => {
    // Remove the text-danger class if it"s present
    if (thumbsDown.classList.contains("text-danger")) {
      thumbsDown.classList.remove("text-danger");
      postService.deleteVote(element.id);
    } else {
      // Add the text-danger class if it"s not present already
      thumbsDown.classList.add("text-danger");
      postService.postVote(element.id, false);
    }

    // Remove the text-primary class from the thumbs up icon
    if (thumbsUp.classList.contains("text-primary"))
      thumbsUp.classList.remove("text-primary");


  });

  // Add a click event listener to delete button  
  btnDelete.addEventListener("click", () => {
    postService.deletePost(element.id).then(() => { getAllPosts(); });

  });

}

searchInput.addEventListener("keyup", function () {
  const searchQuery = searchInput.value.toLowerCase();

  clearContainer();

  postListArray.forEach(element => {
    if (typeof (element.title) === "string" && element.title.toLowerCase().includes(searchQuery)) {
      buildCard(element);
    }
  });

});

