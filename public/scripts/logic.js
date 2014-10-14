
var logic = (function () {
    function acceptShares(amount, data) {
        var total = 0;
        var noteRequiredViolated = false;
        data.forEach(function (item) {
            var totalAmount = parseInt(item.amount);
            
            if (isNaN(totalAmount)  || totalAmount < 0)
                totalAmount = 0;
                
            total += totalAmount;
			if(!item.note)
			{
				noteRequiredViolated = true;
			}
        });
        
        if (total < amount)
            return 'You have only distributed ' + total + ' shares. You have to distribute ' + amount + ' shares';
            
        if (total > amount)
            return 'You have distributed ' + total + ' shares. You can only distribute ' + amount + ' shares';
        if (noteRequiredViolated)
			return 'You should complete notes for all members';
        return true;
    }
    
    return {
        acceptShares: acceptShares
    }
})();

if (typeof window == 'undefined')
    module.exports = logic;