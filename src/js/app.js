// Ben Reichman
try {
    ethereum.enable();
  } catch (e) {
    
    console.log("Type error Worked");
    document.getElementsByTagName("BODY")[0].innerHTML = "";
    alert('Please connect MetaMask or this site can not function properly');
    location.reload();
                     // "@Scratchpad/2:2:3\n"
  }
//window.ethereum.enable();
var capstoneMarketInstance;
var userMerchantStatus = 0;
var productsDiv = document.getElementById("productsTableDiv");
var settingsDiv = document.getElementById("mySettings");
var myOrdersDiv = document.getElementById("myOrdersDiv");
var userBuyerMenu = document.getElementById('MenuBarCustomer');
var sellerMenu = document.getElementById('MenuBarMerchant');
// var uploadNewProductForm = document.getElementById('NewProductUploadDiv');
var uploadNewProductForm = document.getElementById('form-box');
var productsTable = document.getElementById('productsTableDiv');
var merchantOrdersDiv = document.getElementById('merchantOrders');
var merchantOrdersTable = document.getElementById('merchantOrdersTable');
var usersOrdersTable = document.getElementById('usersOrdersTable');
var currentPageElement = document.getElementById('currentPage');
var activeAccountLabel = document.getElementById('activeAccountLabel');
var alertBar = document.getElementById('alertBar');
var messengerDiv = document.getElementById('messengerDiv');
var modalBody = document.getElementById('modalBodyContent');
var msgLocalTemp;
productsArrayLarge = new Array() ;
pageList = new Array();
var currentPageNum = 1;
var numPerPage = 12;
var pgpPubKeyTemp = "";
var numProducts = 0;
var tempToPgpPub;
var web32;
var web3Provider = null;
var contracts = {};
var account = '0x0';
var hasVoted = false;
var newContract;
const compoundCEthContractAddress = '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5';
var compContractInstance;
var cTokenBalance;
var balanceOfUnderlying;
var newContractInstance;
var compContract;
var abiComp;
var abi;


function init(){
    initWeb3();
    ethereum.enable()                                       
}
function initWeb3(){
    if (typeof web3 !== 'undefined') {
        // If a web3 instance is already provided by Meta Mask.
  
        web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
        
        console.log(web3)
   
      } else {
        // Specify default instance if no web3 instance provided
        web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        web3 = new Web3(web3Provider);
  
        console.log("Web3" + web3);
      }
    //   web3Provider = web3.currentProvider;
    //   web3 = new Web3(web3.currentProvider);
      initContract();
}
function initContract(){
    $.getJSON("CapstoneMarket.json", function(CapstoneMarket) {
        // Instantiate a new truffle contract from the artifact
        contracts.CapstoneMarket = TruffleContract(CapstoneMarket);
        // Connect provider to interact with contract
        contracts.CapstoneMarket.setProvider(web3Provider);
         render();
      });
}
function render(){
    var loader = $("#loader");
    var content = $("#content");
    loader.show();
    content.hide();
    var usethis;
    // Load account data
    web3.eth.getCoinbase(function(err, account2) {
      if (err === null) {
        account = account2;
        $("#accountAddress").html("Your Account: " + account);
        useThis=account;
        web3.eth.defaultAccount = account;
        if(account == '0x0' || account == null){
            alert('This website will not work unless you connect to metamask. Thank you for your understanding. Please connect your MetaMask account and click ok');
            location.reload();
        }
        ajaxCall();

        
      }
    });

    // Load contract data
    contracts.CapstoneMarket.deployed().then(function(instance) {
    // instance.address = '0x9189C7A9E07163fCA17D244E4aaDc19C0621067d';
    capstoneMarketInstance = instance;
    console.log("Has been deployed here");
    console.log(instance.address);
    var marketName;
    var numOrders;
        getMarketNameForH1();
        populateProductsTable();
        setUserView();
        checkForMessages();
        fetchMarketVolume();
        fetchMarketFeesEarned();

      
    }).catch(function(error) {
      console.warn(error);
    });
}

