import "@stdlib/deploy";

message Add {
    queryId: Int as uint64;
    amount: Int as uint32;
}
message AddSeller {
    address: Address;
}
message Buy{
    amount: Int as uint32;
}
message Sell{
    amount: Int as uint32;
}
message SellToAddress{
    address: Address;
    amount: Int as uint32;
}
message RemoveSeller {
    address: Address;
}
struct NameAndSymbol{
    name: String;
    symbol: String;
}
contract NewToken with Deployable {
    id: Int as uint32;
    counter: Int as uint32;
    name: String;
    symbol: String;
    owner: Address;
    totalSupply: Int as uint64;
    sellersCanSell: map<Address, Bool>; 
    balances: map<Address, Int >; 
    init(id: Int, name: String, symbol: String, totalSupply: Int) {
        self.id = id;
        self.name = name;
        self.symbol = symbol;
        self.totalSupply = totalSupply;
        self.owner = context().sender;
        self.counter = 0;
        self.sellersCanSell.set(context().sender, true);
        self.balances.set(context().sender,totalSupply);
    }

    receive(msg: Add) {
        self.counter += msg.amount;

        // Notify the caller that the receiver was executed and forward remaining value back
        self.notify("Cashback".asComment());
    }
    receive(msg: AddSeller)
    {
        require(sender() == self.owner, "You are not owner");
        self.sellersCanSell.set(msg.address, true);
    }
    receive(msg: SellToAddress) {
        // Ensure seller has enough balance
        if(self.balances.get(msg.address)==null )
        {
            self.balances.set(msg.address, 0);
        }
        if(self.balances.get(context().sender)==null )
        {
            self.balances.set(context().sender, 0);
        }
        require(self.balances.get(context().sender)!! >=msg.amount, "Insufficient balance");
        // Transfer tokens from seller
        require(self.sellersCanSell.get(sender()), "Seller can not sell tokens");
        let ctx: Context = context();
        let balanceNow: Int = self.balances.get(ctx.sender)!! - msg.amount;
        let balanceToAddress: Int = self.balances.get(msg.address)!! + msg.amount;
        self.balances.set(context().sender, balanceNow);
        self.balances.set(msg.address, balanceToAddress);
        
        // Update total supply
        self.notify("Cashback".asComment());
        // Transfer TONs to seller
    }
    receive(msg: RemoveSeller)
    {
        require(sender() == self.owner, "You are not owner");
        self.sellersCanSell.set(msg.address, false);
    }

    get fun getBalanceFromSender(): String{
        if(self.balances.get(context().sender) == null)
        {return "Not Found";}
        return self.balances.get(context().sender)!!.toString();
    }
     get fun getBalanceFromAddress(address: Address): Int?{
        return self.balances.get(address);
    }
    get fun isSelledFromAddress(seller: Address): Bool?{
        return self.sellersCanSell.get(seller);
    } 
    get fun owner(): Address {
        return self.owner;
    }
    get fun counter(): Int {
        return self.counter;
    }
    get fun totalSupply(): Int{
        return self.totalSupply;
    }
    get fun id(): Int {
        return self.id;
    }
    get fun nameOfContract() : String {
        return self.name;
    }
    get fun symbolOfContract() : String{
        return self.symbol;
    }
}


