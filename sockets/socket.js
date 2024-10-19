const { Server } = require('socket.io');
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

module.exports = function(server) {
    const io = new Server(server);

    io.on('connection', (socket) => {
        socket.on('textareadata', (data) => {
            const uniqueFileName = generateUniqueFileName() + ".txt";

            // Define the path where the file will be saved
            const filePath = path.join(__dirname,"..", 'public', 'codefiles', uniqueFileName);

            // Write the textarea data to the file
            fs.writeFile(filePath, data, (err) => {
                if (err) {
                    // console.error("Error writing to file:", err);
                    socket.emit('error')
                    next;
                }
                // console.log(`Data saved to ${filePath}`);
            });
            
            socket.emit('successshare',uniqueFileName);
        });

        socket.on("realtimecodeupdate",(data,filename)=>{
            const filePath = path.join(__dirname,"..", 'public', 'codefiles', filename);
            fs.writeFile(filePath, data, (err) => {
                if (err) {
                    socket.emit("error");
                    return;
                }
            });
        });

        socket.on("newcode", (filename) => {
            // console.log("Requesting new code for:", filename);
            const filePath = path.join(__dirname, "..", 'public', 'codefiles', filename);
            
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    // Handle error if the file does not exist or cannot be read
                    console.error(err);
                    // Optionally emit an error event back to the client
                    socket.emit("error");
                    return;
                }
                
                // Emit the received data back to the client
                socket.emit("newcodereceive", data);
            });
        });
    });

    return io;
};


function generateUniqueFileName() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Letters and digits
    let randomString = '';
    
    // Generate a random 6-character string
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }

    return `${randomString}`;
}
