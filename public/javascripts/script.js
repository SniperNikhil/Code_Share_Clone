const socket = io();

const textarea = document.getElementById('code-area');
const lineNumbers = document.getElementById('line-numbers');

// Function to update line numbers
textarea.addEventListener('input', () => {
    const lines = textarea.value.split('\n').length;
    lineNumbers.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');

    // Get the full path from the URL
    const path = window.location.pathname;

    // Split the path into segments and get the last segment (the filename)
    const filename = path.split('/').pop();

    if(filename!=''){
        const filenameFromCookie = getCookie('filename');
        // console.log(filenameFromCookie);
        socket.emit("realtimecodeupdate",textarea.value,filenameFromCookie);
    }
});

// Set the initial line numbers
textarea.addEventListener('keydown', () => {
    const lines = textarea.value.split('\n').length;
    lineNumbers.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
});

const share = document.getElementById("share");

share.addEventListener('click', () => {
    socket.emit('textareadata', textarea.value)
})

socket.on('error', () => {
    alert('Could not share please retry')
})

socket.on('successshare', (filename) => {
    // console.log(filename)
    document.getElementById('share-link').href = `http://localhost:4001/${filename}`;
    document.getElementById('share-link').textContent = `http://localhost:4001/${filename}`
    document.getElementById('modal').style.display = "flex";
    document.cookie = `filename=${filename}; path=/; max-age=36000`;
});


document.getElementById('copy-btn').addEventListener('click', function () {
    document.getElementById('share-link').click();
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

setInterval(() => {
    // Get the full path from the URL
    const path = window.location.pathname;

    // Split the path into segments and get the last segment (the filename)
    const filename = path.split('/').pop();
    if (filename !== '') {
        const filenameFromCookie = getCookie('filename');
        socket.emit("newcode", filenameFromCookie);
    }
}, 500);

// Listen for the newcodereceive event
socket.on("newcodereceive", (data) => {
    // Update the editor with the new code data
    document.getElementById('code-area').value = data; // Update textarea with new code
});