const route = getRoute()
const cfe = {
    "closedate" : "",
    "id" : "",
    "name" : "",
    "maxentries" : "",
    "entryfee" : ""
}
const member = {
    "email" : "",
    "firstname" : "",
    "lastname" : "",
    "phone" : "",
    "status" : "", 
    "type" : "",
    "uploadcount" : ""
}
// End Point version 10
const EP_CFEAPI = "https://script.google.com/macros/s/AKfycbwncrJGgBMSMDNjmgKoucDXNXa6Y3BkXRKrWWEP8pR9gGBVmy_uMsZWgIJQRNeYLnfP/exec" +
    "?q="
var test = true
//var uploads = []
var emailAddressOld = ""

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
    const uploadHistoryFound = document.getElementById("upload-history-found")
    const uploadHistoryNotFound = document.getElementById("upload-history-notfound")
    const uploadHistoryTable = document.getElementById("upload-history-table")
    const uhtBody = uploadHistoryTable.getElementsByTagName("tbody")[0]

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
    updateMaxEntries()
}

function fetchingArtist(toggle) {
    const fetchingBlock = document.getElementById('fetching-artist')
    if (toggle) {
        fetchingBlock.classList.remove('d-none') 
    } else {
        fetchingBlock.classList.add('d-none')
    }
}

function fetchingUploads(toggle) {
    const fetchingBlock = document.getElementById('fetching-uploads')
    if (toggle) {
        fetchingBlock.classList.remove('d-none') 
    } else {
        fetchingBlock.classList.add('d-none')
    }
}

function artistDetailBlock(toggle) {
    // toggle true is on/show, false is off/hide
    const artistDetailBlock = document.getElementById('artist-detail')
    if (toggle) {
        artistDetailBlock.classList.remove('d-none')
    } else {
        artistDetailBlock.classList.add('d-none')
    }
}

function uploadHistoryBlock(toggle) {
    // toggle true is on/show, false is off/hide
    const uploadHistoryBlock = document.getElementById("upload-history")
    if (toggle) {
        uploadHistoryBlock.classList.remove('d-none')        
    } else {
        uploadHistoryBlock.classList.add('d-none')
    }

}

function updateMaxEntries() {
    const maxEntriesElement = document.getElementById('max-entries')
    const maxEntries = cfe.maxentries - member.uploadcount

    maxEntriesElement.innerText = maxEntries
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
    const pId = [route.id]
    const url = EP_CFEAPI + "opencalls" + "&id=" + pId 
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
            cfe.maxentries = parseInt(resp[3])
            cfe.entryfee = parseInt(resp[4])
            displayExhibitName(cfe.name)
        })
        .catch()        
    }

}

function fetchMember(id) {
    const url = EP_CFEAPI + "member" + "&id=" + id

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

            artistDetailBlock(true)
            fetchingArtist(false)
            // attempt to fetch any uploads for this member
            fetchingUploads(true)
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
        fetchingUploads(false)
        //uploads = [...resp]
        member.uploads = [...resp]
        member.uploadcount = resp.length
        displayUploads(member.uploads)

    })
}

function isMember(member, status, type) {
    return (member.status===status && type.includes(member.type))
}

function emailValidate() { 
    const emailAddress = document.getElementById("artist-email").value
    const form = document.getElementById("form-artist-info")

    if (form.checkValidity()) {
        // fetch member
        fetchingArtist(true)
        fetchMember(emailAddress)

    } else {
        // error handling by Bootstrap
    }
}

function resetDisplay() {
    if (emailAddressOld!=="") { 
        // turn off artist detail
        artistDetailBlock(false)
        // turn off upload history
        uploadHistoryBlock(false)
        clearUploadHistory()
    }

    emailAddressOld = document.getElementById("artist-email").value
}

function clearUploadHistory() {
    const uploadHistoryTable = document.getElementById("upload-history-table")
    const uhtBody = uploadHistoryTable.getElementsByTagName("tbody")[0]
    const uploadHistoryFound = document.getElementById("upload-history-found")
    const uploadHistoryNotFound = document.getElementById("upload-history-notfound")

    uploadHistoryFound.classList.add('d-none')
    uploadHistoryNotFound.classList.add('d-none')
    uhtBody.innerHTML = ""
}

document.addEventListener("DOMContentLoaded", loadPageElements)
//document.addEventListener("DOMContentLoaded", mode)
document.getElementById("login-button").addEventListener("click", emailValidate)
document.getElementById("artist-email").addEventListener("change", resetDisplay)
document.getElementById("form-artist-info").addEventListener("submit", (event) => {
    event.preventDefault()
})