function tryThis(){

    ////Get local instance of contract
    abi = [
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "contractFeesEarned",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "ethLockedInContract",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "isMerchant",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "marketName",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "merchantNumOrders",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "merchantOrdersList",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "ordersCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "ordersList",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "orderID",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "customerFirstName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "customerLastName",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "customerID",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "merchantID",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "totalPrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "productID",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "quantity",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "amtPaid",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isFinalized",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "productsCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "productsList",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "merchantID",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "productNo",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "productName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "productPictureURL",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalMarketVolumeAllTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "userNumOrders",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "userOrdersList",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address payable",
          "name": "_cEtherContract",
          "type": "address"
        }
      ],
      "name": "supplyEthToCompound",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_erc20Contract",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_cErc20Contract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_numTokensToSupply",
          "type": "uint256"
        }
      ],
      "name": "supplyErc20ToCompound",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "redeemType",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "_cErc20Contract",
          "type": "address"
        }
      ],
      "name": "redeemCErc20Tokens",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "redeemType",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "_cEtherContract",
          "type": "address"
        }
      ],
      "name": "redeemCEth",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "_productName",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_pictureURL",
          "type": "string"
        }
      ],
      "name": "addProduct",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_productID",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "_quantity",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "_firstName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_lastName",
          "type": "string"
        }
      ],
      "name": "placeOrder",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_productID",
          "type": "uint256"
        }
      ],
      "name": "getProductPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_productID",
          "type": "uint256"
        }
      ],
      "name": "getProductMerchantAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "ownerWithdrawFunds",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "applyForMerchantStatus",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_orderID",
          "type": "uint256"
        }
      ],
      "name": "forMerchantFinalizeOrder",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_orderID",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "_rating",
          "type": "uint8"
        }
      ],
      "name": "forBuyerOrderReview",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "getContractBalanceEthCompoundReturned",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
    newContract =  web3.eth.contract(abi)
    newContractInstance = newContract.at('0x0Bb909b7c3817F8fB7188e8fbaA2763028956E30');
    console.log(newContractInstance);

    //Get instance of CEth
    abiComp = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x06fdde03"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x095ea7b3"},{"constant":false,"inputs":[],"name":"mint","outputs":[],"payable":true,"stateMutability":"payable","type":"function","signature":"0x1249c58b"},{"constant":true,"inputs":[],"name":"reserveFactorMantissa","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x173b9904"},{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"borrowBalanceCurrent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x17bfdfbc"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x18160ddd"},{"constant":true,"inputs":[],"name":"exchangeRateStored","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x182df0f5"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x23b872dd"},{"constant":true,"inputs":[],"name":"pendingAdmin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x26782247"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x313ce567"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOfUnderlying","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x3af9e669"},{"constant":true,"inputs":[],"name":"getCash","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x3b1d21a2"},{"constant":false,"inputs":[{"name":"newComptroller","type":"address"}],"name":"_setComptroller","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x4576b5db"},{"constant":true,"inputs":[],"name":"totalBorrows","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x47bd3718"},{"constant":false,"inputs":[],"name":"repayBorrow","outputs":[],"payable":true,"stateMutability":"payable","type":"function","signature":"0x4e4d9fea"},{"constant":true,"inputs":[],"name":"comptroller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x5fe3b567"},{"constant":false,"inputs":[{"name":"reduceAmount","type":"uint256"}],"name":"_reduceReserves","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x601a0bf1"},{"constant":true,"inputs":[],"name":"initialExchangeRateMantissa","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x675d972c"},{"constant":true,"inputs":[],"name":"accrualBlockNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x6c540baf"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x70a08231"},{"constant":false,"inputs":[],"name":"totalBorrowsCurrent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x73acee98"},{"constant":false,"inputs":[{"name":"redeemAmount","type":"uint256"}],"name":"redeemUnderlying","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x852a12e3"},{"constant":true,"inputs":[],"name":"totalReserves","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x8f840ddd"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x95d89b41"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"borrowBalanceStored","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x95dd9193"},{"constant":false,"inputs":[],"name":"accrueInterest","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xa6afed95"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xa9059cbb"},{"constant":true,"inputs":[],"name":"borrowIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xaa5af0fd"},{"constant":false,"inputs":[{"name":"borrower","type":"address"},{"name":"cTokenCollateral","type":"address"}],"name":"liquidateBorrow","outputs":[],"payable":true,"stateMutability":"payable","type":"function","signature":"0xaae40a2a"},{"constant":true,"inputs":[],"name":"supplyRatePerBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xae9d70b0"},{"constant":false,"inputs":[{"name":"liquidator","type":"address"},{"name":"borrower","type":"address"},{"name":"seizeTokens","type":"uint256"}],"name":"seize","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xb2a02ff1"},{"constant":false,"inputs":[{"name":"newPendingAdmin","type":"address"}],"name":"_setPendingAdmin","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xb71d1a0c"},{"constant":false,"inputs":[],"name":"exchangeRateCurrent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xbd6d894d"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"getAccountSnapshot","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xc37f68e2"},{"constant":false,"inputs":[{"name":"borrowAmount","type":"uint256"}],"name":"borrow","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xc5ebeaec"},{"constant":false,"inputs":[{"name":"redeemTokens","type":"uint256"}],"name":"redeem","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xdb006a75"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xdd62ed3e"},{"constant":false,"inputs":[{"name":"borrower","type":"address"}],"name":"repayBorrowBehalf","outputs":[],"payable":true,"stateMutability":"payable","type":"function","signature":"0xe5974619"},{"constant":false,"inputs":[],"name":"_acceptAdmin","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xe9c714f2"},{"constant":false,"inputs":[{"name":"newInterestRateModel","type":"address"}],"name":"_setInterestRateModel","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xf2b3abbd"},{"constant":true,"inputs":[],"name":"interestRateModel","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xf3fdb15a"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xf851a440"},{"constant":true,"inputs":[],"name":"borrowRatePerBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xf8f9da28"},{"constant":false,"inputs":[{"name":"newReserveFactorMantissa","type":"uint256"}],"name":"_setReserveFactor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xfca7820b"},{"constant":true,"inputs":[],"name":"isCToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xfe9c44ae"},{"inputs":[{"name":"comptroller_","type":"address"},{"name":"interestRateModel_","type":"address"},{"name":"initialExchangeRateMantissa_","type":"uint256"},{"name":"name_","type":"string"},{"name":"symbol_","type":"string"},{"name":"decimals_","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor","signature":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"interestAccumulated","type":"uint256"},{"indexed":false,"name":"borrowIndex","type":"uint256"},{"indexed":false,"name":"totalBorrows","type":"uint256"}],"name":"AccrueInterest","type":"event","signature":"0x875352fb3fadeb8c0be7cbbe8ff761b308fa7033470cd0287f02f3436fd76cb9"},{"anonymous":false,"inputs":[{"indexed":false,"name":"minter","type":"address"},{"indexed":false,"name":"mintAmount","type":"uint256"},{"indexed":false,"name":"mintTokens","type":"uint256"}],"name":"Mint","type":"event","signature":"0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f"},{"anonymous":false,"inputs":[{"indexed":false,"name":"redeemer","type":"address"},{"indexed":false,"name":"redeemAmount","type":"uint256"},{"indexed":false,"name":"redeemTokens","type":"uint256"}],"name":"Redeem","type":"event","signature":"0xe5b754fb1abb7f01b499791d0b820ae3b6af3424ac1c59768edb53f4ec31a929"},{"anonymous":false,"inputs":[{"indexed":false,"name":"borrower","type":"address"},{"indexed":false,"name":"borrowAmount","type":"uint256"},{"indexed":false,"name":"accountBorrows","type":"uint256"},{"indexed":false,"name":"totalBorrows","type":"uint256"}],"name":"Borrow","type":"event","signature":"0x13ed6866d4e1ee6da46f845c46d7e54120883d75c5ea9a2dacc1c4ca8984ab80"},{"anonymous":false,"inputs":[{"indexed":false,"name":"payer","type":"address"},{"indexed":false,"name":"borrower","type":"address"},{"indexed":false,"name":"repayAmount","type":"uint256"},{"indexed":false,"name":"accountBorrows","type":"uint256"},{"indexed":false,"name":"totalBorrows","type":"uint256"}],"name":"RepayBorrow","type":"event","signature":"0x1a2a22cb034d26d1854bdc6666a5b91fe25efbbb5dcad3b0355478d6f5c362a1"},{"anonymous":false,"inputs":[{"indexed":false,"name":"liquidator","type":"address"},{"indexed":false,"name":"borrower","type":"address"},{"indexed":false,"name":"repayAmount","type":"uint256"},{"indexed":false,"name":"cTokenCollateral","type":"address"},{"indexed":false,"name":"seizeTokens","type":"uint256"}],"name":"LiquidateBorrow","type":"event","signature":"0x298637f684da70674f26509b10f07ec2fbc77a335ab1e7d6215a4b2484d8bb52"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldPendingAdmin","type":"address"},{"indexed":false,"name":"newPendingAdmin","type":"address"}],"name":"NewPendingAdmin","type":"event","signature":"0xca4f2f25d0898edd99413412fb94012f9e54ec8142f9b093e7720646a95b16a9"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldAdmin","type":"address"},{"indexed":false,"name":"newAdmin","type":"address"}],"name":"NewAdmin","type":"event","signature":"0xf9ffabca9c8276e99321725bcb43fb076a6c66a54b7f21c4e8146d8519b417dc"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldComptroller","type":"address"},{"indexed":false,"name":"newComptroller","type":"address"}],"name":"NewComptroller","type":"event","signature":"0x7ac369dbd14fa5ea3f473ed67cc9d598964a77501540ba6751eb0b3decf5870d"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldInterestRateModel","type":"address"},{"indexed":false,"name":"newInterestRateModel","type":"address"}],"name":"NewMarketInterestRateModel","type":"event","signature":"0xedffc32e068c7c95dfd4bdfd5c4d939a084d6b11c4199eac8436ed234d72f926"},{"anonymous":false,"inputs":[{"indexed":false,"name":"oldReserveFactorMantissa","type":"uint256"},{"indexed":false,"name":"newReserveFactorMantissa","type":"uint256"}],"name":"NewReserveFactor","type":"event","signature":"0xaaa68312e2ea9d50e16af5068410ab56e1a1fd06037b1a35664812c30f821460"},{"anonymous":false,"inputs":[{"indexed":false,"name":"admin","type":"address"},{"indexed":false,"name":"reduceAmount","type":"uint256"},{"indexed":false,"name":"newTotalReserves","type":"uint256"}],"name":"ReservesReduced","type":"event","signature":"0x3bad0c59cf2f06e7314077049f48a93578cd16f5ef92329f1dab1420a99c177e"},{"anonymous":false,"inputs":[{"indexed":false,"name":"error","type":"uint256"},{"indexed":false,"name":"info","type":"uint256"},{"indexed":false,"name":"detail","type":"uint256"}],"name":"Failure","type":"event","signature":"0x45b96fe442630264581b197e84bbada861235052c5a1aadfff9ea4e40a969aa0"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Transfer","type":"event","signature":"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Approval","type":"event","signature":"0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"}];
    compContract = web3.eth.contract(abiComp);
    compContractInstance = compContract.at('0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5');
    console.log(compContractInstance);
    compContractInstance.balanceOf('0x0Bb909b7c3817F8fB7188e8fbaA2763028956E30',(err,res) =>{
        //console.log(res);
        var result = (res/1e8).toString();
        cTokenBalance = result;
        console.log('My contracts cETH balance: ' + result);
        console.log('Ctoken balance:' + cTokenBalance);
        

    })
    //console.log('Supplied ETH to Compound via MyContract');
       
    //tryThis2();

}

