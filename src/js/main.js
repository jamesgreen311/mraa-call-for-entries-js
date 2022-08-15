const route = getRoute()
const cfe = {
    "closedate" : "",
    "id" : "",
    "name" : "",
    "maxentries" : "",
    "entryfee" : "",
    "imagefolderid" : ""
}
const member = {
    "email" : "",
    "firstname" : "",
    "lastname" : "",
    "phone" : "",
    "status" : "", 
    "type" : "",
    "uploadcount" : "",
    "sessioncount" : 0
}
const appsettings = {
    "maximagesize" : 3, // default, get actual from AppSettings Spreadsheet
    "cfecontact" : ""
}

// End Point Source - MRAA Call For Entries API
// -- Script Id = 1idLgBabKWZRx6uNEK5v4Z9lO36OWewbTJwSHeSCwxZSbd8Q5U4MwPLfh
// End Point version 10
const EP_CFEAPIGET = "https://script.google.com/macros/s/AKfycbxHhOKR2Xj8w3zjGAGHQf22oWhzJg7Q4Mab94b_gftB0g5TTZnb0iCzWI4VijeMYx6I/exec" +
    "?q="

const EP_CFEAPIPOST = "https://script.google.com/macros/s/AKfycbxHhOKR2Xj8w3zjGAGHQf22oWhzJg7Q4Mab94b_gftB0g5TTZnb0iCzWI4VijeMYx6I/exec"
var test = true
//var uploads = []
var emailAddressOld = ""

// View methods
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
            disallowAccess()
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
            let col3 = document.createElement("td")
            col1.innerText = uploads[i][0]
            col2.innerText = uploads[i][1]
            col3.innerText = `\$${cfe.entryfee}`
            row.appendChild(col1)
            row.appendChild(col2)
            row.appendChild(col3)
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

    if (maxEntries<0) {
        disableUploads()
        maxEntries = 0
    }
    maxEntriesElement.innerText = maxEntries
}

function imageSaved(num=0) {
    const galleryCollection = document.getElementById('gallery')
    const galleryItems = galleryCollection.getElementsByTagName('li')
    const imageSaved = galleryCollection.getElementsByClassName('saved')
    const galleryContainer = galleryCollection.parentElement

    galleryItems[num].classList.remove('d-none')
    galleryContainer.classList.remove('d-none')
    imageSaved[num].classList.remove('d-none')
}

function allowAccess() {
    const memberAccess = document.getElementsByClassName("member-access")

    // show all hidden elements
    let allMemberAccess = memberAccess.length
    for (i=allMemberAccess-1; i>=0; i--) {
        memberAccess[i].classList.remove("d-none")
    }
}

function disallowAccess() {
    const memberAccess = document.getElementsByClassName("member-access")

    // show all hidden elements
    let allMemberAccess = memberAccess.length
    for (i=allMemberAccess-1; i>=0; i--) {
        memberAccess[i].classList.add("d-none")
    }
}

function disableForm(msg) {

}

