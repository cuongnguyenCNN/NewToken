pragma solidity >= 0.6.0;
pragma AbiHeader expire;
pragma AbiHeader time;

contract Token {
    // Token properties
    uint256 public totalSupply;
    string public name;
    string public symbol;
    address public owner;
    
    // Balances and seller mappings
    mapping(address => uint256) public balances;
    mapping(address => bool) public sellers;

    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event SellerAdded(address indexed seller);
    event SellerRemoved(address indexed seller);

    // Constructor
    constructor(string memory _name, string memory _symbol, uint256 _initialSupply) public {
        owner = msg.sender;
        name = _name;
        symbol = _symbol;
        totalSupply = _initialSupply;
        
        // Assign all tokens to the deployer
        balances[owner] = _initialSupply;
    }

    // Modifier to restrict access to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    // Modifier to restrict access to specific sellers
    modifier onlySellers() {
        require(sellers[msg.sender] == true, "Caller is not allowed to sell");
        _;
    }

    // Buy tokens (any address can call this function)
    function buy() external payable {
        // Calculate number of tokens to buy
        // Assume 1 TON = 1 Token for simplicity
        uint256 tokens = msg.value;

        // Update buyer's balance
        balances[msg.sender] += tokens;

        // Update total supply
        totalSupply += tokens;

        // Emit Transfer event
        emit Transfer(address(0), msg.sender, tokens);
    }

    // Sell tokens (only specific addresses can call this function)
    function sell(uint256 tokens) external onlySellers {
        // Ensure seller has enough balance
        require(balances[msg.sender] >= tokens, "Insufficient balance");

        // Transfer tokens from seller
        balances[msg.sender] -= tokens;

        // Update total supply
        totalSupply -= tokens;

        // Transfer TONs to seller
        uint256 tonToTransfer = tokens;
        payable(msg.sender).transfer(tonToTransfer);

        // Emit Transfer event
        emit Transfer(msg.sender, address(0), tokens);
    }

    // Add an address to the list of allowed sellers
    function addSeller(address seller) external onlyOwner {
        sellers[seller] = true;
        emit SellerAdded(seller);
    }

    // Remove an address from the list of allowed sellers
    function removeSeller(address seller) external onlyOwner {
        sellers[seller] = false;
        emit SellerRemoved(seller);
    }

    // Fallback function to receive TONs
    receive() external payable {}
}
