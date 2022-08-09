import PETS_DATA from "../pets.js";

const CAROUSEL_BTN_LEFT = document.querySelector("#btn-left");
const CAROUSEL_BTN_RIGHT = document.querySelector("#btn-right"); 
const CAROUSEL = document.querySelector(".slider-carousel");
const CAROUSEL_CARDS_LEFT = document.getElementById("cards-left");
const CAROUSEL_CARDS_RIGHT = document.getElementById("cards-right");
const CAROUSEL_CARDS_ACTIVE = document.getElementById("cards-visible");
CAROUSEL_BTN_LEFT.addEventListener("click", shiftLeft);
CAROUSEL_BTN_RIGHT.addEventListener("click", shiftRight);

let carouselCards = document.querySelectorAll(".pet-card");
for (let card of carouselCards) {
  card.addEventListener("click", openModal);
}

let onScreenCardsNumber = 3;

const viewport = window.visualViewport;
viewport.addEventListener('resize', ()=>{
  let cardNum = getVisibleCardsNumber();
  if (cardNum > 1  && BURGER_BTN.classList.contains("open")) { //no burger now but burger-menu is open - hide burger-meny
    BURGER_BTN.classList.remove("open");
    BURGER_MENU.style = "right: -320px";
    BURGER_MENU.classList.remove("opacity");
    document.body.classList.remove("modal-open");
  }

  if (cardNum > onScreenCardsNumber) {
    let cardsToAdd = generateCards(cardNum - onScreenCardsNumber);
    for (let i = 0; i< cardsToAdd.length; i++) {
      CAROUSEL_CARDS_ACTIVE.appendChild(cardsToAdd[i]);
    }
    onScreenCardsNumber = cardNum;
  }
});


function createCardByTemplate(petImgPath, petName, petType, petID) {
  
  const card = document.createElement("div");

  card.innerHTML = `<img src="${petImgPath}" alt="${(petType + ' '+ petName)}" class="pet-card-img">
  <p class="pet-card-text">${petName}</p>
  <button class="btn">Learn more</button>`;

  card.classList.add("pet-card");
  card.dataset.cardid = petID;

  return card; //DOM elmnt
}


function getVisibleCardsNumber() { //how many cards are on screen depending on resol. 3 / 2 / 1
  
  if (window.matchMedia("(min-width: 1280px)").matches) {return 3;} //1280px+  - 3 cards
  if (window.matchMedia("(min-width: 768px)").matches) {return 2;}   //768px+  - 2 cards 
  return 1;  // less tahn 768px - 1 card
}


function generateCards(cardNumber) { //cardNumber is 1 or 2 or 3

  //get IDs of curently displayed cards
  let visibleCardIDs = [];
  for (let card of CAROUSEL_CARDS_ACTIVE.childNodes) {
    if (card.classList && card.classList.contains("pet-card") &&  visibleCardIDs.length < cardNumber ) {
      visibleCardIDs.push(card.dataset.cardid);
    };
  }

  let restrictedIDs = visibleCardIDs.slice(); 
  let cards = [];//of DOM elmnts
  const maxID = PETS_DATA.length;
  for(let i=0; i < cardNumber; i++ ) {
    let newID = 'pet' + ('' + (1 + Math.floor(Math.random() * maxID))).padStart(3,'0'); 
    while (restrictedIDs.includes(newID)) {
      newID = 'pet' + ('' + (1 + Math.floor(Math.random() * maxID))).padStart(3,'0');
    }
    restrictedIDs.push(newID);
    let index = Number(newID.substring(4)) - 1;
    cards.push(createCardByTemplate(PETS_DATA[index].img, PETS_DATA[index].name, PETS_DATA[index].type, PETS_DATA[index].cardID));

  }
  
  return cards;//arr of DOM elmnts
}

function shiftLeft() {
    
  //generate new cards in Right block to slide from right to left
  CAROUSEL_CARDS_LEFT.innerHTML = "";
  onScreenCardsNumber = getVisibleCardsNumber();
  let newCards = generateCards(onScreenCardsNumber);
  for (let i = 0; i< newCards.length; i++) {
    CAROUSEL_CARDS_LEFT.appendChild(newCards[i]);
  }

  //start animation
  CAROUSEL.classList.add("transition-left");

  //disable controls whole animation
  CAROUSEL_BTN_LEFT.removeEventListener("click", shiftLeft);
  CAROUSEL_BTN_RIGHT.removeEventListener("click", shiftRight);

}

