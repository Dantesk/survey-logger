# Survey Logger
A simple app to create UDP servers receive datagrams from client qinsy and save them on xlms file.

## Adding a Server
Press on Add Server button to open modal. Select your excel file, set IP Address and Port and click Submit button.

## Development
Run `npm install`. During development, you can use `npm start` to start the electron application. 

## Distribution
To build for distribution (exe and associated files) run `npm run build`. Contents will be output to `electron-udp-win32-x64`, specifically `electron-udp.exe`. You can use `electron-packager` to build for other targets. This folder is currently added to the `.gitignore` file. There are other electron packages such as `electron-forge` to build for real distribution.

## License
GNU GENERAL PUBLIC LICENSE

### Fun Notes
First commit was developed within an hour timeframe for prototyping unrelated UDP applications. 
