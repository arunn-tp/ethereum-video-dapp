var VideoTokenSale = artifacts.require("./VideoTokenSale.sol");
var VideoToken = artifacts.require("./VideoToken.sol");

contract('VideoTokenSale', function(accounts) {
	var tokenSaleInstance;
	var tokenInstance;
	var admin = accounts[0];
	var buyer = accounts[1];
	var tokensAvailable = 750000;
	var tokenPrice = 1000000000000000; // in wei
	var numberOfTokens;

	/*
	* This Test check to initializes the contract with the correct values.
	* Successfully pass this test, if the msg.sender is the deploying account address.
	* Successfully pass this test, tokenPrice is 1000000000000000 wei.
	*/
	it('initializes the contract with the right values', function(){
		return VideoTokenSale.deployed().then(function(instance){
			tokenSaleInstance = instance;
			return tokenSaleInstance.address;
		}).then(function(address){
			assert.notEqual(address, 0x0, "contract address");
			return tokenSaleInstance.tokenContract();
		}).then(function (address) {
			assert.notEqual(address, 0x0, "token contract address");
			return tokenSaleInstance.tokenPrice();
		}).then(function(price){
			assert.equal(price, tokenPrice, 'correct token price.');
		});
	});

	/*
	* This Test checks to ensure prchase of the video.
	* Successfully pass this test, if the VideoBought event is emitted to the frontend.
	* Successfully pass this test, msg.value is enough to buy the tokens.
	* Successfully pass this test, there are enough tokens to transact with this contract.
	*/	
	it('Ensure Video Buyin', function(){
		return VideoToken.deployed().then(function(instance){
			// Grab Token instance first 
			tokenInstance = instance;
			return VideoTokenSale.deployed();
		}).then(function(instance){
			// then grant VideoTokenSale instance
			tokenSaleInstance = instance;
			//Provision 75 % of all tokens to token Sale.
			return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable,{from: admin});
		}).then(function(reciept){
			numberOfTokens = 10;
			return tokenSaleInstance.buyVideos(numberOfTokens,{from: buyer, value: numberOfTokens * tokenPrice})
		}).then(function(reciept){
			assert.equal(reciept.logs.length, 1, 'triggers one event');
			assert.equal(reciept.logs[0].event, 'VideoBought', 'should be the "Sell" event');
			assert.equal(reciept.logs[0].args._buyer, buyer, 'logs the account the tokens were purchased');
			assert.equal(reciept.logs[0].args._amount, numberOfTokens, 'logs the number of Tokens purchased');
			return tokenSaleInstance.tokensSold();
		}).then(function(amount){
			assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of Tokens Sold');
			return tokenInstance.balanceOf(buyer);
		}).then(function(balance){
			assert.equal(balance.toNumber(),numberOfTokens);
			return tokenInstance.balanceOf(tokenSaleInstance.address);
		}).then(function(balance){
			assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens); 
			//Try to buy tokens different from ether value
			return tokenSaleInstance.buyVideos(numberOfTokens,{from: buyer, value: 1});
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "msg.value should valid to buy enough tokens");
			return tokenSaleInstance.buyVideos(800000,{from: buyer, value: numberOfTokens * tokenPrice});
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "cannot purchase more tokens than available");
		});
	});
	
	/*
	* This Test checks to ensure prchase of the video.
	* Successfully pass this test, if the Owner address and deployed address is same.
	* Successfully pass this test, if the contract returns the unsold Video-Tokens to owner.
	*/
	it('end Tokens Sale', function(){
		return VideoToken.deployed().then(function(instance){
			// Grab Token instance first 
			tokenInstance = instance;
			return VideoTokenSale.deployed();
		}).then(function(instance){
			// then gran VideoTokenSale instance
			tokenSaleInstance = instance;
			//Trying to end sale from account other than the admin
			return tokenSaleInstance.endSale({from:buyer});
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, 'only admin can send the sale')
			//End sale as admin
			return tokenSaleInstance.endSale({from:admin});
		}).then(function(reciept){
			return tokenInstance.balanceOf(admin);			
		}).then(function(balance){
			assert.equal(balance.toNumber(),999990,'returns unsold video tokens to admin');
		});
	})
});