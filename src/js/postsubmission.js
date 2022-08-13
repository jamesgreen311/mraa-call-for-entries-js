
function serializeAndSave() {
  const showData = document.querySelector('#btnSave');

  let d = new Date();
  let f = document.getElementById('imageFile');
  const file = f.files[0];
  const fr = new FileReader();
  let ln = document.getElementById('lastName');
  let fn = document.getElementById('firstName');
  let e = document.getElementById('emailAddress');
  let ph = document.getElementById('phoneNumber');
  let t = document.getElementById('titleOfWork');
  let w = document.getElementById('sizeWidth');
  let h = document.getElementById('sizeHeight');
  let p = document.getElementById('price');
  let m = document.getElementById('medium');
  let showId = showData.dataset.id;
  let showName = showData.dataset.name;
  let fileNameFormatted = `${ln.value}-${fn.value}-${t.value}-${m.value}-${w.value}x${h.value}-${p.value}`;
  let data = [showId, showName, fn.value, ln.value, e.value, ph.value, t.value, m.value, w.value, h.value, p.value,
    fileNameFormatted
  ];

  if (allFieldsValid()) {

    document.getElementById('messageAlert').style.display = "none";
    document.getElementById("loading").style.display = "block";
    fr.onload = function (e) {
      const obj = {
        filename: fileNameFormatted,
        mimeType: file.type,
        bytes: [...new Int8Array(e.target.result)]
      };
      google.script.run
        .withSuccessHandler(saveFormSuccess)
        .withUserObject(obj)
        .saveFile(obj, data, showData.dataset.folder, showData.dataset.name, showId);
    };
    fr.readAsArrayBuffer(file);
  } else {
    return false;
  }

}

function saveFormSuccess(data, obj) {
  let email = document.getElementById('emailAddress').value;
  let evtName = document.querySelector('#btnSave').dataset.name;
  google.script.run.withSuccessHandler(setSubmitsByArtist).getTotalByEventArtist(evtName, email) ;
  google.script.run.withSuccessHandler(setEntriesSubmitted).getTotalByEvent(evtName);

  let title = document.getElementById('titleOfWork').value;
  let messageContent = `Your submission: [${title}] has been saved. Would you like to submit another work?`;
  let container = document.getElementById("thumbnail-container");
  let outerBox = document.getElementById('thumbnail-outer-box');
  let messageBox = document.getElementById('thumbnail-message');
  let uploadListBox = document.getElementById('upload-list');

  uploadListBox.innerHTML += `File Name: ${obj.filename}<br>`
  //showUploadList(obj)
  //google.script.run.withSuccessHandler(showUploadList).getUploadsByArtist(eventName, email)
  //uploadListBox.innerHTML += data;

  document.getElementById("loading").style.display = "none";
  document.getElementById("messageContent").innerHTML = messageContent;
  document.getElementById('titleOfWork').value = "";
  document.getElementById('sizeWidth').value = "";
  document.getElementById('sizeHeight').value = "";
  document.getElementById('medium').value = "";
  document.getElementById('price').value = "";
  document.getElementById('imageFile').value = "";
  document.getElementById('messageAlert').style.display = "block";
  document.getElementById('thumbnail').src = "";
  container.style.display = "none";
  messageBox.style.display = "block";
  outerBox.classList.add("mraa-highlight");
  return true;
}

function showUploadList(d) {
  let uploadListBox = document.getElementById("upload-list")
  uploadListBox.innerHTML = d.fileNameFormatted
}

function showThumbnail(e) {
  const imageFile = document.getElementById('imageFile');
  const maxImageSize = getMaxImageSize()
  const uploadImageSize = ( imageFile.files[0].size / (1024 * 1024) ).toFixed(1) // convert bytes to mb 

  let thumbnail = document.getElementById('thumbnail');
  let container = document.getElementById('thumbnail-container');
  let message = document.getElementById('thumbnail-message');
  let outerBox = document.getElementById('thumbnail-outer-box');
  let maxFileSizeMsg = `Your file size is ${uploadImageSize}MB and it exceeds maximum allowed size of ${maxImageSize}MB.<br>Please select a smaller image.`

  outerBox.classList.remove('mraa-highlight');
  message.style.display = "none";

  // check file size before showing image
  if (uploadImageSize > maxImageSize) {
    message.innerHTML = maxFileSizeMsg
    message.style.display = "block"
    imageFile.value = ""

    /*
     test case: 
        a valid image is selected.
        user selects a new image without uploading previous image
        new image exceeds max
        old image needs to be removed
     */
    container.style.display = "none"
    e.stopImmediatePropagation()
    //thumbnail.src = ""
    return false

  } else {
    thumbnail.src = URL.createObjectURL(e.target.files[0]);
    container.style.display = "block";
    return true
  }
}

function allFieldsValid() {
  let inputs = document.querySelectorAll('input');
  let invalidCount = 0;

  inputs.forEach(function (input) {
    if (!input.validity.valid) {
      invalidCount++;
    }
  })
  return invalidCount == 0;
}

function stopSubmit(e) {
  e.preventDefault();
  return false;
}

function setSubmitsByArtist(count) {
  let countEl = document.getElementById('submitsByArtist');
  if (submitsExceedLimit(count)) {
    countEl.classList.add("badge-danger");
    countEl.classList.remove("badge-warning");
  } 
  countEl.innerText = count;  
}

function getMaxImageSize() {
  let size = document.getElementById("maxImageSize").innerText
  return size
}

function submitsExceedLimit(submitCount) {
  let limit = document.getElementById('maxPerArtist').innerText;
  return submitCount >= limit;
}

function getEventTitle() {
  return document.getElementById('btnSave').dataset.name;
}

document.getElementById('btnSave').addEventListener('click', serializeAndSave);
document.getElementById('frmMain').addEventListener('submit', stopSubmit);