const electron = require('electron');
 
// Importing BrowserWindow from Main
const BrowserWindow = electron.remote.BrowserWindow;
 
var pdf = document.getElementById('pdf');
var filepath1 = path.join(__dirname, './test/print1.pdf'); 
 
var options = {
    marginsType: 0,
    pageSize: 'A4',
    printBackground: true,
    printSelectionOnly: false,
    landscape: false
}
 
pdf.addEventListener('click', (event) => {
 
    // let win = BrowserWindow.getAllWindows()[0];
    let win = BrowserWindow.getFocusedWindow();
     
    win.webContents.printToPDF(options).then(data => {
        fs.writeFile(filepath1, data, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('PDF Generated Successfully');
            }
        });
    }).catch(error => {
        console.log(error)
    });
});