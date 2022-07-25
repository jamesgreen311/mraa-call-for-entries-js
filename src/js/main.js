const route = getRoute()
const EP_CFEAPI = "https://script.google.com/macros/s/AKfycbx0NnV9wQTAkYzvIgqEms8C_HZFTRTjSs5radWTwtMj0xs6hIBm8my6QtAThuytVWY/exec" +
    "?q="
var test = true

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

function getExhibit() {
    const exhibit = route.path
    // path = oldest, get first row from Open Calls
    // path = newest, get last row from Open Calls
    // path = all others, assume exhibit id, filter Open Calls for exhibit id
    const openCalls = getOpenCalls()
    const exhibitName = ""
}

function loadPageElements() {
    fetchOpenCalls()

    console.log(route)
}


function fetchOpenCalls() {
    const url = EP_CFEAPI + "opencalls"
    fetch(url) 
    .then(resp => resp.json())
    .then(resp => {
        let name = resp[2]
        displayExhibitName(name)
    })
    .catch()
}


//document.addEventListener("DOMContentLoaded", getRoute)
document.addEventListener("DOMContentLoaded", loadPageElements)
document.addEventListener("DOMContentLoaded", mode)
