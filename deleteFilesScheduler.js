// deleteFilesScheduler.js

const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

// Directory where the files are located
const codeFilesDirectory = path.join(__dirname, 'public', 'codefiles');

// Function to delete all files in the directory
function deleteFilesInDirectory(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    // Loop through each file and delete it
    files.forEach(file => {
      const filePath = path.join(directory, file);
      fs.unlink(filePath, err => {
        if (err) {
          console.error(`Error deleting file ${file}:`, err);
        }
      });
    });
  });
}

// Schedule the task to run at 12 AM (midnight) every day
cron.schedule('0 0 * * *', () => {
//   console.log('Running scheduled task: Deleting files in codefiles directory');
  deleteFilesInDirectory(codeFilesDirectory);
});

// Export the function to be imported into the main app
module.exports = { deleteFilesInDirectory };
