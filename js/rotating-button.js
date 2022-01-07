var listingContainers = document.getElementsByClassName("listing-conatiner");

Array.from(listingContainers).forEach((e) => {
    console.log("Adding event listener.")
    e.addEventListener("touchstart", function () {
       e.querySelector(".rotating-button").classList.toggle("hover-class");
    })
})