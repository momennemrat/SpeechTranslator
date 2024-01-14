const express = require('express');
const fs = require('fs');
const multer = require('multer');
const spawn = require("child_process").spawnSync;



const app = express();
const port = 3000;

const fileStorage = multer.diskStorage(
    {
        destination: './sound_files/',
        filename: function (req, file, cb ) {
            cb( null, file.originalname);
        }
    }
);
const upload = multer( { storage: fileStorage } );
app.use(express.static('public'));
app.use(express.json());


app.get('/testModel1', async (req, res) => {

    const pythonProcess = await spawn('python3',["./models/model1.py", 'arg1']);

    console.log(pythonProcess);
    res.send('model1 response is: ' + pythonProcess.stdout?.toString()?.trim());
});

app.post("/upload-audio-file", upload.single("audio_data"), async function(req,res){

    console.log('uploading source audio file ..');
    const pythonProcess = await spawn('python3',["./models/part1.py", './sound_files/'+req.file?.filename]);
    const error = pythonProcess.stderr?.toString()?.trim();

    if(error){
        console.error(error);
    }

    const result = pythonProcess.stdout?.toString()?.trim();

    console.log(result);
    res.status(200).send(new Response(result));
});

app.post('/trnslate-en-to-ar', async (req, res) => {

    console.log('translating english to arabic ..');
    const pythonProcess = await spawn('python3',["./models/part2.py", req.body?.text]);
    const error = pythonProcess.stderr?.toString()?.trim();

    if(error){
        console.error(error);
    }

    const result = pythonProcess.stdout?.toString()?.trim();

    console.log(result);
    res.status(200).send(new Response(result));
});

app.post('/speak', async (req, res) => {

    console.log('converting arabic text to speach ..');
    const outputFileName = new Date().toISOString() + '.wav';
    const pythonProcess = await spawn('python3',["./models/part3.py", req.body?.text]);
    const error = pythonProcess.stderr?.toString()?.trim();

    if(error){
        console.error(error);
    }

    fs.renameSync('./output.wav', './public/output/' + outputFileName);

    

    const result = pythonProcess.stdout?.toString()?.trim();

    console.log(result);
    res.status(200).send(new Response('/output/'+outputFileName));
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});






class Response {
    isSucess = true;
    errors = [];
    data = null;

    constructor(_data){
        this.data = _data;
    }

    error = (er) => {

        if(er != null){
            this.errors.push(er);
            this.isSucess = false;
        }
    }
}