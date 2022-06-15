
module.exports = function Cart(oldCart) {
    console.log(oldCart)
    this.items= oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id, size){
        var storedItem = this.items[id];

        if(!storedItem){
            storedItem = this.items[id] = {item: item, qty:0, price: 0, size: []};
        }

        if(storedItem.size.indexOf(parseInt(size)) == -1){
            storedItem.size.push(parseInt(size));
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
        console.log(storedItem)
    }

    this.generateArrays = function() {
        var arr = []; //
        for (var i in this.items){
            arr.push(this.items[i])
        }
        return arr
    }
};