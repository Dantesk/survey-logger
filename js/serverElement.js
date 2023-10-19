/**
 *  //A3E69D VERDE SOL - CBAED7 VIOLA(PALI) - ECD2DF ROSA - A5D9FD AZZURRO (Oggetti in acqua SSS,ROV)
 */

/**
 * Server element
 * @extends {HTMLElement}
 */
class ServerElement extends HTMLElement {

    /**
     * Constructor
     */
    constructor() {
        super();

        /**
         * Display name.
         * @type {HTMLElement}
         */
        this.name = null;

        /**
         * State trigger
         * @type {Boolean}
         */
        this.isRecording = { value: false };
        this.isRecording = new Proxy(this.isRecording, {
            set: (target, property, value) => {
                if (property === 'value' && value !== target.value) {
                    console.log(`isRecording changed to ${value}`);
                }
                target[property] = value;
                return true;
            },
        });
        /**
         * Delete button.
         * @type {HTMLElement}
         */
        this.delete = null;

        /**
         * Clear messages button.
         * @type {HTMLElement}
         */
        this.clear = null;

        /**
         * Messages textarea.
         * @type {HTMLElement}
         */
        this.messages = null;

        /**
         * File path input
         */
        this.filePath = null;
    }

    /**
     * Set the server display name
     * @param {String} name 
     */
    setName(name) {
        this.name.innerHTML = name;
    }

    /**
     * Set the file path input
     * @param {String} path 
     */
    setFilePath(filePath) {
        this.filePath = filePath;
    }

    /**
     * Get the file path input
     */
    getFilePath() {
        return this.filePath
    }

    /**
     * Append the template.
     * Capture elements.
     * Attach handlers
     */
    connectedCallback() {
        // Clone the template
        const template = document.getElementById('server-template');
        const node = template.content.cloneNode(true);
        this.appendChild(node);

        // Capture elements
        this.name = this.querySelector('[data-name="id"]');
        this.messages = this.querySelector('[data-name="messages"]');
        this.clear = this.querySelector('[name="clear"]');
        this.delete = this.querySelector('[name="delete"]');
        this.sol = this.querySelector('[name="sol"]');
        this.eol = this.querySelector('[name="eol"]');
        this.inWater = this.querySelector('[name="inWater"]');
        this.offWater = this.querySelector('[name="offWater"]');
        this.waterInstrument = this.querySelector('[name="water-instrument"]');
        this.onDeck = this.querySelector('[name="onDeck"]');
        this.offDeck = this.querySelector('[name="offDeck"]');
        this.deckInstrument = this.querySelector('[name="deck-instrument"]');
        this.svpPerformed = this.querySelector('[name="svpPerformed"]');
        this.poleUp = this.querySelector('[name="poleUp"]');
        this.poleDown = this.querySelector('[name="poleDown"]');
        this.poleChoose = this.querySelector('[name="poleChoose"]');
        this.poleInstrument = this.querySelector('[name="pole-instrument"]');
        this.event = this.querySelector('[name="event"]');
        this.comment = this.querySelector('[name="comment"]');
        this.writeGeneric = this.querySelector('[name="writeGeneric"]');

        // On click emit an event to delete the server
        this.delete.addEventListener('click', (event) => {
            const delete_event = new Event('delete');
            this.dispatchEvent(delete_event);
        });

        // On click emit an event to write sol to csv
        this.sol.addEventListener('click', async (event) => {
            await this.appendMessageToXlsxSOL(this.messages.innerHTML)
        });

        // On click emit an event to write eol to xlsx
        this.eol.addEventListener('click', async (event) => {
            await this.appendMessageToXlsxEOL(this.messages.innerHTML)
        });

        // On click emit an event to write inWater to xlsx
        this.inWater.addEventListener('click', async (event) => {
            await this.appendMessageToXlsxInWater(this.messages.innerHTML);
        });

        // On click emit an event to write offWater to xlsx
        this.offWater.addEventListener('click', async (event) => {
            await this.appendMessageToXlsxOffWater(this.messages.innerHTML);
        });

        // On click emit an event to write onDeck to xlsx
        this.onDeck.addEventListener('click', async (event) => {
            await this.appendMessageToXlsxOnDeck(this.messages.innerHTML);
        });

        // On click emit an event to write offDeck to xlsx
        this.offDeck.addEventListener('click', async (event) => {
            await this.appendMessageToXlsxOffDeck(this.messages.innerHTML);
        });

        // On click emit an event to write svpPerformed to xlsx
        this.svpPerformed.addEventListener('click', async (event) => {
            await this.appendMessageToXlsxSvpPerformed(this.messages.innerHTML);
        });

        // On click emit an event to write poleUp to xlsx
        this.poleUp.addEventListener('click', async (event) => {
            await this.appendMessageToXlsxPoleUp(this.messages.innerHTML);
        });

        // On click emit an event to write poleDown to xlsx
        this.poleDown.addEventListener('click', async (event) => {
            await this.appendMessageToXlsxPoleDown(this.messages.innerHTML);
        });

        // On click emit an event to write generic action to xlsx
        this.writeGeneric.addEventListener('click', async (event) => {
            await this.appendMessageToXlsxGenericAction(this.messages.innerHTML);
        });

        // On click clear all messages
        this.clear.addEventListener('click', (event) => {
            this.messages.innerHTML = '';
        });
    }