function balanceUnderlying(){
    console.log('Running balance of underlying');
    compContractInstance.balanceOfUnderlying('0x0Bb909b7c3817F8fB7188e8fbaA2763028956E30',(err1,res1) =>{
            if(!err1){
                console.log("Res jere" +res1);
                balanceOfUnderlyingEth = web3.fromWei(res1);
                console.log("ETH supplied to the Compound Protocol:", balanceOfUnderlyingEth);
            }
           else{
                alert('Error!');
           }
            
            
            
    })
}

function tryThis2(){
    // console.log('running trythis2');
    // newContractInstance.marketName((err, res)=>{
    //      console.log('no. of certified students: '+res);
    //    });
    
        // Mint some cETH by sending ETH to the Compound Protocol

        newContractInstance.supplyEthToCompound(
          compoundCEthContractAddress,{
            from: account, // Some Ganache wallet address
            gasLimit: web3.toHex(750000),        // posted at compound.finance/developers#gas-costs
            gasPrice: web3.toHex(20000000000),   // use ethgasstation.info (mainnet only)
            value: web3.toHex(web3.toWei('1', 'ether'))
        },(error,result)=>{
            if(!error){

                console.log('Comp Deposit Successfull');
                console.log(result);

            }
            else{
                console.log(error);
            }
        });
      
        
        // Uncomment this to see the solidity logs
        // console.log(supplyResult.events.MyLog);
      
        

        

      
        // let cTokenBalance = await compContractInstance.balanceOf(myContractAddress).call();
        // cTokenBalance = (cTokenBalance / 1e8).toString();
        
      
        // Call redeem based on a cToken amount

      
        // Call redeemUnderlying based on an underlying amount
        // const amount = web3.utils.toHex(balanceOfUnderlying);
        // const redeemType = false; //false for `redeemUnderlying`
      
        // Retrieve your asset by exchanging cTokens
        
       
      
        // if (redeemResult.events.MyLog.returnValues[1] != 0) {
        //   throw Error('Redeem Error Code: '+redeemResult.events.MyLog.returnValues[1]);
        // }
        
        // cTokenBalance = await 
        //cTokenBalance = (cTokenBalance / 1e8);
        
        //ethBalance = await web3.eth.getBalance(account);
        //ethBalance = ethBalance / 1e18;
        //console.log("MyContract's ETH Balance:", ethBalance);
}

