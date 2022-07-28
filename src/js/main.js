const route = getRoute()
const cfe = {
    "id" : "",
    "name" : ""
}
// End Point version 3
const EP_CFEAPI = "https://script.google.com/macros/s/AKfycbzKGirgCgKgIrCfSaKNOgEwcO2Gt5PTrPyerMwhceN5KuQawnHqZ5sj2uYjAb1-arZE/exec" +
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
    const url = EP_CFEAPI + "opencalls" + "&id=" + route.id    
    if (cfe.id === route.id) {
        // skip fetch
        displayExhibitName(cfe.name)
    } else {

        fetch(url) 
        .then(resp => resp.json())
        .then(resp => {
            cfe.closedate = resp[0]            
            cfe.id = resp[1]
            cfe.name = resp[2]
            displayExhibitName(cfe.name)
        })
        .catch()        
    }

}


//document.addEventListener("DOMContentLoaded", getRoute)
document.addEventListener("DOMContentLoaded", loadPageElements)
document.addEventListener("DOMContentLoaded", mode)