    /**
     * Append a message to the message output.
     * @param {String} message 
     * @param {Object} rinfo
     */
    appendMessage(message, rinfo = null) {
        this.messages.innerHTML = `${message}`;
        this.messages.scrollTop = this.messages.scrollHeight;
        let str = String.fromCharCode.apply(null, message).split(',');

        let isRecording = str[0] === 'Recording';
        if (isRecording !== this.isRecording.value) {
            this.isRecording.value = isRecording;
            if (this.isRecording.value) {
                this.appendMessageToXlsxAuto(`${message}`);
            } else {
                this.appendMessageToXlsxAuto(`${message}`);
            }
        }
    }

    /**
     * Append a SOL or EOL message to the xlsx-file automaticaly
     * @param {String} message
     */
    async appendMessageToXlsxAuto(message) {
        const str = message.split(',');
        const pathXLSX = this.getFilePath();
        const data = {
            date: str[1],
            time: str[2],
            event: str[0] == 'Recording' ? 'SOL' : 'EOL',
            comment: 'OP',
            lineName: str[3],
            dbName: str[4],
            vesselEasting: isNaN(parseFloat(str[5])) ? '' : parseFloat(str[5]),
            vesselNorthing: isNaN(parseFloat(str[6])) ? '' : parseFloat(str[6]),
            sssEsting: isNaN(parseFloat(str[7])) ? '' : parseFloat(str[7]),
            sssNorth: isNaN(parseFloat(str[8])) ? '' : parseFloat(str[8]),
        };
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(pathXLSX, { useFileSystem: true }).then(async() => {
            let worksheet = workbook.getWorksheet('Survey_LOG');
            if (!worksheet) {
                // Se il foglio di lavoro Survey_LOG non esiste, crealo
                await workbook.addWorksheet('Survey_LOG', { headerFooter: { firstHeader: 'Survey_LOG' } });
            }
            worksheet.columns = [
                { header: 'Date', key: 'date' },
                { header: 'Time', key: 'time' },
                { header: 'Event', key: 'event' },
                { header: 'Comment', key: 'comment' },
                { header: 'Line Name', key: 'lineName' },
                { header: 'DB Name', key: 'dbName' },
                { header: 'Vessel Easting', key: 'vesselEasting' },
                { header: 'Vessel Northing', key: 'vesselNorthing' },
                { header: 'SSS Easting', key: 'sssEsting' },
                { header: 'SSS Northing', key: 'sssNorth' },
            ];
            await worksheet.addRow(data);
            // Imposta gli stili per la riga appena inserita
            const row = worksheet.lastRow;
            row.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: data.event === 'SOL' ? 'A3E69D' : 'FFC0CB' },
                };
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } },
                };
            });
            await workbook.xlsx.writeFile(pathXLSX, { useFileSystem: true });
        });
    }

    /**
     * Append a SOL message to the xlsx-file
     * @param {String} message
     */
    async appendMessageToXlsxSOL(message) {
        const str = message.split(',');
        const pathXLSX = path.join(this.getFilePath())
        const data = {
            date: str[1],
            time: str[2],
            event: 'SOL',
            comment: 'OP',
            lineName: str[3],
            dbName: str[4],
            vesselEasting: isNaN(isNaN(parseFloat(str[5])) ? '' : parseFloat(str[5])) ? '' : isNaN(parseFloat(str[5])) ? '' : parseFloat(str[5]),
            vesselNorthing: isNaN(isNaN(parseFloat(str[6])) ? '' : parseFloat(str[6])) == 0 ? '' : isNaN(parseFloat(str[6])) ? '' : parseFloat(str[6]),
            sssEsting: isNaN(isNaN(parseFloat(str[7])) ? '' : parseFloat(str[7])) ? '' : isNaN(parseFloat(str[7])) ? '' : parseFloat(str[7]),
            sssNorth: isNaN(isNaN(parseFloat(str[8])) ? '' : parseFloat(str[8])) ? '' : isNaN(parseFloat(str[8])) ? '' : parseFloat(str[8])
        };
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(pathXLSX, { useFileSystem: true }).then(async() => {
            let worksheet = await workbook.getWorksheet('Survey_LOG');
            if (!worksheet) {
                // Se il foglio di lavoro Survey_LOG non esiste, crealo
                workbook.addWorksheet('Survey_LOG', { headerFooter: { firstHeader: 'Survey_LOG' } });
            }
            worksheet.columns = [
                { header: 'Date', key: 'date' },
                { header: 'Time', key: 'time' },
                { header: 'Event', key: 'event' },
                { header: 'Comment', key: 'comment' },
                { header: 'Line Name', key: 'lineName' },
                { header: 'DB Name', key: 'dbName' },
                { header: 'Vessel Easting', key: 'vesselEasting' },
                { header: 'Vessel Northing', key: 'vesselNorthing' },
                { header: 'SSS Easting', key: 'sssEsting' },
                { header: 'SSS Northing', key: 'sssNorth' },
            ];
            await worksheet.addRow(data);
            // Imposta gli stili per la riga appena inserita
            const row = worksheet.lastRow;
            row.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'A3E69D' },
                };
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } },
                };
            });
            await workbook.xlsx.writeFile(pathXLSX, { useFileSystem: true });
        });
    }

    /**
     * Append a EOL message to the xlsx-file
     * @param {String} message
     */
    async appendMessageToXlsxEOL(message) {
        const str = message.split(',');
        const pathXLSX = path.join(this.getFilePath())
        const data = {
            date: str[1],
            time: str[2],
            event: 'EOL',
            comment: 'OP',
            lineName: str[3],
            dbName: str[4],
            vesselEasting: isNaN(parseFloat(str[5])) ? '' : parseFloat(str[5]),
            vesselNorthing: isNaN(parseFloat(str[6])) ? '' : parseFloat(str[6]),
            sssEsting: isNaN(parseFloat(str[7])) ? '' : parseFloat(str[7]),
            sssNorth: isNaN(parseFloat(str[8])) ? '' : parseFloat(str[8]),
        };
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(pathXLSX, { useFileSystem: true }).then(async () => {
            let worksheet = await workbook.getWorksheet('Survey_LOG');
            if (!worksheet) {
                // Se il foglio di lavoro Survey_LOG non esiste, crealo
                workbook.addWorksheet('Survey_LOG', { headerFooter: { firstHeader: 'Survey_LOG' } });
            }
            worksheet.columns = [
                { header: 'Date', key: 'date' },
                { header: 'Time', key: 'time' },
                { header: 'Event', key: 'event' },
                { header: 'Comment', key: 'comment' },
                { header: 'Line Name', key: 'lineName' },
                { header: 'DB Name', key: 'dbName' },
                { header: 'Vessel Easting', key: 'vesselEasting' },
                { header: 'Vessel Northing', key: 'vesselNorthing' },
                { header: 'SSS Easting', key: 'sssEsting' },
                { header: 'SSS Northing', key: 'sssNorth' },
            ];
            await  worksheet.addRow(data);
            // Imposta gli stili per la riga appena inserita
            const row = worksheet.lastRow;
            row.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFC0CB' },
                };
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } },
                };
            });
            await workbook.xlsx.writeFile(pathXLSX, { useFileSystem: true });
        });
    }

    
    /**
     * Appends a message to an Excel file in water format.
     * @async
     * @param {string} message - The message to append to the Excel file.
     * @returns {Promise<void>} A Promise that resolves when the message has been appended to the Excel file.
     */
    async appendMessageToXlsxInWater(message) {
        const str = message.split(',');
        const pathXLSX = path.join(this.getFilePath())
        const dataFormat = {
            date: str[1],
            time: str[2],
            event: `${this.waterInstrument.value == "Choose instrument..." ? '$' : this.waterInstrument.value} in water`,
            comment: 'OP',
            lineName: '',
            dbName: '',
            vesselEasting: isNaN(parseFloat(str[5])) ? '' : parseFloat(str[5]),
            vesselNorthing: isNaN(parseFloat(str[6])) ? '' : parseFloat(str[6]),
            sssEsting: isNaN(parseFloat(str[7])) ? '' : parseFloat(str[7]),
            sssNorth: isNaN(parseFloat(str[8])) ? '' : parseFloat(str[8]),
        };
        const workbook = new ExcelJS.Workbook();
        await fs.readFile(pathXLSX, (error, data) => {
            if (error) {
                console.log(error);
                return;
            }

            workbook.xlsx.load(data, { useFileSystem: true })
                .then(async () => {
                    const worksheet = workbook.getWorksheet('Survey_LOG');
                    if (!worksheet) {
                        // Se il foglio di lavoro Survey_LOG non esiste, crealo
                        workbook.addWorksheet('Survey_LOG', { headerFooter: { firstHeader: 'Survey_LOG' } });
                    }
                    const lastRow = worksheet.lastRow;
                    const newRowNumber = lastRow ? lastRow.number + 1 : 1;
                    worksheet.columns = [
                        { header: 'Date', key: 'date' },
                        { header: 'Time', key: 'time' },
                        { header: 'Event', key: 'event' },
                        { header: 'Comment', key: 'comment' },
                        { header: 'Line Name', key: 'lineName' },
                        { header: 'DB Name', key: 'dbName' },
                        { header: 'Vessel Easting', key: 'vesselEasting' },
                        { header: 'Vessel Northing', key: 'vesselNorthing' },
                        { header: 'SSS Easting', key: 'sssEsting' },
                        { header: 'SSS Northing', key: 'sssNorth' },
                    ];
                    await worksheet.addRow(dataFormat);
                    const row = worksheet.getRow(newRowNumber);
                    row.eachCell((cell) => {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'A5D9FD' },
                        };
                        cell.border = {
                            top: { style: 'thin', color: { argb: '000000' } },
                            left: { style: 'thin', color: { argb: '000000' } },
                            bottom: { style: 'thin', color: { argb: '000000' } },
                            right: { style: 'thin', color: { argb: '000000' } },
                        };
                    });
                    return await workbook.xlsx.writeBuffer({ useFileSystem: true });
                })
                .then(async (buffer) => {
                    await fs.writeFile(pathXLSX, buffer, (error) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Message appended to Excel file successfully!');
                        }
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        });
        // workbook.xlsx.readFile(pathXLSX, { useFileSystem: true }).then(() => {
        //     let worksheet = workbook.getWorksheet('Survey_LOG');
        //     if (!worksheet) {
        //         // Se il foglio di lavoro Survey_LOG non esiste, crealo
        //         workbook.addWorksheet('Survey_LOG', { headerFooter: { firstHeader: 'Survey_LOG' } });
        //     }
        //     worksheet.columns = [
        //         { header: 'Date', key: 'date' },
        //         { header: 'Time', key: 'time' },
        //         { header: 'Event', key: 'event' },
        //         { header: 'Comment', key: 'comment' },
        //         { header: 'Line Name', key: 'lineName' },
        //         { header: 'DB Name', key: 'dbName' },
        //         { header: 'Vessel Easting', key: 'vesselEasting' },
        //         { header: 'Vessel Northing', key: 'vesselNorthing' },
        //         { header: 'SSS Easting', key: 'sssEsting' },
        //         { header: 'SSS Northing', key: 'sssNorth' },
        //     ];
        //     worksheet.addRow(data);
        //     // Imposta gli stili per la riga appena inserita
        //     const row = worksheet.lastRow;
        //     row.eachCell((cell) => {
        //         cell.fill = {
        //             type: 'pattern',
        //             pattern: 'solid',
        //             fgColor: { argb: 'A5D9FD' },
        //         };
        //         cell.border = {
        //             top: { style: 'thin', color: { argb: '000000' } },
        //             left: { style: 'thin', color: { argb: '000000' } },
        //             bottom: { style: 'thin', color: { argb: '000000' } },
        //             right: { style: 'thin', color: { argb: '000000' } },
        //         };
        //     });
        //     workbook.xlsx.writeFile(pathXLSX, { useFileSystem: true });
        // });
    }

    /**
     * Append a Off Water message to the xlsx-file
     * @param {String} message
     */
    async appendMessageToXlsxOffWater(message) {
        const str = message.split(',');
        const pathXLSX = path.join(this.getFilePath())
        const data = {
            date: str[1],
            time: str[2],
            event: `${this.waterInstrument.value == "Choose instrument..." ? '$' : this.waterInstrument.value} off water`,
            comment: 'OP',
            lineName: '',
            dbName: '',
            vesselEasting: isNaN(parseFloat(str[5])) ? '' : parseFloat(str[5]),
            vesselNorthing: isNaN(parseFloat(str[6])) ? '' : parseFloat(str[6]),
            sssEsting: isNaN(parseFloat(str[7])) ? '' : parseFloat(str[7]),
            sssNorth: isNaN(parseFloat(str[8])) ? '' : parseFloat(str[8]),
        };
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(pathXLSX, { useFileSystem: true }).then(async () => {
            let worksheet = workbook.getWorksheet('Survey_LOG');
            if (!worksheet) {
                // Se il foglio di lavoro Survey_LOG non esiste, crealo
                await workbook.addWorksheet('Survey_LOG', { headerFooter: { firstHeader: 'Survey_LOG' } });
            }
            worksheet.columns = [
                { header: 'Date', key: 'date' },
                { header: 'Time', key: 'time' },
                { header: 'Event', key: 'event' },
                { header: 'Comment', key: 'comment' },
                { header: 'Line Name', key: 'lineName' },
                { header: 'DB Name', key: 'dbName' },
                { header: 'Vessel Easting', key: 'vesselEasting' },
                { header: 'Vessel Northing', key: 'vesselNorthing' },
                { header: 'SSS Easting', key: 'sssEsting' },
                { header: 'SSS Northing', key: 'sssNorth' },
            ];
            await worksheet.addRow(data);
            // Imposta gli stili per la riga appena inserita
            const row = worksheet.lastRow;
            row.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'A5D9FD' },
                };
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } },
                };
            });
            await workbook.xlsx.writeFile(pathXLSX, { useFileSystem: true });
        });
    }

    /**
     * Append a On Deck message to the xlsx-file
     * @param {String} message
     */
    async appendMessageToXlsxOnDeck(message) {
        const str = message.split(',');
        const pathXLSX = path.join(this.getFilePath())
        const data = {
            date: str[1],
            time: str[2],
            event: `${this.deckInstrument.value == "Choose instrument..." ? '$' : this.deckInstrument.value} on deck`,
            comment: 'OP',
            lineName: '',
            dbName: '',
            vesselEasting: isNaN(parseFloat(str[5])) ? '' : parseFloat(str[5]),
            vesselNorthing: isNaN(parseFloat(str[6])) ? '' : parseFloat(str[6]),
            sssEsting: isNaN(parseFloat(str[7])) ? '' : parseFloat(str[7]),
            sssNorth: isNaN(parseFloat(str[8])) ? '' : parseFloat(str[8]),
        };
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(pathXLSX, { useFileSystem: true }).then(async () => {
            let worksheet = workbook.getWorksheet('Survey_LOG');
            if (!worksheet) {
                // Se il foglio di lavoro Survey_LOG non esiste, crealo
                await workbook.addWorksheet('Survey_LOG', { headerFooter: { firstHeader: 'Survey_LOG' } });
            }
            worksheet.columns = [
                { header: 'Date', key: 'date' },
                { header: 'Time', key: 'time' },
                { header: 'Event', key: 'event' },
                { header: 'Comment', key: 'comment' },
                { header: 'Line Name', key: 'lineName' },
                { header: 'DB Name', key: 'dbName' },
                { header: 'Vessel Easting', key: 'vesselEasting' },
                { header: 'Vessel Northing', key: 'vesselNorthing' },
                { header: 'SSS Easting', key: 'sssEsting' },
                { header: 'SSS Northing', key: 'sssNorth' },
            ];
            await worksheet.addRow(data);
            // Imposta gli stili per la riga appena inserita
            const row = worksheet.lastRow;
            row.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'A5D9FD' },
                };
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } },
                };
            });
            await workbook.xlsx.writeFile(pathXLSX, { useFileSystem: true });
        });
    }

    /**
     * Append a Off Deck message to the xlsx-file
     * @param {String} message
     */
    async appendMessageToXlsxOffDeck(message) {
        const str = message.split(',');
        const pathXLSX = path.join(this.getFilePath())
        const data = {
            date: str[1],
            time: str[2],
            event: `${this.deckInstrument.value == "Choose instrument..." ? '$' : this.deckInstrument.value} off deck`,
            comment: 'OP',
            lineName: '',
            dbName: '',
            vesselEasting: isNaN(parseFloat(str[5])) ? '' : parseFloat(str[5]),
            vesselNorthing: isNaN(parseFloat(str[6])) ? '' : parseFloat(str[6]),
            sssEsting: isNaN(parseFloat(str[7])) ? '' : parseFloat(str[7]),
            sssNorth: isNaN(parseFloat(str[8])) ? '' : parseFloat(str[8]),
        };
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(pathXLSX, { useFileSystem: true }).then(async () => {
            let worksheet = workbook.getWorksheet('Survey_LOG');
            if (!worksheet) {
                // Se il foglio di lavoro Survey_LOG non esiste, crealo
                await workbook.addWorksheet('Survey_LOG', { headerFooter: { firstHeader: 'Survey_LOG' } });
            }
            worksheet.columns = [
                { header: 'Date', key: 'date' },
                { header: 'Time', key: 'time' },
                { header: 'Event', key: 'event' },
                { header: 'Comment', key: 'comment' },
                { header: 'Line Name', key: 'lineName' },
                { header: 'DB Name', key: 'dbName' },
                { header: 'Vessel Easting', key: 'vesselEasting' },
                { header: 'Vessel Northing', key: 'vesselNorthing' },
                { header: 'SSS Easting', key: 'sssEsting' },
                { header: 'SSS Northing', key: 'sssNorth' },
            ];
            await worksheet.addRow(data);
            // Imposta gli stili per la riga appena inserita
            const row = worksheet.lastRow;
            row.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'A5D9FD' },
                };
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } },
                };
            });
            await workbook.xlsx.writeFile(pathXLSX, { useFileSystem: true });
        });
    }

    /**
     * Append a Pole Up message to the xlsx-file
     * @param {String} message
     */
    async appendMessageToXlsxPoleUp(message) {
        const str = message.split(',');
        const pathXLSX = path.join(this.getFilePath())
        const data = {
            date: str[1],
            time: str[2],
            event: `${this.poleInstrument.value == "Choose instrument..." ? '$' : this.poleInstrument.value} ${this.poleChoose.value == "Choose position..." ? '' : this.poleChoose.value} pole up`,
            comment: 'OP',
            lineName: "",
            dbName: "",
            vesselEasting: isNaN(parseFloat(str[5])) ? '' : parseFloat(str[5]),
            vesselNorthing: isNaN(parseFloat(str[6])) ? '' : parseFloat(str[6]),
            sssEsting: isNaN(parseFloat(str[7])) ? '' : parseFloat(str[7]),
            sssNorth: isNaN(parseFloat(str[8])) ? '' : parseFloat(str[8]),
        };
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(pathXLSX, { useFileSystem: true }).then(async() => {
            let worksheet = workbook.getWorksheet('Survey_LOG');
            if (!worksheet) {
                // Se il foglio di lavoro Survey_LOG non esiste, crealo
                await workbook.addWorksheet('Survey_LOG', { headerFooter: { firstHeader: 'Survey_LOG' } });
            }
            worksheet.columns = [
                { header: 'Date', key: 'date' },
                { header: 'Time', key: 'time' },
                { header: 'Event', key: 'event' },
                { header: 'Comment', key: 'comment' },
                { header: 'Line Name', key: 'lineName' },
                { header: 'DB Name', key: 'dbName' },
                { header: 'Vessel Easting', key: 'vesselEasting' },
                { header: 'Vessel Northing', key: 'vesselNorthing' },
                { header: 'SSS Easting', key: 'sssEsting' },
                { header: 'SSS Northing', key: 'sssNorth' },
            ];
            await worksheet.addRow(data);
            // Imposta gli stili per la riga appena inserita
            const row = worksheet.lastRow;
            row.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'CBAED7' },
                };
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } },
                };
            });
            await workbook.xlsx.writeFile(pathXLSX, { useFileSystem: true });
        });
    }

    /**
     * Append a Pole Down message to the xlsx-file
     * @param {String} message
     */
    async appendMessageToXlsxPoleDown(message) {
        const str = message.split(',');
        const pathXLSX = path.join(this.getFilePath())
        const data = {
            date: str[1],
            time: str[2],
            event: `${this.poleInstrument.value == "Choose instrument..." ? '$' : this.poleInstrument.value} ${this.poleChoose.value == "Choose position..." ? '' : this.poleChoose.value} pole down`,
            comment: 'OP',
            lineName: "",
            dbName: "",
            vesselEasting: isNaN(parseFloat(str[5])) ? '' : parseFloat(str[5]),
            vesselNorthing: isNaN(parseFloat(str[6])) ? '' : parseFloat(str[6]),
            sssEsting: isNaN(parseFloat(str[7])) ? '' : parseFloat(str[7]),
            sssNorth: isNaN(parseFloat(str[8])) ? '' : parseFloat(str[8]),
        };
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(pathXLSX, { useFileSystem: true }).then(async () => {
            let worksheet = workbook.getWorksheet('Survey_LOG');
            if (!worksheet) {
                // Se il foglio di lavoro Survey_LOG non esiste, crealo
                await workbook.addWorksheet('Survey_LOG', { headerFooter: { firstHeader: 'Survey_LOG' } });
            }
            worksheet.columns = [
                { header: 'Date', key: 'date' },
                { header: 'Time', key: 'time' },
                { header: 'Event', key: 'event' },
                { header: 'Comment', key: 'comment' },
                { header: 'Line Name', key: 'lineName' },
                { header: 'DB Name', key: 'dbName' },
                { header: 'Vessel Easting', key: 'vesselEasting' },
                { header: 'Vessel Northing', key: 'vesselNorthing' },
                { header: 'SSS Easting', key: 'sssEsting' },
                { header: 'SSS Northing', key: 'sssNorth' },
            ];
            await worksheet.addRow(data);
            // Imposta gli stili per la riga appena inserita
            const row = worksheet.lastRow;
            row.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'CBAED7' },
                };
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } },
                };
            });
            await workbook.xlsx.writeFile(pathXLSX, { useFileSystem: true });
        });
    }

    /**
     * Append a SVP Performed message to the xlsx-file
     * @param {String} message
     */
    async appendMessageToXlsxSvpPerformed(message) {
        const str = message.split(',');
        const pathXLSX = path.join(this.getFilePath())
        const data = {
            date: str[1],
            time: str[2],
            event: 'SVP Performed',
            comment: "OP",
            lineName: "",
            dbName: "",
            vesselEasting: isNaN(parseFloat(str[5])) ? '' : parseFloat(str[5]),
            vesselNorthing: isNaN(parseFloat(str[6])) ? '' : parseFloat(str[6]),
            sssEsting: isNaN(parseFloat(str[7])) ? '' : parseFloat(str[7]),
            sssNorth: isNaN(parseFloat(str[8])) ? '' : parseFloat(str[8]),
        };
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(pathXLSX, { useFileSystem: true }).then(async () => {
            let worksheet = workbook.getWorksheet('Survey_LOG');
            if (!worksheet) {
                // Se il foglio di lavoro Survey_LOG non esiste, crealo
                await workbook.addWorksheet('Survey_LOG', { headerFooter: { firstHeader: 'Survey_LOG' } });
            }
            worksheet.columns = [
                { header: 'Date', key: 'date' },
                { header: 'Time', key: 'time' },
                { header: 'Event', key: 'event' },
                { header: 'Comment', key: 'comment' },
                { header: 'Line Name', key: 'lineName' },
                { header: 'DB Name', key: 'dbName' },
                { header: 'Vessel Easting', key: 'vesselEasting' },
                { header: 'Vessel Northing', key: 'vesselNorthing' },
                { header: 'SSS Easting', key: 'sssEsting' },
                { header: 'SSS Northing', key: 'sssNorth' },
            ];
            await worksheet.addRow(data);
            // Imposta gli stili per la riga appena inserita
            const row = worksheet.lastRow;
            row.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'dfe499' },
                };
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } },
                };
            });
            await workbook.xlsx.writeFile(pathXLSX, { useFileSystem: true });
        });
    }


    /**
     * Append a Generic Action message to the xlsx-file
     * @param {String} message
     */
    async appendMessageToXlsxGenericAction(message) {
        const str = message.split(',');
        const pathXLSX = path.join(this.getFilePath())
        const data = {
            date: str[1],
            time: str[2],
            event: this.event.value,
            comment: this.comment.value,
            lineName: "",
            dbName: "",
            vesselEasting: isNaN(parseFloat(str[5])) ? '' : parseFloat(str[5]),
            vesselNorthing: isNaN(parseFloat(str[6])) ? '' : parseFloat(str[6]),
            sssEsting: isNaN(parseFloat(str[7])) ? '' : parseFloat(str[7]),
            sssNorth: isNaN(parseFloat(str[8])) ? '' : parseFloat(str[8]),
        };
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(pathXLSX, { useFileSystem: true }).then(async () => {
            let worksheet = workbook.getWorksheet('Survey_LOG');
            if (!worksheet) {
                // Se il foglio di lavoro Survey_LOG non esiste, crealo
                await workbook.addWorksheet('Survey_LOG', { headerFooter: { firstHeader: 'Survey_LOG' } });
            }
            worksheet.columns = [
                { header: 'Date', key: 'date' },
                { header: 'Time', key: 'time' },
                { header: 'Event', key: 'event' },
                { header: 'Comment', key: 'comment' },
                { header: 'Line Name', key: 'lineName' },
                { header: 'DB Name', key: 'dbName' },
                { header: 'Vessel Easting', key: 'vesselEasting' },
                { header: 'Vessel Northing', key: 'vesselNorthing' },
                { header: 'SSS Easting', key: 'sssEsting' },
                { header: 'SSS Northing', key: 'sssNorth' },
            ];
            await worksheet.addRow(data);
            // Imposta gli stili per la riga appena inserita
            const row = worksheet.lastRow;
            row.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'd0d0e0' },
                };
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thin', color: { argb: '000000' } },
                };
            });
            await workbook.xlsx.writeFile(pathXLSX, { useFileSystem: true });
        });
    }
}
customElements.define('udp-server', ServerElement)