function getContractBalanceCompound(){
    newContractInstance.ethLockedInContract((err,res) =>{
        if(!err){
            console.log("ETH balance of contract, inbcluding fees earned is:" + res/1000000000000000000);
        }
        else{
            console.log(err)
        }
    }) 
}

function redeemCEth(){
    const amount = web3.toHex(cTokenBalance * 1e8);
    console.log("Redeeming and " + amount);
    
    const redeemType = true; // true for `redeem`
    console.log('Running redeem');
    console.log(amount);
    console.log(redeemType);
    console.log(compoundCEthContractAddress);
    newContractInstance.redeemCEth(
        amount,
        redeemType,
        compoundCEthContractAddress
      ,{
        from: account,
        gasLimit: 750000,      // posted at compound.finance/developers#gas-costs
        gasPrice: 20000000000 // use ethgasstation.info (mainnet only)
      },(err,result)=>{
          if(!err){
            console.log(result);
          }
          else{
            console.log(err);
          }
          
          
      });
}

function getMarketNameForH1(){
    capstoneMarketInstance.marketName.call().then(function(result) {
        console.log("Market Name: " + result);
        marketName = result;
        console.log(marketName);
        document.getElementById('marketName').innerHTML = marketName;
        activeAccountLabel.innerHTML += account;
    })    
}

function populateProductsTable(){
    merchantOrdersDiv.style.display = "none";
    capstoneMarketInstance.productsCount.call().then(function(result) {
        console.log('Ran here');
        numProducts = result;
        drawProducts();
    
    })      
}

function drawProducts(){
    for (i = (currentPageNum*12)-12; i<currentPageNum*12; i++){
        if(i<numProducts){
            capstoneMarketInstance.productsList(i).then(function(result) {
               document.getElementById('productsTable').innerHTML += '<div class="col-md-2 rounded" > <div class="card mb-2 shadow-sm"> <img src="'+ result[3]+'" class="rounded" height="150px" width="100%"> <div class="card-body"> <p class="card-text"><h6 class="card-title" style="color:#e9ecef;">'+ result[2]+ '</h6><a data-toggle="modal" href="#myModal" class="btn btn-outline-secondary" onclick="viewVendorModal('+ "'"+result[0]+"'"+')" style="width:100%;font-size:10px;text-align:left;">' + "Vendor: <br>"+result[0] + ' </a><br> ' + '</p> <div class="d-flex justify-content-between align-items-center"> <div class="btn-group"> <button onclick = "placeOrder('+ result[1] +')" type="button" class="btn btn-sm btn-outline-success">Buy</button> </div> <small class="text-muted">'+ parseInt(result[4])/1000000000000000000 +' ETH</small> </div> </div> </div> </div>';
            })
        }
    }  
}

function checkForMessages(){
    //If no messages, make sure you set the notification bootstrap as hidden

    $.ajax({
        url: "messageFetch.php",
        data: {userAddy : account},
        type: "GET",
        dataType:"text",
        success: function(data) {
            if(data!= null && data!=""){
                alertBar.style.display = "block";
                msgLocalTemp = data;
            }
        },
        error: function(jqxhr, textStatus, errorThrown) {
            console.log("jqXHR: ", jqxhr);
            console.log("textStatus: ", textStatus);
            console.log("errorThrown: ", errorThrown);
          }
        });



}

function nextPage(){
    if(currentPageNum*12<=numProducts){
        currentPageNum+=1;
        currentPageElement.innerHTML = currentPageNum;
        document.getElementById('productsTable').innerHTML = "";
        drawProducts();
    }
    else{
        alert('No More items to fetch');
    }
    

}

