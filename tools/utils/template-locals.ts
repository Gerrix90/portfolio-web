import {ENV, APP_BASE, APP_DEST, APP_ROOT, SYSTEM_CONFIG, VERSION} from '../config';
import {META_TAGS, APPLE_ICON_SIZES, GOOGLE_ACCOUNT} from '../config.site';

// TODO: Add an interface to register more template locals.
export function templateLocals() {
  return {
    ENV,
    APP_BASE,
    APP_DEST,
    APP_ROOT,
    META_TAGS,
    APPLE_ICON_SIZES,
    GOOGLE_ACCOUNT,
    SYSTEM_CONFIG,
    VERSION
  };
}
