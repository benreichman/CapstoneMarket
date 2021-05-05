pragma solidity ^0.5.12;


import './CErc20.sol';
import './CEth.sol';
import './Erc201.sol';

contract CapstoneMarket{
    
   string public marketName;
   address payable adminAddress;
   Order[1000] public ordersList;
   Product[1000] public productsList;
   uint256 public productsCount;
   uint256 public ordersCount;
   uint256 public contractFeesEarned;
   uint256 public totalMarketVolumeAllTime;
   uint256 public ethLockedInContract;
   // Mapping of users to uint256 userNumOrders : Assigns users a number of orders variable;
   mapping(address => uint256) public userNumOrders;
   //Mapping of users to an array of uint256 orderID's: Assigns user an array of orderID's;
   mapping(address => uint256[]) public userOrdersList;
   //
    mapping(address => uint256) public merchantNumOrders;
   //
    mapping(address => uint256[]) public merchantOrdersList;
   //Mapping to keep track of addresses who have merchant stauts
   mapping(address => bool) public isMerchant;
   //Mapping to keep track of OrderID's, and the order review rating;
   mapping(uint256 => uint256) orderScale1To10Rating;
   //Mapping to keep track of order status( finalized or pending)
   mapping(uint256 => bool) isOrderFinalized;

   
    
    
    constructor() public{
        marketName = "Capstone Market";
        productsCount = 0;
        ordersCount = 0;
        adminAddress = msg.sender;
        contractFeesEarned = 0;
        totalMarketVolumeAllTime = 0;
    }
    
    struct Product {
        address payable merchantID;
        uint256 productNo;
        string productName;
        string productPictureURL;
        uint256 price;
    }
    
    //Define an Order -> Struct
    struct Order {
        uint256 orderID;
        string customerFirstName;
        string customerLastName;
        address customerID;
        address merchantID;
        uint256 totalPrice;
        uint256 productID;
        uint8 quantity;
        uint256 amtPaid;
        bool isFinalized;
    }
    
    struct Merchant{
        address merchantAddress;
        uint256 rating;
        uint256 numOrders;
        Product[] products;
        string[] feedback;
    }
    
    //Compound code 
    function supplyEthToCompound(address payable _cEtherContract)
        public
        payable
        returns (bool)
    {
        // Create a reference to the corresponding cToken contract
        CEth cToken = CEth(_cEtherContract);

        // Amount of current exchange rate from cToken to underlying
        uint256 exchangeRateMantissa = cToken.exchangeRateCurrent();
     

        // Amount added to you supply balance this block
        uint256 supplyRateMantissa = cToken.supplyRatePerBlock();


        cToken.mint.value(msg.value).gas(250000)();
        return true;
    }
    
    function supplyErc20ToCompound(
        address _erc20Contract,
        address _cErc20Contract,
        uint256 _numTokensToSupply
    ) public returns (uint) {
        // Create a reference to the underlying asset contract, like DAI.
        Erc201 underlying = Erc201(_erc20Contract);

        // Create a reference to the corresponding cToken contract, like cDAI
        CErc20 cToken = CErc20(_cErc20Contract);

        // Amount of current exchange rate from cToken to underlying
        uint256 exchangeRateMantissa = cToken.exchangeRateCurrent();
        

        // Amount added to you supply balance this block
        uint256 supplyRateMantissa = cToken.supplyRatePerBlock();
       

        // Approve transfer on the ERC20 contract
        underlying.approve(_cErc20Contract, _numTokensToSupply);

        // Mint cTokens
        uint mintResult = cToken.mint(_numTokensToSupply);
        return mintResult;
    }

    function redeemCErc20Tokens(
        uint256 amount,
        bool redeemType,
        address _cErc20Contract
    ) public returns (bool) {
        // Create a reference to the corresponding cToken contract, like cDAI
        CErc20 cToken = CErc20(_cErc20Contract);

        // `amount` is scaled up by 1e18 to avoid decimals

        uint256 redeemResult;

        if (redeemType == true) {
            // Retrieve your asset based on a cToken amount
            redeemResult = cToken.redeem(amount);
        } else {
            // Retrieve your asset based on an amount of the asset
            redeemResult = cToken.redeemUnderlying(amount);
        }

        // Error codes are listed here:
        // https://compound.finance/developers/ctokens#ctoken-error-codes
        
        require(redeemResult == 0, "redeemResult error");
        ethLockedInContract = address(this).balance;
        return true;
    }
    
    function redeemCEth(
        uint256 amount,
        bool redeemType,
        address _cEtherContract
    ) public{
        // Create a reference to the corresponding cToken contract
        CEth cToken = CEth(_cEtherContract);

        // `amount` is scaled up by 1e18 to avoid decimals

        uint256 redeemResult;

        if (redeemType == true) {
            // Retrieve your asset based on a cToken amount
            redeemResult = cToken.redeem(amount);
            ethLockedInContract = address(this).balance;
        } else {
            // Retrieve your asset based on an amount of the asset
            redeemResult = cToken.redeemUnderlying(amount);
            ethLockedInContract = address(this).balance;
        }

        // Error codes are listed here:
        // https://compound.finance/docs/ctokens#ctoken-error-codes
       
    }
    
    
    ///////ENDS
    //Add Product (required that caller is contract deployer, aka msg.sender (adminAddress)). Input price in ether!! Function will convert to wei amount
    function addProduct(string memory _productName, uint256 _price, string memory _pictureURL) public {
        require(isMerchant[msg.sender]);
        productsList[productsCount] = Product(msg.sender,productsCount,_productName,_pictureURL,_price*1000000000000000000);
        productsCount++;
    }
    
    //Place order and require that msg.value >= order total price.
    function placeOrder(uint256 _productID, uint8 _quantity, string memory _firstName, string memory _lastName) public payable{
        uint256 getLocalProductPrice = getProductPrice(_productID);
        //msg.value(getLocalProductPrice*_quantity);
        require(msg.value >= (getLocalProductPrice*_quantity));
        ordersList[ordersCount] = Order(ordersCount, _firstName,_lastName,msg.sender,getProductMerchantAddress(_productID),getLocalProductPrice*_quantity,_productID,_quantity, msg.value,false);
        userNumOrders[msg.sender]++;
        userOrdersList[msg.sender].push(ordersCount);
        merchantOrdersList[getProductMerchantAddress(_productID)].push(ordersCount);
        merchantNumOrders[getProductMerchantAddress(_productID)]++;
        ordersCount++;
        //1%orderfee
        uint256 orderFee =  (msg.value * 1)/100;
        //getProductMerchantAddress(_productID).transfer(orderAmtFeeDeducted);
        //Update contracts fees earned variable to keep track
        contractFeesEarned+=(orderFee);
        totalMarketVolumeAllTime += msg.value;
        
    }
    
    //Gets Price of product (input productID) and returns it. Use this function for fetching prices for orders etc. Returns price in wei. To convert to ETH, *100000000000000000
    function getProductPrice(uint256 _productID) public returns(uint256){
        return (productsList[_productID].price);
    }
    
    //Get Product Merchant
     function getProductMerchantAddress(uint256 _productID) public returns(address){
        return productsList[_productID].merchantID;
    }
    
    //Withdraws market funds to contract deployer (msg.sender)
    function ownerWithdrawFunds() public {
        require(msg.sender==adminAddress);
        adminAddress.transfer(contractFeesEarned);
        contractFeesEarned=0;
    }
    
    //Apply to be a merchant
    function applyForMerchantStatus() public payable{
        //Require that address pays a .1ETH fee
        require(msg.value==100000000000000000);
        //Require that address isn't already a merchant.
        require(isMerchant[msg.sender] == false);
        isMerchant[msg.sender] = true;
        contractFeesEarned += msg.value;
    }
    
    //Merchant finalize order to recieve funds 
    function forMerchantFinalizeOrder(uint256 _orderID) public {
        require(msg.sender == ordersList[_orderID].merchantID);
        ordersList[_orderID].isFinalized = true;
        address payable merchAddyTemp = address(uint160(ordersList[_orderID].merchantID));
        //1% sales tax exercised on seller
        merchAddyTemp.transfer(((ordersList[_orderID].amtPaid)* 99) / 100 );
    }
    
    //Buyer review order
    function forBuyerOrderReview(uint256 _orderID, uint8 _rating) public{
        require(msg.sender == ordersList[_orderID].customerID);
        require(isOrderFinalized[_orderID]);
        orderScale1To10Rating[_orderID] = _rating;
    }
    
    function getContractBalanceEthCompoundReturned() public returns(uint256){
        return address(this).balance;
    }
        
    ////////GETTER FUNCTIONS PROVIDED FREE BY SOLIDITY, THUS THEY ARE LEFT OUT HERE
    // function getOrder(uint256 _orderID ) public returns(uint256,string memory, string memory, address, uint256, uint256, uint8 ){
    //     require(msg.sender==adminAddress); 
    //     return(ordersList[_orderID].orderID, 
    //         ordersList[_orderID].customerFirstName, 
    //         ordersList[_orderID].customerLastName, 
    //         ordersList[_orderID].customerID, 
    //         ordersList[_orderID].totalPrice, 
    //         ordersList[_orderID].productID, 
    //         ordersList[_orderID].quantity);
    // }
    
    // function getProduct(uint256 _productID) public returns(uint256,string memory, string memory, uint256){
    //     return(productsList[_productID].productNo,
    //         productsList[_productID].productName,
    //         productsList[_productID].productPictureURL,
    //         productsList[_productID].price);
        
    // }
    // This is needed to receive ETH when calling `redeemCEth`
    function() external payable {}
    
}