//const actionButton = document.querySelector('#action-button');
const secondaryButton = document.querySelector('#secondary-button');
const recordButton = document.querySelector('#record-button');
const loadButton = document.querySelector('#load-button');
const pauseButton = document.querySelector('#pause-button');
const resultAudioElement = document.querySelector("#audio-result");
const englishText = document.querySelector("#text-english");
const arabicText = document.querySelector("#text-arabic");
const loadingText = document.querySelector('#loading-text');

const resultAudioElementSource = resultAudioElement.querySelector('source');

//
let status = 'none'; //none, recording, playing, uploading-file, 





recordButton.onclick = async () => {
    startAudioRecording();
}


pauseButton.onclick = async () => {
    stopAudioRecording();
}



function changeStatus(newstatus){//none, recording, playing, uploading-file, 

    switch(newstatus){
        case 'none':
            recordButton.hidden = false;
            pauseButton.hidden = true;
            loadButton.hidden = true;
            
            break;
        
        case 'record':
            recordButton.hidden = true;
            pauseButton.hidden = false;
            loadButton.hidden = true;

            englishText.hidden = true;
            arabicText.hidden = true;
            resultAudioElement.hidden = true;

            
            break;
        
        case 'play':
            recordButton.hidden = true;
            pauseButton.hidden = true;
            loadButton.hidden = false;
            
            break;
        
        case 'translate':
            englishText.hidden = false;
            break;

        case 'speak':
            arabicText.hidden = false;
            break;

        case 'done':
            resultAudioElement.hidden = false;
            break;
    }

    status = newstatus;
}

changeStatus('record');
changeStatus('none');





async function uploadSoundData(blob) {

    loadingText.innerHTML = 'convert speach to text ..';

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

    loadingText.innerHTML = 'Translating ..';
    changeStatus('translate');

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

    loadingText.innerHTML = 'Speaking (it will take time) ...';
    changeStatus('speak');

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

    changeStatus('none')

    if(result.isSucess){
        //arabicText.innerHTML = result.data;
        //await translateText(result.data);
        resultAudioElementSource.src = result.data;
        resultAudioElement.load();
        resultAudioElement.play();
        changeStatus('done');
    }
}





function action(){

}