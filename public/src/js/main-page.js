const actionButton = document.querySelector('#action-button');
const secondaryButton = document.querySelector('#secondary-button');
const recordButton = document.querySelector('#record-button');
const pauseButton = document.querySelector('#pause-button');

//
let status = 'none'; //none, recording, playing, uploading-file, 




actionButton.onclick = async () => {

    const response = await fetch('/test');
    //const data = await response.json();
    const data = await response.text();


    alert(data);
}


recordButton.onclick = async () => {
    startAudioRecording();
}


pauseButton.onclick = async () => {
    stopAudioRecording();
}





function uploadSoundData(blob) {
    const filename = "sound-file-" + new Date().getTime() + ".wav";
    const formData = new FormData();
    formData.append("audio_data", blob, filename);
    
    fetch('/upload-audio-file', {
        method: 'POST',
        body: formData
    }).then(async result => { 
        console.log('file uploaded successfully');
    }).catch(error => { 
        console.log('error while uploading the file:', JSON.stringify(error));
    });
}





function action(){

}