function shiftRight() {
  //generate new cards in Right block to slide from right to left
  CAROUSEL_CARDS_RIGHT.innerHTML = "";
  onScreenCardsNumber = getVisibleCardsNumber();
  let newCards = generateCards(onScreenCardsNumber);
  for (let i = 0; i< newCards.length; i++) {
    CAROUSEL_CARDS_RIGHT.appendChild(newCards[i]);
  }

  //start animation
  CAROUSEL.classList.add("transition-right");

  //disable controls whole animation
  CAROUSEL_BTN_LEFT.removeEventListener("click", shiftLeft);
  CAROUSEL_BTN_RIGHT.removeEventListener("click", shiftRight);
    
}


  
  CAROUSEL.addEventListener("animationend", (animationEvent) => { //end of animation - reset listeners, classes. generate new cards
    // let cardsBlockToUpdate;
  
      
    if (animationEvent.animationName === "move-left") {
      CAROUSEL.classList.remove("transition-left");
      CAROUSEL_CARDS_ACTIVE.innerHTML = CAROUSEL_CARDS_LEFT.innerHTML;
    } else {
      CAROUSEL.classList.remove("transition-right");
      CAROUSEL_CARDS_ACTIVE.innerHTML = CAROUSEL_CARDS_RIGHT.innerHTML;
    }
    
    //rewrite active cards ? куда деваюца старые?
    carouselCards = CAROUSEL_CARDS_ACTIVE.querySelectorAll(".pet-card");
    for (let card of carouselCards) {
      card.addEventListener("click", openModal);
    }



    //add listenres back to controls
    CAROUSEL_BTN_LEFT.addEventListener("click", shiftLeft);
    CAROUSEL_BTN_RIGHT.addEventListener("click", shiftRight);
  })
//============================= caeousel


//============================= popup

const POPUP_CLOSE_BTN = document.querySelector("#btn-modal-close");
const MODAL_WIN = document.getElementById("modal-win");

POPUP_CLOSE_BTN.addEventListener("click", closeModal);
MODAL_WIN.addEventListener("click", closeModal);

function openModal(event) {
  let petID = event.target.dataset.cardid ? event.target.dataset.cardid : event.target.parentElement.dataset.cardid ;
  let pet = getPetDataByID(petID);
  
  //update modal with selected pet data
  MODAL_WIN.querySelector("#modal-img").innerHTML = `<img src="${pet.img}" alt="${pet.type + ' ' + pet.name}" class="modal-img">`;
  MODAL_WIN.querySelector("#modal-title").innerHTML = pet.name;
  MODAL_WIN.querySelector("#modal-subtitle").innerHTML = pet.type + ' - ' + pet.breed;
  MODAL_WIN.querySelector("#modal-text").innerHTML = pet.description;
  MODAL_WIN.querySelector("#modal-item-age").innerHTML = `<span class="modal-list-span">Age:</span> ${pet.age}`;
  MODAL_WIN.querySelector("#modal-item-inoculations").innerHTML = `<span class="modal-list-span">Inoculations:</span> ${pet.inoculations}`;
  MODAL_WIN.querySelector("#modal-item-deceases").innerHTML = `<span class="modal-list-span">Deseases:</span> ${pet.diseases}`;
  MODAL_WIN.querySelector("#modal-item-parasites").innerHTML = `<span class="modal-list-span">Parasites:</span> ${pet.parasites}`;


  //show modal, freeze body scroll
  MODAL_WIN.classList.remove("hidden");
  document.querySelector("body").classList.add("modal-open");


}

function closeModal(event) {
  
  // console.log(event.target.id, event.target.parentElement.id);

  if (event.target.id === "modal-win" || event.target.id === "btn-modal-close") {
    MODAL_WIN.classList.add("hidden");
    document.querySelector("body").classList.remove("modal-open");
  }

}

//============================= popup

function getPetDataByID(petID) {
  let index = Number(petID.substring(4)) - 1;
  //  cards.push(createCardByTemplate(PETS_DATA[index].img, PETS_DATA[index].name, PETS_DATA[index].type, PETS_DATA[index].cardID));
  return PETS_DATA[index];
}

//============================burger menu stuff

const BURGER_BTN = document.querySelector(".burger-icon");
const BURGER_MENU = document.querySelector(".burger-container");
const BURGER_NAV_LINKS = document.querySelectorAll(".burger-link");
BURGER_NAV_LINKS.forEach((nav) => nav.addEventListener("click", closeMenu));
BURGER_NAV_LINKS.forEach((nav) => nav.addEventListener("click", hamburgerMenu));

BURGER_BTN.addEventListener("click", toggleMenu);
BURGER_BTN.addEventListener("click", hamburgerMenu);
document.querySelector(".burger-back-click").addEventListener("click", closeMenu);
document.querySelector(".burger-back-click").addEventListener("click", hamburgerMenu);

function toggleMenu() {
  BURGER_BTN.classList.toggle("open");
}

function hamburgerMenu() {
  if (BURGER_BTN.classList.contains("open")) {
    BURGER_MENU.style = "right: 0";
    BURGER_MENU.classList.add("opacity");
    document.body.classList.add("modal-open");
    // document.querySelector(".header-container").classList.add("open");
    document.querySelector(".modal-burger-back").classList.remove("hidden");
    document.querySelector(".burger-back-click").classList.remove("hidden");
  } else {
    BURGER_MENU.style = "right: -320px";
    BURGER_MENU.classList.remove("opacity");
    document.body.classList.remove("modal-open");
    document.querySelector(".modal-burger-back").classList.add("hidden");
    document.querySelector(".burger-back-click").classList.add("hidden");
  }
}

function closeMenu(event) {
  if (event.target.classList.contains("burger-link") || 
      event.target.classList.contains("burger-back-click")) {
    BURGER_BTN.classList.remove("open");
  }
}
