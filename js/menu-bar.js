let menu = document.getElementById("navbar-items")
let menuButton = document.getElementById("navbar-menu-button")
let navbarContainer = document.getElementById("navbar-container")
const initialMenuHeight = menu.style.maxHeight

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
