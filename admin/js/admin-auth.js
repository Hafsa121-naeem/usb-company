/**
 * NexDrive Admin Security Module (Disabled - Direct Access Mode)
 */
(function () {
  'use strict';
  window.AdminAuth = {
    isAuthenticated: function () { return true; },
    logout: function () {},
    getToken: function () { return 'open_access'; }
  };
})();
