/**
 * Server object with HTML element
 * @extends {Socket}
 */
class Server extends Socket {

    /**
     * Constructor
     * @param {String} local_address 
     * @param {Number} local_port 
     * @param {String} file_path 
     */
    constructor(local_address, local_port, file_path) {
        super(local_address, local_port, file_path);

        /**
         * Server element
         * @type {ServerElement}
         */
        this.element = document.createElement('udp-server');

        // On delete emit event upwards
        this.element.addEventListener('delete', (event) => {
            this.emit('delete');
        });

        this.file_path = file_path.path;
    }

    /**
     * Get the ServerElement
     * @returns {ServerElement}
     */
    getElement() {
        return this.element;
    }

    /**
     * Remove the ServerElement
     */
    remove() {
        this.element.remove();
    }

    /**
     * Render the server's HTML element
     */
    render() {
        const addr = this.socket.address();
        this.element.setName(`${addr.address}:${addr.port}`);
        this.element.setFilePath(this.file_path);
    }

    /**
     * Initialize the server.
     * Render the element.
     * Attach handlers to the socket.
     * Socket must be set.
     */
    initialize() {
        if (!this.socket) {
            console.error('Server socket has not been set');
            return;
        }

        // this.element.appendMessage(`Listening\n`);

        // On message append to the messages textarea
        this.socket.on('message', (message, rinfo) => {
            this.element.appendMessage(message, rinfo);
        });

        this.render();
    }
}