function previousPage(){
    if(currentPageNum>=2){
    currentPageNum-=1;
    currentPageElement.innerHTML = currentPageNum;
    document.getElementById('productsTable').innerHTML = "";
    drawProducts();
    }
}


function placeOrder(_productID){
    var firstName = prompt("Please eneter your first name:");
    var lastName = prompt("Please eneter your last name:");
    var itemPrice;
    capstoneMarketInstance.productsList(_productID).then(function(result) {
        console.log(parseInt(result[4]));
        itemPrice=parseInt(result[4]);
        //capstoneMarketInstance.placeOrder(_productID,1,firstName,lastName,{from: App.account, gas: 3000000, value: itemPrice});
        return itemPrice;
        
    }).then((itemPrice) => {
        console.log('Item price: '+itemPrice);
        capstoneMarketInstance.placeOrder(_productID,1,firstName,lastName,{from: account, gas: 3000000, value: itemPrice}).then(function(result) {
            console.log(result);
            alert("TxID- " + result.tx);
            location.reload();
        });

    })
}

function ajaxCall(){
    var userActiveAddy = account;
    $.ajax({
        url: "DBcheck.php",
        data: { userAddy: userActiveAddy },
        type: "GET",
        dataType:"json",
        success: function(data) {
            console.log("Logging data");
            console.log(data);
            //var tempArray = JSON.parse(data);
            if(data[0]==0 || data[0] ==2){
                var keyTemp = prompt("Please input your pgp public key or this site will not work. PGP key is crucial in order to maintain secure communications on this site.", "Ex. PGP public key!");
                if(keyTemp!= null && keyTemp != ""){
                    //CODE PGP INSERT INTO DB HERE AJAX
                    $.ajax({
                        url: "pgpInsert.php",
                        data: { tempKey: keyTemp , userAddy: userActiveAddy},
                        type: "GET",
                        dataType:"text",
                        success: function(data) {
                            console.log("AJAX 2 success");
                        },
                        error: function(jqxhr, textStatus, errorThrown) {
                            console.log("jqXHR: ", jqxhr);
                            console.log("textStatus: ", textStatus);
                            console.log("errorThrown: ", errorThrown);
                          }
                        });
                }
                else{
                    location.reload();
                }
            }
            else if(data[0]==1){
                console.log('User has submitted their encryption key already and is good to go');
                //console.log(tempArray);
                pgpPubKeyTemp = data[1];
            }
        },
        error: function(jqxhr, textStatus, errorThrown) {
            console.log("jqXHR: ", jqxhr);
            console.log("textStatus: ", textStatus);
            console.log("errorThrown: ", errorThrown);
          }
        });
    console.log('Runnigng ajax');
    console.log(userActiveAddy);
}

function viewVendorModal(_vendorAddy){
    console.log("View vendor Modal activated");
    console.log(_vendorAddy);
    modalBody.innerHTML = "";
    //Get vendor rating
    //var ratingArray = getVendorRating(_vendorAddy);
    modalBody.innerHTML = "<div style='text-align:center;'><h3>" + _vendorAddy + "</h3></div>";
    getVendorRating(_vendorAddy);
    


}

function getVendorRating(_vendorAddyPassed){
    $.ajax({
        url: "getVendorRating.php",
        data: { vendorAddy: _vendorAddyPassed},
        type: "GET",
        dataType:"json",
        success: function(data) {
            console.log('Loiggin vendor array');
            console.log(data);
            //var ratingArray =  JSON.parse(data);
            modalBody.innerHTML += "<div style='text-align:center;'><img src='" + data[2] + "' style=' height:100px;'></img></div>";
            modalBody.innerHTML += "<div style='text-align:center;'>" + "Positive rating : <span style='color:green'>" + data[0] + "</span></div>";
            modalBody.innerHTML += "<div style='text-align:center;'>" + "Negative rating : <span style='color:red'>" + data[1] + "</span></div><br><br>";
            getVendorFeedback(_vendorAddyPassed);
        },
        error: function(jqxhr, textStatus, errorThrown) {
            console.log("jqXHR: ", jqxhr);
            console.log("textStatus: ", textStatus);
            console.log("errorThrown: ", errorThrown);
          }
        });
}

function getVendorFeedback(_vendorAddyPassed){
    $.ajax({
        url: "getVendorFeedback.php",
        data: { vendorAddy: _vendorAddyPassed},
        type: "GET",
        dataType:"json",
        success: function(data) {
            console.log(data);
            var tempComment;
            var tempPosBool;
            for(var em = 0; em < data.length; em++){
                //Break into individual feedbacks
                var tempArray = data[em].split('|||$$||||');
                tempPosBool = tempArray[0];
                tempComment = tempArray[1];
                if(tempPosBool == "0"){
                    modalBody.innerHTML += "<hr><div>" + '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-hand-thumbs-down-fill"  viewBox="0 0 16 16"><path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z" /></svg><span style="padding-left:15px">' + tempComment+"</span></div><hr>";
                }
                else{
                    modalBody.innerHTML += "<hr><div>" + '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" class="bi bi-hand-thumbs-up-fill"  viewBox="0 0 16 16"><path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" /></svg><span style="padding-left:15px">' + tempComment+"</span></div><hr>";
                }

            }
        },
        error: function(jqxhr, textStatus, errorThrown) {
            console.log("jqXHR: ", jqxhr);
            console.log("textStatus: ", textStatus);
            console.log("errorThrown: ", errorThrown);
          }
        });
}

