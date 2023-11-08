const { Worker } = require("worker_threads");

const seprateThread = new Worker(__dirname + "/seprateThread.js");

seprateThread.on("message", (result) => {
    res.send(`Processed function getSum on seprate thread:  ${result}`);
    });

seprateThread.postMessage(1000);