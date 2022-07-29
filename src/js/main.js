const route = getRoute()
const cfe = {
    "closedate" : "",
    "id" : "",
    "name" : ""
}
const member = {
    "email" : "",
    "firstname" : "",
    "lastname" : "",
    "phone" : "",
    "status" : "", 
    "type" : ""
}
// End Point version 5
const EP_CFEAPI = "https://script.google.com/macros/s/AKfycbzU5UWDgWRJRdB25Ph9T79mpFtx_pqOtntDK5jbusTrRcyqid4F0KkPipMooORbswCs/exec" +
    "?q="
var test = true

function displayExhibitName(name) {
    const ele = document.getElementById("exhibit-title")
    ele.innerText = name
}

function displayMember(member, activeexhibitor) {
    const artistNameElement = document.getElementById("artist-name")
    const artistPhoneElement = document.getElementById("artist-phone")
    const validMemberElement = document.getElementById("valid-member")
    const invalidMemberElement = document.getElementById("invalid-member")

    artistNameElement.innerText = member.firstname + " " + member.lastname
    artistPhoneElement.innerText = member.phone

    if (activeexhibitor) {
        validMemberElement.classList.remove('d-none')        
    } else {
        invalidMemberElement.classList.remove('d-none')
    }

}

function displayMemberError() {
    const invalidMemberElement = document.getElementById("invalid-member")
    invalidMemberElement.innerText = "Not an MRAA member email address"
    invalidMemberElement.classList.remove('d-none')
}

function mode() {
    const hidden = document.getElementsByClassName("d-none")
    if (test) {
        // show all hidden elements
        let allhidden = hidden.length
        for (i=allhidden-1; i>=0; i--) {
            hidden[i].classList.remove("d-none")
        }

    }
}
/* 
function getExhibit() {
    const exhibit = route.path
    // path = oldest, get first row from Open Calls
    // path = newest, get last row from Open Calls
    // path = all others, assume exhibit id, filter Open Calls for exhibit id
    const openCalls = getOpenCalls()
    const exhibitName = ""
} */

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

function fetchMember(id) {
    const url = EP_CFEAPI + "member" + "&id=" + id
    const artistDetailBlock = document.getElementById("artist-detail")
    artistDetailBlock.classList.remove('d-none')

    fetch(url) 
    .then(resp => resp.json())
    .then(resp => {
        const validMember = resp.length > 0
        if (validMember) {
            member.email = resp[0]
            member.firstname = resp[1]
            member.lastname = resp[2]
            member.phone = resp[10]
            member.status = resp[4]
            member.type = resp[12]     
            
            if (isMember(member, "active", "exhibiting")) {
                displayMember(member, true)
            } else {
                displayMember(member, false)
            }
        } else {
            displayMemberError()
        }
    })
    .catch()  
}

function isMember(member, status, type) {
    return (member.status===status && member.type===type)
}

function emailValidate() { 
    let emailAddress = document.getElementById("artistEmail").value
    const form = document.getElementById("form-artist-info")

    console.log(emailAddress)
    validEmail = form.checkValidity()
    console.log(validEmail)

    if (validEmail) {
        // fetch member
        fetchMember(emailAddress)
    } else {
        // error handling by Bootstrap
    }
}

//document.addEventListener("DOMContentLoaded", getRoute)
document.addEventListener("DOMContentLoaded", loadPageElements)
//document.addEventListener("DOMContentLoaded", mode)
document.getElementById("loginButton").addEventListener("click", emailValidate)