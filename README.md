# Detect if browser supports Encrypted Media Extensions

The EncryptedMediaExtenstions API provides interfaces for controlling the playback of content which is subject to a DRM scheme.

## Install
Copy this inside the dependencies object from `package.json` of your project

```sh
"browser-drm": "git+https://github.com/catarizea/browser-drm.git"
```

Then install packages

```sh
$ yarn
```

## Output sample for a desktop browser

```sh
{
    "isDrmEnabled": true,
    "isMobilePlatform": false,
    "os": {
        "architecture": 64,
        "family": "OS X",
        "version": "10.12.6"
    },
    "desktopBrowser": "Chrome",
    "desktopBrowserVersion": "61.0.3163.100"
}
```

## Output sample for a mobile browser

```sh
{
    "isDrmEnabled": false,
    "isMobilePlatform": true,
    "os": {
        "architecture": 32,
        "family": "iOS",
        "version": "11.1"
    },
    "isMobileSupported": true,
    "mobileOS": "iOS"
}
```
