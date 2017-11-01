'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _platform = require('platform');

var _platform2 = _interopRequireDefault(_platform);

var _mobileDetect = require('mobile-detect');

var _mobileDetect2 = _interopRequireDefault(_mobileDetect);

var _compareVersions = require('compare-versions');

var _compareVersions2 = _interopRequireDefault(_compareVersions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var md = new _mobileDetect2.default(window.navigator.userAgent);

var drm = {
  isDrmEnabled: false,
  isMobilePlatform: !!md.mobile(),
  os: _platform2.default.os
};

var criteria = {
  blacklistDesktopBrowsers: [],
  whitelistVersions: {
    IE: '11.0',
    'Microsoft Edge': '14.0',
    Firefox: '52.0',
    Chrome: '49.0',
    Safari: '10.1',
    Opera: '45.0'
  },
  requiredOS: {
    IE: ['Windows', '8.1'],
    'Microsoft Edge': ['Windows', '10.0']
  },
  whitelistMobileOS: ['AndroidOS', 'iOS']
};

var isBrowserBlacklisted = function isBrowserBlacklisted(name) {
  var isBlacklisted = false;
  criteria.blacklistDesktopBrowsers.forEach(function (blk) {
    if (name.indexOf(blk) !== -1) {
      isBlacklisted = true;
    }
  });
  return isBlacklisted;
};

var convertToSemver = function convertToSemver(vers) {
  var dots = (vers.match(/\./g) || []).length;
  if (dots <= 2) {
    return vers;
  }
  return vers.split('.').slice(0, 3).join('.');
};

var isVersionSupported = function isVersionSupported(brow, vers) {
  return criteria.whitelistVersions[brow] && (0, _compareVersions2.default)(convertToSemver(vers), criteria.whitelistVersions[brow]) !== -1;
};

var isOSSupported = function isOSSupported(brow, os) {
  return criteria.requiredOS[brow] && criteria.requiredOS[brow][0] === os.family && (0, _compareVersions2.default)(convertToSemver(os.version), criteria.requiredOS[brow][1]) !== -1;
};

if (!drm.isMobilePlatform) {
  drm.desktopBrowser = _platform2.default.name;

  if (isBrowserBlacklisted(drm.desktopBrowser) || !criteria.whitelistVersions[drm.desktopBrowser]) {
    drm.desktopBrowserNotSupported = true;
  } else {
    drm.desktopBrowserVersion = _platform2.default.version;
    if (isVersionSupported(drm.desktopBrowser, drm.desktopBrowserVersion)) {
      if (['IE', 'Microsoft Edge'].indexOf(drm.desktopBrowser) !== -1) {
        if (isOSSupported(drm.desktopBrowser, drm.os)) {
          drm.isDrmEnabled = true;
        }
      } else {
        drm.isDrmEnabled = true;
      }
    } else {
      drm.desktopBrowserVersionNotSupported = true;
    }
  }
}

if (drm.isMobilePlatform) {
  var os = md.os();
  if (criteria.whitelistMobileOS.indexOf(os) !== -1) {
    drm.isMobileSupported = true;
    drm.mobileOS = os;
  } else {
    drm.isMobileSupported = false;
  }
}

exports.default = drm;