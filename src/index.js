import platform from 'platform';
import MobileDetect from 'mobile-detect';
import compareVersions from 'compare-versions';

const md = new MobileDetect(window.navigator.userAgent);

const drm = {
  isDrmEnabled: false,
  isMobilePlatform: !!md.mobile(),
  os: platform.os,
};

const criteria = {
  blacklistDesktopBrowsers: [],
  whitelistVersions: {
    IE: '11.0',
    'Microsoft Edge': '14.0',
    Firefox: '52.0',
    Chrome: '49.0',
    Safari: '10.1',
    Opera: '45.0',
  },
  requiredOS: {
    IE: ['Windows', '8.1'],
    'Microsoft Edge': ['Windows', '10.0'],
  },
  whitelistMobileOS: ['AndroidOS', 'iOS'],
};

const isBrowserBlacklisted = name => {
  let isBlacklisted = false;
  criteria.blacklistDesktopBrowsers.forEach(blk => {
    if (name.indexOf(blk) !== -1) {
      isBlacklisted = true;
    }
  });
  return isBlacklisted;
};

const convertToSemver = vers => {
  const dots = (vers.match(/\./g) || []).length;
  if (dots <= 2) {
    return vers;
  }
  return vers.split('.').slice(0, 3).join('.');
};

const isVersionSupported = (brow, vers) => (
  criteria.whitelistVersions[brow]
    && compareVersions(convertToSemver(vers), criteria.whitelistVersions[brow]) !== -1);

const isOSSupported = (brow, os) => (
  criteria.requiredOS[brow] && criteria.requiredOS[brow][0] === os.family
    && compareVersions(convertToSemver(os.version), criteria.requiredOS[brow][1]) !== -1);

if (!drm.isMobilePlatform) {
  drm.desktopBrowser = platform.name;

  if (
    isBrowserBlacklisted(drm.desktopBrowser) ||
    !criteria.whitelistVersions[drm.desktopBrowser]
  ) {
    drm.desktopBrowserNotSupported = true;
  } else {
    drm.desktopBrowserVersion = platform.version;
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
  const os = md.os();
  if (criteria.whitelistMobileOS.indexOf(os) !== -1) {
    drm.isMobileSupported = true;
    drm.mobileOS = os;
  } else {
    drm.isMobileSupported = false;
  }
}

export default drm;
