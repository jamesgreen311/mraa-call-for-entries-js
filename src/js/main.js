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
// End Point version 9
const EP_CFEAPI = "https://script.google.com/macros/s/AKfycbw4pRaF9F7xIL9-SbgFsgU7LbD9alJzXA0zAk5Hw7huoAUezzFsMadrpz089l7NXIw/exec" +
    "?q="
var test = true
var uploads = []

function displayExhibitName(name) {
    const ele = document.getElementById("exhibit-title")
    ele.innerText = name
}

function displayMember(member) {
    const artistNameElement = document.getElementById("artist-name")
    const artistPhoneElement = document.getElementById("artist-phone")
    const validMemberElement = document.getElementById("valid-member")
    const notExhibitingMemberElement = document.getElementById("not-exhibiting-member")
    const notActiveMemberElement = document.getElementById("not-active-member")
    const invalidMemberElement = document.getElementById("invalid-member")

    document.getElementById("artist-name").innerText = ""
    if (member.status !== "notvalid") {
        artistNameElement.innerText = member.firstname + " " + member.lastname
        artistPhoneElement.innerText = member.phone

        const activeexhibitor = isMember(member, "active", ["exhibiting", "honorary"])  
        if (activeexhibitor) {
            validMemberElement.classList.remove('d-none')  
            notActiveMemberElement.classList.add('d-none')
            notExhibitingMemberElement.classList.add('d-none')
            allowAccess()  
        } else {
            if (member.status !== "active") {
                notActiveMemberElement.classList.remove('d-none')
                invalidMemberElement.classList.add('d-none')
            }
            if (member.type !== "exhibiting" && member.type !== "honorary") {
                notExhibitingMemberElement.classList.remove('d-none')
                invalidMemberElement.classList.add('d-none')
            }
        } 
    } else {
        invalidMemberElement.classList.remove('d-none')        
    }

}

function displayUploads(uploads) {
    const fetchingBlock = document.getElementById("fetching-uploads")
    const uploadHistoryFound = document.getElementById("upload-history-found")
    const uploadHistoryNotFound = document.getElementById("upload-history-notfound")
    const uploadHistoryTable = document.getElementById("upload-history-table")
    const uhtBody = uploadHistoryTable.getElementsByTagName("tbody")[0]

    fetchingBlock.classList.add('d-none')
    if (uploads.length>0) {
        // build table body
        for(let i=0; i<uploads.length; i++) {
            let row = document.createElement("tr")
            let col1 = document.createElement("td")
            let col2 = document.createElement("td")
            col1.innerText = uploads[i][0]
            col2.innerText = uploads[i][1]
            row.appendChild(col1)
            row.appendChild(col2)
            uhtBody.appendChild(row)
        }
        uploadHistoryFound.classList.remove('d-none')
    } else {
        uploadHistoryNotFound.classList.remove('d-none')
    }
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

function allowAccess() {
    const memberAccess = document.getElementsByClassName("member-access")

    // show all hidden elements
    let allMemberAccess = memberAccess.length
    for (i=allMemberAccess-1; i>=0; i--) {
        memberAccess[i].classList.remove("d-none")
    }
}

function resetErrorMessages() {
    const notExhibitingMemberElement = document.getElementById("not-exhibiting-member")
    const notActiveMemberElement = document.getElementById("not-active-member")
    const invalidMemberElement = document.getElementById("invalid-member")
    
    invalidMemberElement.classList.add('d-none')   
    notActiveMemberElement.classList.add('d-none') 
    notExhibitingMemberElement.classList.add('d-none')
}

function loadPageElements() {
    fetchOpenCalls()
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
    const uploadHistoryBlock = document.getElementById("upload-history")

    artistDetailBlock.classList.remove('d-none')
    uploadHistoryBlock.classList.remove('d-none')

    resetErrorMessages()

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

            // attempt to fetch any uploads for this member
            fetchUploads(cfe, member)

        } else {
            member.email = id
            member.firstname = "n/a"
            member.lastname = "n/a"
            member.phone = "n/a"
            member.status = "notvalid"
            member.type = "n/a"

        }
        displayMember(member)
    })
    .catch()  
}

function fetchUploads(cfe, member) {
    const p = {
        'artist' : member.email,
        'event' : cfe.id,
        'key' : 'id'
    }
    const url = EP_CFEAPI + "uploads" + "&id=" + JSON.stringify(p)

    fetch(url) 
    .then(resp => resp.json())
    .then(resp => {
        uploads = [...resp]
        displayUploads(uploads)
    })
}

function isMember(member, status, type) {
    return (member.status===status && type.includes(member.type))
}

function emailValidate() { 
    const emailAddress = document.getElementById("artistEmail").value
    const form = document.getElementById("form-artist-info")

    if (form.checkValidity()) {
        // fetch member
        fetchMember(emailAddress)

    } else {
        // error handling by Bootstrap
    }
}

document.addEventListener("DOMContentLoaded", loadPageElements)
//document.addEventListener("DOMContentLoaded", mode)
document.getElementById("loginButton").addEventListener("click", emailValidate)
document.getElementById("form-artist-info").addEventListener("submit", (event) => {
    event.preventDefault()
})