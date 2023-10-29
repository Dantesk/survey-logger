require('dotenv').config();

module.exports = {
  packagerConfig: {
    asar: true,
    icon: './icon', // no file extension required
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'Paolo Lagalante',
        description: 'Survey Logger Setup',
        certificateFile: '',
        certificatePassword: '',
        signWithParams: '',
        setupIcon: './icon.ico',
        // exe: 'Survey Logger.exe',
        iconUrl: 'https://raw.githubusercontent.com/Dantesk/survey-logger/main/icon.ico',
        setupExe:"Survey Logger Setup.exe"
      }
    },
    // {
    //   name: '@electron-forge/maker-dmg',
    //   config: {
    //     "iconUrl": "./icon.icns"
    //   },
    //   platforms: ['darwin'],
    // },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {},
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
    // {
    //   name: '@electron-forge/maker-dmg',
    //   config: {
    //     format: 'ULFO'
    //   }
    // }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'Dantesk',
          name: 'survey-logger'
        },
        prerelease: true,
        draft: true,
        authToken: process.env.GITHUB_TOKEN,
      }
    }
  ]
};
