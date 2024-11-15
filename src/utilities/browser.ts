import Stats from '~/lib/stats';

import '~/styles/browser.scss';

(() => {
  /// /////////////////////////////////////////////////////// LOAD
  async function onLoad() {
    // development
    if (import.meta.env.DEV) {
      const stats = new Stats();
      stats.start();
    }
  }

  onLoad();
})();
