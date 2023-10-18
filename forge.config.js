const githubToken = process.env.GITHUB_TOKEN;

module.exports = {
  packagerConfig: {
    asar: true,
    icon: './icon' // no file extension required
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        "iconUrl": "./icon.ico"
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
      config: {
        "iconUrl": "./icon.icns"
      },
      platforms: ['darwin'],
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
        prerelease: false,
        draft: true,
        authToken: githubToken,
      }
    }
  ]
};
