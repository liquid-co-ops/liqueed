'use strict';

var logic = require('../public/scripts/logic');

exports['accept if all shares were distributed'] = function (test) {
    var result = logic.acceptShares(100,
        [ { amount: '50', note:"Master" }, { amount: '50', note:"Chief" } ]);
        
    test.strictEqual(result, true);
};

exports['reject if too few shares were distributed'] = function (test) {
    var result = logic.acceptShares(100,
        [ { amount: '50' }, { amount: '30' } ]);
        
    test.strictEqual(result, 'You have only distributed 80 shares. You have to distribute 100 shares');
};

exports['reject if too many shares were distributed'] = function (test) {
    var result = logic.acceptShares(100,
        [ { amount: '50' }, { amount: '60' } ]);
        
    test.strictEqual(result, 'You have distributed 110 shares. You can only distribute 100 shares');
};

exports['reject no shares were distributed'] = function (test) {
    var result = logic.acceptShares(100,
        [ { amount: '' }, { amount: '' } ]);
        
    test.strictEqual(result, 'You have only distributed 0 shares. You have to distribute 100 shares');
};

exports['reject if shares are negative'] = function(test) {
  var result = logic.acceptShares(100,
    [ { amount: '101' }, { amount: '-1' } ]);

  test.strictEqual(result, 'You have distributed 101 shares. You can only distribute 100 shares');
};
