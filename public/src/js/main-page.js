//const actionButton = document.querySelector('#action-button');
const secondaryButton = document.querySelector('#secondary-button');
const recordButton = document.querySelector('#record-button');
const pauseButton = document.querySelector('#pause-button');
const resultAudioElement = document.querySelector("#audio-result");
const englishText = document.querySelector("#text-english");
const arabicText = document.querySelector("#text-arabic");

const resultAudioElementSource = resultAudioElement.querySelector('source');

//
let status = 'none'; //none, recording, playing, uploading-file, 



/*
actionButton.onclick = async () => {

    const response = await fetch('/test');
    //const data = await response.json();
    const data = await response.text();


    alert(data);
}
//*/



recordButton.onclick = async () => {
    startAudioRecording();
}


pauseButton.onclick = async () => {
    stopAudioRecording();
}



function changeStatus(newstatus){


    status = newstatus;
}





async function uploadSoundData(blob) {
    const filename = "sound-file-" + new Date().getTime() + ".wav";
    const formData = new FormData();
    formData.append("audio_data", blob, filename);
    
    const response = await fetch('/upload-audio-file', {
        method: 'POST',
        body: formData
    });

    console.log('file uploaded successfully');
    const result = await response.json();
    console.log(result);

    if(result.isSucess){
        englishText.innerHTML = result.data;
        await translateText(result.data);
    }
    
}


async function translateText(text){

    const response = await fetch('/trnslate-en-to-ar', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
            text: text
        })
    });

    console.log('text translated successfully');
    const result = await response.json();
    console.log(result);

    if(result.isSucess){
        arabicText.innerHTML = result.data;
        await speak(result.data);
    }
}



async function speak(text){

    const response = await fetch('/speak', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
            text: text
        })
    });

    console.log('speak done successfully');
    const result = await response.json();
    console.log(result);

    if(result.isSucess){
        //arabicText.innerHTML = result.data;
        //await translateText(result.data);
        resultAudioElementSource.src = result.data;
        resultAudioElement.load();
    }
}





function action(){

}