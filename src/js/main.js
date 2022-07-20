var route = getRoute()
var test = true

function retrieveExhibitName() {
    const id = route.id

    //fetch()
}

function displayExhibitName(name) {
    const ele = document.getElementById("exhibit-title")
    ele.innerText = name
}

function mode() {
    const hidden = document.getElementsByClassName("d-none")
    if (test) {
        // show all hidden elements
        for (i=0; i<hidden.length; i++) {
            hidden[i].classList.remove("d-none")
        }

    }
}

document.addEventListener("DOMContentLoaded", getRoute)
document.addEventListener("DOMContentLoaded", retrieveExhibitName)
document.addEventListener("DOMContentLoaded", mode)