function leaveFeedback(_orderID, _vendorAddy){
    console.log("Vendor addy for feedback is")

    var _comment = prompt('Enter your review', 'Ex review:....');
    var _posBool = prompt('Positive experience(1) or negative expereince(0)?', '0 or 1');


    if(_posBool == "1" || _posBool == "0"){

        if(_comment != ""){

            $.ajax({
                url: "leaveFeedback.php",
                data: { orderID : _orderID, vendorAddy: _vendorAddy, comment: _comment, posBool : _posBool},
                type: "GET",
                dataType:"text",
                success: function(data) {
                    if(data == 1){
                        location.reload();
                    }
                    
                },
                error: function(jqxhr, textStatus, errorThrown) {
                    console.log("jqXHR: ", jqxhr);
                    console.log("textStatus: ", textStatus);
                    console.log("errorThrown: ", errorThrown);
                  }
                });

        }
        else{
            alert("Please enter a comment...");

        }

    }
    else{
        alert("Please enter either a 1 for a positive experience, or 0 for a negative experience...");

    }
    
}

function merchFinalizeOrder(_orderID){
    capstoneMarketInstance.forMerchantFinalizeOrder(_orderID).then(function(result) {
        console.log(result);
        location.reload();

    })

}

function setUserView(){
    var applyAsSellerBtn = document.getElementById('ApplyAsSeller');
    var enterSellerPortalBtn = document.getElementById('AsSeller');
    capstoneMarketInstance.isMerchant(account).then(function(result) {
        if(result==true){
            applyAsSellerBtn.style.display = "none";
            console.log('User is a merchant');
            userMerchantStatus = true;
        }
        else{
            enterSellerPortalBtn.style.display = "none";
            console.log('User isnt a merchant');
        }
    })
}

/*Functions and variables to switch between 'Products','Orders' and 'Settings' Tab */
function showProductsTab(){    
    settingsDiv.style.display = "none";
    myOrdersDiv.style.display = "none";
    productsDiv.style.display = "block";
    uploadNewProductForm.style.display = "none";
    merchantOrdersDiv.style.display = "none";
    messengerDiv.style.display = "none";
}

function showOrdersTab(){
    settingsDiv.style.display = "none";
    myOrdersDiv.style.display = "block";
    productsDiv.style.display = "none";
    merchantOrdersDiv.style.display = "none";
    messengerDiv.style.display = "none";

    capstoneMarketInstance.userNumOrders.call(account).then(function(result) {
        console.log(parseInt(result));
        tempNum = result;
        var usersOrders = document.getElementById('usersOrdersTable');
        for(var z = 0; z<tempNum;z++){
            usersOrders.innerHTML = "<tr><th> Order ID</th><th> First name</th><th> Last name</th><th> Customer ID</th><th> Merchant ID </th><th> Total price</th><th> Product ID</th><th> Quantity</th><th> Amt paid</th><th> Finalized(Status)</th></tr>";   
            capstoneMarketInstance.userOrdersList.call(account,z).then(function(result) {
                ///console.log('Running for'
                resultMod = parseInt(result);
                console.log("Order #" +z + " ID-" +resultMod);
                capstoneMarketInstance.ordersList(resultMod).then(function(result) {
                var temp;
                    //Check in here if order is finalized, and if so, ajax check if orderid has a feedbackleft. If not, proide button to leave feedback.
                    if(result[9] == 1){
                        //Order is finalized
                        var resultToInt = parseInt(result[0]);
                        console.log(resultToInt);
                        $.ajax({
                            url: "checkOrderHasFeedback.php",
                            data: { orderID: resultToInt},
                            type: "GET",
                            dataType:"text",
                            success: function(data) {
                                console.log('Temp data here' + data);
                                //Order is finalized and feedback hasn't been left yet
                                
                                if(data=="0"){
                                    temp  = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" class="bi bi-check-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/></svg>' + " <button class='btn-outline-success' onclick='leaveFeedback("+result[0]+","+ '"'+result[4]+'"'+")'>" + " Leave Feedback" +"</button>";
                                }
                                //Order is finalized and feedback has already been left
                                else if(data=="1"){
                                    temp = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" class="bi bi-check-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/></svg>'  + " Feedback left";
                                    console.log("data 1 is herew");
                                }

                                usersOrders.innerHTML += "<tr>";
                                    usersOrders.innerHTML += 
                                    "<td>" + result[0] + "</td>" +
                                    "<td>" + result[1] + "</td>" +
                                    "<td>" + result[2] + "</td>" +
                                    "<td>" + result[3] + "</td>" +
                                    "<td>" + result[4] + "</td>" +
                                    "<td>" + result[5]/1000000000000000000 + " ETH</td>" +
                                    "<td>" + result[6] + "</td>" +
                                    "<td>" + result[7] + "</td>" +
                                    "<td>" + result[8]/1000000000000000000 + " ETH</td>" +
                                    "<td>" + temp + "</td>" +
                                    "</tr>";
                            },
                            error: function(jqxhr, textStatus, errorThrown) {
                                console.log("jqXHR: ", jqxhr);
                                console.log("textStatus: ", textStatus);
                                console.log("errorThrown: ", errorThrown);
                              }
                            });

                    }
                    else{
                        //Order Not finalized yet
                        temp = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-x-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>';
                        console.log('Temp else ran');

                        usersOrders.innerHTML += "<tr>";
                        usersOrders.innerHTML += 
                        "<td>" + result[0] + "</td>" +
                        "<td>" + result[1] + "</td>" +
                        "<td>" + result[2] + "</td>" +
                        "<td>" + result[3] + "</td>" +
                        "<td>" + result[4] + "</td>" +
                        "<td>" + result[5]/1000000000000000000 + " ETH</td>" +
                        "<td>" + result[6] + "</td>" +
                        "<td>" + result[7] + "</td>" +
                        "<td>" + result[8]/1000000000000000000 + " ETH</td>" +
                        "<td>" + temp + "</td>" +
                        "</tr>";

                    }
                })
            })
        }
        usersOrdersTable.style.dipslay = "block";
    });
}


