
var logic = (function () {
    function acceptShares(amount, data) {
        var total = 0;
        
        data.forEach(function (item) {
            var totalAmount = parseInt(item.amount);
            
            if (isNaN(totalAmount))
                totalAmount = 0;
                
            total += totalAmount;
        });
        
        if (total < amount)
            return 'You have only distributed ' + total + ' shares. You have to distribute ' + amount + ' shares';
            
        if (total > amount)
            return 'You have distributed ' + total + ' shares. You can only distribute ' + amount + ' shares';
            
        return true;
    }
    
    return {
        acceptShares: acceptShares
    }
})();

if (typeof window == 'undefined')
    module.exports = logic;