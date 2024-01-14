const express = require('express');
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


/*
app.get('/', (req, res) => {
  res.send('Hello World!')
})
//*/

app.use(express.static('public'));

app.get('/test', (req, res) => {

    res.send('it\' working!')
});


app.get('/testModel1', async (req, res) => {


    const pythonProcess = await spawn('python3',["./models/model1.py", 'arg1']);

    console.log(pythonProcess);
    res.send('model1 response is: ' + pythonProcess.stdout?.toString()?.trim());
});

app.post("/upload-audio-file", upload.single("audio_data"), async function(req,res){

    const pythonProcess = await spawn('python3',["./models/part1.py", req.file?.filename]);
    console.log(pythonProcess);
    console.log(pythonProcess.stdout?.toString()?.trim());
    res.status(200).send(pythonProcess.stdout?.toString()?.trim());
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})