function showSettingsTab(){
    settingsDiv.style.display = "block";
    myOrdersDiv.style.display = "none";
    productsDiv.style.display = "none";
    usersOrdersTable.style.dipslay = "none";
    myOrdersDiv.style.display = "none";
    uploadNewProductForm.style.display = "none";
    merchantOrdersTable.style.display = "none";
    messengerDiv.style.display = "none";
}

function isUserMerchant(){
    capstoneMarketInstance.isMerchant(account).then(function(result) {
        return(result);
    })
}

function enterSellerPortal(){
    if(userMerchantStatus==1){
        console.log('Seller Portal entered');
        userBuyerMenu.style.display = "none";
        sellerMenu.style.display = "block";
        productsTable.style.display = "none";
        myOrdersDiv.style.display = "none";
        merchantOrdersTable.style.display = "block";
        merchantOrdersDiv.style.display = "block";
        settingsDiv.style.display = "none";
        messengerDiv.style.display = "none";
        showMerchantOrders();
    }
    else{

    }
}

function enterMarketPortal(){
    console.log('Market Portal entered');
    userBuyerMenu.style.display = "block";
    sellerMenu.style.display = "none";
    uploadNewProductForm.style.display = "none";
    myOrdersDiv.style.display = "none"; 
    productsTable.style.display = "block";
    merchantOrdersDiv.style.display = "none";
    merchantOrdersTable.style.display = "none";
    settingsDiv.style.display = "none";
    messengerDiv.style.display = "none";
}

function showMerchantOrders(){
    merchantOrdersDiv.style.display = "block";
    merchantOrdersTable.style.display = "";
    uploadNewProductForm.style.display = "none";
    messengerDiv.style.display = "none";
    settingsDiv.style.display = "none";
    merchantOrdersTable.innerHTML = "<tr><th> Order ID</th><th> Product ID</th><th> First name</th><th> Last name</th><th> Customer ID</th><th> Amt paid</th><th> Quantity</th><th> Finalized(Status)</th></tr>";
    //merchantOrders.innerHTML = "";
    capstoneMarketInstance.merchantNumOrders.call(account).then(function(result) {
        var merchNumOrdersTemp = parseInt(result);
        console.log("Merchant has #Orders- " + merchNumOrdersTemp);
        for(var x = 0; x<merchNumOrdersTemp; x++){

            capstoneMarketInstance.merchantOrdersList.call(account,x).then(function(result) {
                var tempInt = parseInt(result);
                capstoneMarketInstance.ordersList(tempInt).then(function(result) {
                    console.log("Order #" +x+ " " + result);
                    var tempPlacer;
                    if(result[9] == 1){
                        tempPlacer =  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" class="bi bi-check2-circle" viewBox="0 0 16 16"><path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"/><path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/></svg>';
                        tempPlacer+= " True";
                     }
                     else if(result[9] == 0){
                         console.log('Working just as expected');
                         tempPlacer =  '<button class="btn btn-outline-success btn-sm" onclick=" merchFinalizeOrder('+ result[0] +')">Finalize Order</button>';
                     }
                    merchantOrdersTable.innerHTML += "<tr>";
                    merchantOrdersTable.innerHTML += "<td>" + result[0] + "</td>"+
                     "<td>" + result[6] + "</td>"
                     +"<td>" + result[1] + "</td>"
                     + "<td>" + result[2] + "</td>"
                     + "<td>" + result[3] + "</td>"
                     + "<td>" + parseInt(result[8])/1000000000000000000 + " ETH</td>"
                     + "<td>" + result[7] + "</td> " + "<td>"+tempPlacer +"</td>"

                    
                     
                     + "</tr>";
                })
            })
        }
    }) 
}

function showMerchantStats(){
    console.log('Vendor modal showing' + account);
    var accountString = String(account);
    viewVendorModal(accountString);

}

function fetchMarketVolume(){
    capstoneMarketInstance.totalMarketVolumeAllTime.call().then(function(result) {
        var marketVolSpan = document.getElementById('marketValue');
        marketVolSpan.innerHTML += result/1000000000000000000 + "ETH";
    })
}

function fetchMarketFeesEarned(){

    capstoneMarketInstance.contractFeesEarned.call().then(function(result) {
        var marketFeesSpan = document.getElementById('marketFeesSpan');
        marketFeesSpan.innerHTML += result/1000000000000000000 + "ETH";
    })

}

function showNewProductTab(){
    productsDiv.style.display = "none";
    settingsDiv.style.display = "none"; 
    myOrdersDiv.style.display = "none"; 
    merchantOrdersDiv.style.display = "none";
    messengerDiv.style.display = "none";
    uploadNewProductForm.style.display = "block";
}

function showMsgTab(){
    productsDiv.style.display = "none";
    settingsDiv.style.display = "none"; 
    myOrdersDiv.style.display = "none"; 
    merchantOrdersDiv.style.display = "none";
    uploadNewProductForm.style.display = "none";
    messengerDiv.style.display = "block";
}


