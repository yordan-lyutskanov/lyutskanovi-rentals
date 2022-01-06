let menu = document.getElementById("navbar-items")
let menuButton = document.getElementById("navbar-menu-button")
let navbarContainer = document.getElementById("navbar-container")
const initialMenuHeight = menu.style.maxHeight
const initialNavbarHeight = navbarContainer.style.maxHeight


/* Show dropdown menu on click */
menuButton.addEventListener("click", ev => {
    console.log(`max height: ${menu.style.maxHeight}`)
    if (menu.style.maxHeight !== "0px" && menu.style.maxHeight){
        menu.style.maxHeight = "0px"
        menu.style.visibility = "hidden"
    } else {
        setTimeout(() => {
            menu.style.visibility = "visible"
        }, 200)
        menu.style.maxHeight = "200px"
    }     
})

/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    navbarContainer.style.top = "0px";
  } else {
    navbarContainer.style.top = "-150px";
}
  prevScrollpos = currentScrollPos;
} 
