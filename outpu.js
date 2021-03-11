// chunk1.js
define(['exports'], function (exports) { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

commonjsGlobal.data = [4, 5, 6];
var shared = commonjsGlobal.data;

exports.* = commonjsGlobal;
exports.default = shared;

});

// thing1.js
define(['./chunk1.js'], function (__chunk1_js) { 'use strict';

__chunk1_js.*.fn = d => d + 1;
var cjs = __chunk1_js.*.fn;

var thing1 = __chunk1_js.default.map(cjs);

return thing1;

});

// thing2.js
define(['./chunk1.js'], function (__chunk1_js) { 'use strict';

var thing2 = __chunk1_js.default.map(d => d + 2);


