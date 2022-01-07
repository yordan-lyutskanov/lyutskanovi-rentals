let menu = document.getElementById("navbar-items")
let menuButton = document.getElementById("navbar-menu-button")
let navbarContainer = document.getElementById("navbar-container")
let banner = document.getElementById("header-image")

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

/* When the user scrolls down, hide the navbar and slightly move the background image up. 
 * When the user scrolls up, show the navbar and slightly move the image down.
*/
var prevScrollpos = window.pageYOffset;
var position = 0;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    navbarContainer.style.top = "0px";

    if (position > 0) {
      position -= 1;
    }
  } else {
    navbarContainer.style.top = "-150px";

    if (position < 40) {
      position += 1;
  }
}
  prevScrollpos = currentScrollPos;
  banner.style.backgroundPositionY = `${position}%`;

} 

