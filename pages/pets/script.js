import PETS_DATA from "../pets.js";

const PAGE_BTN_FIRST_PAGE = document.getElementById("page-btn-first-page");
const PAGE_BTN_PREV_PAGE = document.getElementById("page-btn-prev-page");
const PAGE_BTN_NEXT_PAGE = document.getElementById("page-btn-next-page");
const PAGE_BTN_LAST_PAGE = document.getElementById("page-btn-last-page");
const PAGE_DISPLAY = document.getElementById("page-display-number");
const petsContainer = document.querySelector(".pet-cards-container");

const PETS_NUM = 48;
let cardsPerPage = 8;
let pagesTotalNumber = 6; // 48 / cards per page
let petsPages = []; // main arr - of petsids, without repetitions in 3, 6, 8
let currentPageNumber = 1;

PAGE_BTN_FIRST_PAGE.addEventListener("click", showFirstPage);
PAGE_BTN_PREV_PAGE.addEventListener("click", showPrevPage);
PAGE_BTN_NEXT_PAGE.addEventListener("click", showNextPage);
PAGE_BTN_LAST_PAGE.addEventListener("click", showLastPage);


function showFirstPage() {
  if (currentPageNumber != 1) {
    if (currentPageNumber === pagesTotalNumber) {//enable right btns if we moved from lastst page
      PAGE_BTN_LAST_PAGE.classList.add("enabled");
      PAGE_BTN_NEXT_PAGE.classList.add("enabled");
      PAGE_BTN_LAST_PAGE.classList.remove("disabled");
      PAGE_BTN_NEXT_PAGE.classList.remove("disabled");
      PAGE_BTN_NEXT_PAGE.addEventListener("click", showNextPage);
      PAGE_BTN_LAST_PAGE.addEventListener("click", showLastPage);
    }

    currentPageNumber = 1;
    // redraw page, disable *fight* buttons
    
    redrawPetPage(currentPageNumber, cardsPerPage);


    //at first page - disable left btns
    PAGE_BTN_FIRST_PAGE.classList.add("disabled");
    PAGE_BTN_PREV_PAGE.classList.add("disabled");
    PAGE_BTN_FIRST_PAGE.classList.remove("enabled");
    PAGE_BTN_PREV_PAGE.classList.remove("enabled");
    PAGE_BTN_FIRST_PAGE.removeEventListener("click", showFirstPage);
    PAGE_BTN_PREV_PAGE.removeEventListener("click", showPrevPage);

  }

}

function showPrevPage() {
  currentPageNumber--;

  // redraw page, disable *left* buttons if it is first page

  redrawPetPage(currentPageNumber, cardsPerPage);


  if (currentPageNumber === 1) {
    //disable left btns
    PAGE_BTN_FIRST_PAGE.classList.add("disabled");
    PAGE_BTN_PREV_PAGE.classList.add("disabled");
    PAGE_BTN_FIRST_PAGE.classList.remove("enabled");
    PAGE_BTN_PREV_PAGE.classList.remove("enabled");
    PAGE_BTN_FIRST_PAGE.removeEventListener("click", showFirstPage);
    PAGE_BTN_PREV_PAGE.removeEventListener("click", showPrevPage);
  }
  if (currentPageNumber === pagesTotalNumber - 1) { // moved from last to pre-last
    //enable right btns
    PAGE_BTN_LAST_PAGE.classList.add("enabled");
    PAGE_BTN_NEXT_PAGE.classList.add("enabled");
    PAGE_BTN_LAST_PAGE.classList.remove("disabled");
    PAGE_BTN_NEXT_PAGE.classList.remove("disabled");
    PAGE_BTN_NEXT_PAGE.addEventListener("click", showNextPage);
    PAGE_BTN_LAST_PAGE.addEventListener("click", showLastPage);
    
  }
  
}

function showNextPage() {
  currentPageNumber++;
  // redraw page;
  

  redrawPetPage(currentPageNumber, cardsPerPage);
  
  

  if (currentPageNumber === pagesTotalNumber) {
    //disable right btns
    PAGE_BTN_LAST_PAGE.classList.add("disabled");
    PAGE_BTN_NEXT_PAGE.classList.add("disabled");
    PAGE_BTN_LAST_PAGE.classList.remove("enabled");
    PAGE_BTN_NEXT_PAGE.classList.remove("enabled");
    PAGE_BTN_NEXT_PAGE.removeEventListener("click", showNextPage);
    PAGE_BTN_LAST_PAGE.removeEventListener("click", showLastPage);
  }
  if (currentPageNumber === 2) { // moved from first to second
    //enable left btns
    PAGE_BTN_FIRST_PAGE.classList.add("enabled");
    PAGE_BTN_PREV_PAGE.classList.add("enabled");
    PAGE_BTN_FIRST_PAGE.classList.remove("disabled");
    PAGE_BTN_PREV_PAGE.classList.remove("disabled");
    PAGE_BTN_FIRST_PAGE.addEventListener("click", showFirstPage);
    PAGE_BTN_PREV_PAGE.addEventListener("click", showPrevPage);
    
  }

}

