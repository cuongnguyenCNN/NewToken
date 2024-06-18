import "@stdlib/deploy";

message Add {
    queryId: Int as uint64;
    amount: Int as uint32;
}

contract NewToken with Deployable {
    id: Int as uint32;
    counter: Int as uint32;
    name: String;
    symbol: String;
    owner: Address;
    totalSupply: Int as coins;
    sellersCanSell: map<Address, Bool>; 
    balances: map<Address, Int>; 
    init(id: Int, name: String, symbol: String, totalSupply: Int) {
        self.id = id;
        self.name = name;
        self.symbol = symbol;
        self.totalSupply = totalSupply;
        self.owner = context().sender;
        self.counter = 0;
        self.sellersCanSell = emptyMap();
        self.sellersCanSell = emptyMap();
    }

    receive(msg: Add) {
        self.counter += msg.amount;

        // Notify the caller that the receiver was executed and forward remaining value back
        self.notify("Cashback".asComment());
    }
    fun buy(amount: Int ) {
        // Calculate number of tokens to buy

        // Update buyer's balance
        let totalSender: Int? = self.balances.get(sender()) + amount;
        self.balances.set(sender(), totalSender);

        // Update total supply
        self.totalSupply -= amount;
        self.notify("Cashback".asComment());

    }
   fun sell(tokens: Int) {
        // Ensure seller has enough balance
        let tokenSender: Int? = self.balances.get(sender());
        if(tokenSender <tokens) {return "Insufficient balance";}

        // Transfer tokens from seller
        let balanceNow: Int? = self.balances.get(sender()) - tokens;
        self.balances.set(sender(), balanceNow);

        // Update total supply
        self.totalSupply += tokens;
        self.notify("Cashback".asComment());
        // Transfer TONs to seller
    }
    fun addSeller(seller: Address) {
        self.sellersCanSell.set(seller, true);
    }
    fun removeSeller(seller: Address){
        self.sellersCanSell.set(sender(),false);

    }

    get fun counter(): Int {
        return self.counter;
    }

    get fun id(): Int {
        return self.id;
    }
}