function imageGalleryToggle(toggle){
    const imageGallery = document.getElementById('upload-gallery')
    if (toggle) {
        imageGallery.classList.remove('d-none')
    } else {
        imageGallery.classList.add('d-none')
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

// TODO - build function
function resetFields(form) {

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

function calcTotalFee(count, fee) {
    const totalFee = document.getElementById('totalFee')
    totalFee.innerText = `\$${count*fee}`
}

function showComplete() {
    // increase upload count
    member.uploadcount = member.uploadcount++
    imageSaved(member.sessioncount)
    member.sessioncount = member.sessioncount++
    uploadsRemaining(cfe.maxentries - member.sessioncount)
}

function uploadsRemaining(count) {
    const maxEntries = document.getElementById('max-entries')
    if (count>0) {
        maxEntries = count
    } else {
        // disable additional uploads
        maxEntries = 0
        const msgHTML = "You have reached the max entries for this event. If you feel this is inaccurate please contact the event coordinator" // TODO - add cfe coordinator email link
        disableForm(msg) // TODO - build function
    }

}

function showThumbnail(e) {
    const imageFile = document.getElementById('form-file');
    const maxImageSize = appsettings.maximagesize
    const uploadImageSize = ( imageFile.files[0].size / (1024 * 1024) ).toFixed(1) // convert bytes to mb 
    const imageGallery = document.getElementById('gallery')
    const galleryFirstEmpty = imageGallery.getElementsByClassName('empty')[0]
    const imageContainer = galleryFirstEmpty.parentElement
    const submissionMessages = document.getElementById('submission-messages')
    imageGalleryToggle(true)

    const maxFileSizeMsg = `<p class="mt-2 mb-0">Your file size is <span class='text-danger'>** ${uploadImageSize} MB **</span> and it exceeds maximum allowed size of <span class="text-warning">${maxImageSize} MB</span>. Please select a smaller image.</p>`
  
    // check file size before showing image
    if (uploadImageSize > maxImageSize) {
        submissionMessages.innerHTML = maxFileSizeMsg
        e.stopImmediatePropagation()
        galleryFirstEmpty.innerHTML = ""

        return false
  
    } else {
        submissionMessages.innerHTML = ""
        galleryFirstEmpty.innerHTML = "<img class='crop' />"
        const thumbnail = galleryFirstEmpty.getElementsByTagName('img')[0]
        thumbnail.src = URL.createObjectURL(e.target.files[0]);
        imageContainer.classList.remove('d-none')
        //galleryFirstEmpty.classList.remove('empty')

        return true
    }
}

// I/O
function fetchOpenCalls() {
    const pId = [route.id]
    const url = EP_CFEAPIGET + "opencalls" + "&id=" + pId 
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
            cfe.imagefolderid = resp[5]
            displayExhibitName(cfe.name)
        })
        .catch()        
    }

}

function fetchMember(id) {
    const url = EP_CFEAPIGET + "member" + "&id=" + id

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
    const url = EP_CFEAPIGET + "uploads" + "&id=" + JSON.stringify(p)

    fetch(url) 
    .then(resp => resp.json())
    .then(resp => {
        fetchingUploads(false)
        //uploads = [...resp]
        member.uploads = [...resp]
        member.uploadcount = resp.length
        displayUploads(member.uploads)
        calcTotalFee(member.uploadcount, cfe.entryfee)
    })
}

function addSubmission(e) {
    e.preventDefault()
    const formdata = new FormData(this)
    const payload = [ 
        ['eventid', cfe.id],
        ['eventtitle', cfe.name],
        ['firstname', member.firstname],
        ['lastname', member.lastname],
        ['email', member.email],
        ['phone', member.phone],
        ...formdata
    ]
    let _data = {}
    for (const [key, value] of payload) {
        _data[key] = value
        console.log(`${key}: ${value} \n`)
    }
    _data.filename = `${_data.lastname}-${_data.firstname}-${_data.worktitle}-${_data.medium}-${_data.width}x${_data.height}-${_data.price}`
    _data.fileid = "test" // Test Data 
    _data.member = "YES"
    _data.availability = ""
    _data.hidden = ""
    _data.fullname = member.firstname + " " + member.lastname
    _data.timestamp = moment().format("MMMM Do YYYY, h:mm:ss a")
    fetch(EP_CFEAPIPOST, {
        method: "POST",
        mode: "no-cors",
        cache: 'no-cache',
        credentials: 'omit',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(_data)
    })
    .then(res => res)
    .then(showComplete())
    .catch(err => console.log(err))
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

function loadPageElements() {
    fetchOpenCalls()
}

document.addEventListener("DOMContentLoaded", loadPageElements)
//document.addEventListener("DOMContentLoaded", imageSaved)
//document.addEventListener("DOMContentLoaded", mode)
document.getElementById("login-button").addEventListener("click", emailValidate)
document.getElementById("artist-email").addEventListener("change", resetDisplay)
document.getElementById("form-artist-info").addEventListener("submit", (event) => {
    event.preventDefault()
})
document.getElementById("form-upload-images").addEventListener("submit", addSubmission)
document.getElementById("form-file").addEventListener("change", showThumbnail)