function submitNewProduct(){
    var newProductName = document.getElementById('prodName').value;
    var newProductPriceETH = document.getElementById('priceETH').value;
    newProductPriceETH = parseInt(newProductPriceETH);
    var newProductPicURL = document.getElementById('pictureURL').value;
    capstoneMarketInstance.addProduct(newProductName, newProductPriceETH, newProductPicURL).then(function(result) 
    {
        console.log(result);
        location.reload();
    })
}

function updatePGPkey(){
    var newPGP = document.getElementById('inputPGP').value;

    $.ajax({
        url: "pgpUpdate.php",
        data: { newPGP1 : newPGP, currAcc : account},
        type: "GET",
        dataType:"text",
        success: function(data) {
            alert('PGP key changed succesfully');
        },
        error: function(jqxhr, textStatus, errorThrown) {
            alert('PGP key change failed');
            console.log("jqXHR: ", jqxhr);
            console.log("textStatus: ", textStatus);
            console.log("errorThrown: ", errorThrown);
          }
        });
}

function activateMessagesModal(){
    var messages = msgLocalTemp.split("?!END??");
    console.log("Message Array is logging.....");
    console.log(messages);
    messages.pop();
    var individualMsg;
    var modalBodyContentMessages = document.getElementById('modalBodyContentMessages');
    modalBodyContentMessages.innerHTML = "";
    for(var c=0; c<messages.length;c++){
        individualMsg = messages[c].split('|||||');
        // console.log('Message ' + c + " is " );
        modalBodyContentMessages.innerHTML += 'Reciever: ' +individualMsg[0] + '<br>';
        modalBodyContentMessages.innerHTML += 'Sender: ' +individualMsg[1] + '<br>';
        modalBodyContentMessages.innerHTML += 'Message: ' +individualMsg[2] + '<br>';
        modalBodyContentMessages.innerHTML += 'Time: ' +individualMsg[3] + '<br>';
        modalBodyContentMessages.innerHTML += 'Message ID: ' +individualMsg[4] + '<br>';
        modalBodyContentMessages.innerHTML += '<div id="destroyButton"><button type="button" class="btn btn-outline-danger" onclick="destroyMessage('+ individualMsg[4] +')" >Destroy</button></div>';
        modalBodyContentMessages.innerHTML += '<hr>';
    }
}

function sendMessage1(){
    console.log('Sending message:');
    getUserPgpPub();
}

function getUserPgpPub(){
    //Message send continuation. Cannot be used as standalone.
    var toAddress = document.getElementById('toAddressTextArea').value;
    var msgTemp = document.getElementById('msgTextArea').value;

    $.ajax({
        url: "forMsgGetUserPGP.php",
        data: { desiredUserAddy : toAddress},
        type: "GET",
        dataType:"text",
        success: function(data) {
           console.log('Check out this data - ' + data);
           tempToPgpPub = data;
           console.log("Sending message and users desired pgp is:" + tempToPgpPub);
           if(toAddress != "" && msgTemp != ""){
            (async () => {
                $.ajax({
                    url: "sendMessage.php",
                    data: { fromAddy: account,toAddy: toAddress, msg: msgTemp},
                    type: "GET",
                    dataType:"text",
                    success: function(data) {
                        if(data=="1"){
                            alert('Message sent successfully');
                            location.reload();
                        }
                        else{
                            alert('Message send failed.');
                        }
                    },
                    error: function(jqxhr, textStatus, errorThrown) {
                        alert('Error');
                        console.log("jqXHR: ", jqxhr);
                        console.log("textStatus: ", textStatus);
                        console.log("errorThrown: ", errorThrown);
                      }
                    });
            })();        
        }
        else{
            alert('You need to fill in all fields. Please try again.');
        }
    
            


        },
        error: function(jqxhr, textStatus, errorThrown) {
            alert('Error');
            console.log("jqXHR: ", jqxhr);
            console.log("textStatus: ", textStatus);
            console.log("errorThrown: ", errorThrown);
          }
        });

}

function destroyMessage(_msgID){
    $.ajax({
        url: "destroyMessage.php",
        data: { msgID: _msgID },
        type: "GET",
        dataType:"text",
        success: function(data) {
            console.log('Destroy data here' + data);
            if(data=="1"){
                alert('Message permanently destroyed!');
                location.reload();
            }
            else{
                alert('Message could not be destroyed...');
            }
            
        },
        error: function(jqxhr, textStatus, errorThrown) {
            alert('Error');
            console.log("jqXHR: ", jqxhr);
            console.log("textStatus: ", textStatus);
            console.log("errorThrown: ", errorThrown);
          }
        });

}

window.ethereum.on('chainChanged', () => {
    document.location.reload();
})

  window.ethereum.on('accountsChanged', function (accounts) {
    // Time to reload your interface with accounts[0]!
    document.location.reload();
    
})

function testReturn(){
    var arr = [];
    $("#productsTable tr").each(function(){
        arr.push($(this).find("td:eq(1)").text()); //put elements into array
    });
}

$(function(){
    $('#ApplyAsSeller').click(function() {
        console.log("Applying as merchant");
        capstoneMarketInstance.applyForMerchantStatus({from: account, gas: 3000000, value: 100000000000000000}).then(function(result){
            location.reload();
        });
        
    });
});

$( "td" ).click(function() {
    alert($(this).text());
});

// $( "tryThis" ).click(function() {
//     alert($(this).text());
// });

$(function() {
  $(window).load(function() {
    init();
    showProductsTab();
  });
});


