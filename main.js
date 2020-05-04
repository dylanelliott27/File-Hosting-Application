/* -----       SELECTORS ------ */
const form = document.getElementById('form');
const linkDisplayElement = document.querySelector('.linkdisplay');
const labelForButtonToUploadFile = document.getElementById('fileuploaderbutton');
const actualInputButtonUploader = document.getElementById('fileuploader');
const decoyFakeUploadButton = document.getElementById('uploadfilebutton');
const progressBar = document.getElementById('progressbar');
const secondBubble = document.getElementById('secondbubble');
const thirdBubble = document.getElementById('thirdbubble');
const submitButton = document.getElementById('submitbutton');
let uploadProcessCurrentStep = 0;

/*------ Event listeners ------- */
form.addEventListener("submit", submitFile);

labelForButtonToUploadFile.addEventListener('click', () => {
    actualInputButtonUploader.click();
})

/*----- Functions ----- */
//Captures the file uploaded to the form input and stores it into a FormData object.
//It is then sent to the node JS backend where it is parsed by Multer and stored on server (localhost for now)
function submitFile(event){
    event.preventDefault();
    const data = new FormData(form);
    const httpReq = new XMLHttpRequest();
    httpReq.onreadystatechange = function() {
         if (httpReq.readyState == XMLHttpRequest.DONE) {
         linkDisplayElement.value = `http://192.168.2.122:3000/download/${httpReq.responseText}`;
        }   
    }
    httpReq.onerror = function(){
        alert("Error while sending file");
    }
    httpReq.open("POST", 'http://192.168.2.122:3000/upload');
    httpReq.send(data);
}


function handleFirstStep(e){
    if(e.target.value === 'fileOption'){
        decoyFakeUploadButton.removeAttribute('disabled');
        progressBar.setAttribute('style', "width: 50%");
        secondBubble.setAttribute('style', "background-color: #00A896");
    }
}

function handleSecondStep(e){
    submitButton.removeAttribute('disabled');
    progressBar.setAttribute('style', "width: 100%");
    thirdBubble.setAttribute('style', "background-color: #00A896");
    
}