function showLastPage() {
  if (currentPageNumber != pagesTotalNumber) {

    if (currentPageNumber === 1) {//enable left btns if we moved from 1st page
      PAGE_BTN_FIRST_PAGE.classList.add("enabled");
      PAGE_BTN_PREV_PAGE.classList.add("enabled");
      PAGE_BTN_FIRST_PAGE.classList.remove("disabled");
      PAGE_BTN_PREV_PAGE.classList.remove("disabled");
      PAGE_BTN_FIRST_PAGE.addEventListener("click", showFirstPage);
      PAGE_BTN_PREV_PAGE.addEventListener("click", showPrevPage);
    }

    currentPageNumber = pagesTotalNumber;
    // redraw page, disable *fight* buttons
    redrawPetPage(currentPageNumber, cardsPerPage);


    //at last page - disable right btns
    PAGE_BTN_LAST_PAGE.classList.add("disabled");
    PAGE_BTN_NEXT_PAGE.classList.add("disabled");
    PAGE_BTN_LAST_PAGE.classList.remove("enabled");
    PAGE_BTN_NEXT_PAGE.classList.remove("enabled");
    PAGE_BTN_NEXT_PAGE.removeEventListener("click", showNextPage);
    PAGE_BTN_LAST_PAGE.removeEventListener("click", showLastPage);
  }
}

const viewport = window.visualViewport;
viewport.addEventListener('resize', () => {
  resetPageNumbers();
  redrawPetPage(currentPageNumber, cardsPerPage);
} );


function resetPageNumbers() {
   //  todo on resize - recalc petsperpage, pagenember, shift to right page start, redraw pets, check buttons disabled status enbele-disable
  let newCardsNum = getCardsPerPageOnResize();
  if (newCardsNum != cardsPerPage) {
    let currentTopIndex = (currentPageNumber - 1)*cardsPerPage;
    cardsPerPage = newCardsNum;
    pagesTotalNumber = Math.floor(PETS_NUM / cardsPerPage);
    currentPageNumber = Math.floor(currentTopIndex / cardsPerPage) + 1;
  }
};

function getCardsPerPageOnResize() { //how many cards are on screen depending on resol. 8/ 6 /3
  
  if (window.matchMedia("(min-width: 1280px)").matches) {return 8} //1280px+  - 8 cards
  if (window.matchMedia("(min-width: 768px)").matches) {return 6}   //768px+  - 6 cards 
  return 3;  // less tahn 768px - 3 cards
}




function createCardList(pagesTotalNumber, cardsPerPage) {
  let arrOfIDs = []; // plain array of pseudo random PETS_NUM pet ids  - sets of 8 unique ids
   
  const maxID = PETS_DATA.length;

  for (let i = 0; i < pagesTotalNumber; i++) {
    let restrictedIDs = [];
    for (let k = 0; k < cardsPerPage; k++) {
      let newID = 'pet' + ('' + (1 + Math.floor(Math.random() * maxID))).padStart(3,'0'); 
      while (restrictedIDs.includes(newID)) {
        newID = 'pet' + ('' + (1 + Math.floor(Math.random() * maxID))).padStart(3,'0');
      }
      restrictedIDs.push(newID);
      arrOfIDs.push(newID);
    }
  }
  return arrOfIDs;
}

function getPetDataByID(petID) {
  let index = Number(petID.substring(4)) - 1;
  //  cards.push(createCardByTemplate(PETS_DATA[index].img, PETS_DATA[index].name, PETS_DATA[index].type, PETS_DATA[index].cardID));
  return PETS_DATA[index];
}

function updatePetCardHTML(petImgPath, petName, petType) {
  
  // const card = document.createElement("div");

  let innerHTMLstring = `<img src="${petImgPath}" alt="${(petType + ' '+ petName)}" class="pet-card-img">
  <p class="pet-card-text">${petName}</p>
  <button class="btn">Learn more</button>`;

  // card.classList.add("pet-card");
  // card.dataset.cardid = petID;

  return innerHTMLstring; //string
}

function redrawPetPage(currentPageNumber, cardsPerPage) {
  
  let index = (currentPageNumber -1)*cardsPerPage;
  let maxIndex = index + cardsPerPage; 

  PAGE_DISPLAY.innerHTML = currentPageNumber;
  
  //disable butns listnrs
  PAGE_BTN_FIRST_PAGE.removeEventListener("click", showFirstPage);
  PAGE_BTN_PREV_PAGE.removeEventListener("click", showPrevPage);
  PAGE_BTN_NEXT_PAGE.removeEventListener("click", showNextPage);
  PAGE_BTN_LAST_PAGE.removeEventListener("click", showLastPage);

  for (let petCard of petsContainer.childNodes) {
    if (petCard.classList && petCard.classList.contains("pet-card") && index < maxIndex) {
      let currentPet = getPetDataByID(petsPages[index]);
      petCard.dataset.cardid = currentPet.cardID;
      petCard.innerHTML = updatePetCardHTML(currentPet.img, currentPet.name, currentPet.type);
      index++;
    }
  }

  //enable butns listnrs
  PAGE_BTN_FIRST_PAGE.addEventListener("click", showFirstPage);
  PAGE_BTN_PREV_PAGE.addEventListener("click", showPrevPage);
  PAGE_BTN_NEXT_PAGE.addEventListener("click", showNextPage);
  PAGE_BTN_LAST_PAGE.addEventListener("click", showLastPage);


}

//=============popup

let pageCards = document.querySelectorAll(".pet-card");
for (let card of pageCards) {
  card.addEventListener("click", openModal);
}

const MODAL_WIN = document.getElementById("modal-win");
const POPUP_CLOSE_BTN = document.querySelector("#btn-modal-close");

MODAL_WIN.addEventListener("click", closeModal);
POPUP_CLOSE_BTN.addEventListener("click", closeModal);


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

//=============popup

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
    // document.querySelector(".header-container").classList.remove("open");
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



//=============

resetPageNumbers();
petsPages = createCardList(pagesTotalNumber, cardsPerPage); // onload, on refresh will be rebuilded
redrawPetPage(currentPageNumber, cardsPerPage);

// console.log(currentPageNumber, cardsPerPage,pagesTotalNumber );
// console.log('reloaded  ', Date.now());
// console.log(petsPages);