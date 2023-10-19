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
        description: 'A simple electron app to create UDP servers to receive datagrams from Qisey',
        certificateFile: '',
        certificatePassword: '',
        signWithParams: '',
        iconUrl: './icon.ico',
        setupIcon: './icon.ico',
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
