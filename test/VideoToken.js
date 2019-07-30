var VideoToken = artifacts.require("./VideoToken.sol");

contract('VideoToken', function(accounts){
	var tokenInstance;
	
	/*
	* This Test check to initializes the contract with the correct values.
	* Successfully pass this test if the name of the token is "Video Token".
	*/
	it('initializes the contract with correct values', function(){
		return VideoToken.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.name();
		}).then(function(name){
			assert.equal(name,'Video Token','it checks the name of the token');
		});
	});
	
	/*
	* This test checks to allocates an initial supply of tokens to the contract.
	* Successfully pass this test if it sets the totalSupply to 1Mil tokens.
	* Successfully pass this test if the totalSupply is allocated to the admin, who is the owner of the contract
	*/
	it('allocates the inital supply upon deployment', function(){
		return VideoToken.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.totalSupply();
		}).then(function(totalSupply){
			assert.equal(totalSupply.toNumber(),1000000,'sets the totalSupply to 1,000,000');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(adminBalance){
			assert.equal(adminBalance.toNumber(),1000000,'it allocates the initial supply to admin account');
		});
	});

	/*
	* This Test transfers the ownership of the video to user.
	* Successfully pass this test, if a Transfer event is emited.
	* Successfully pass this test, transfered amount is added to recieving amount.
	* Successfully pass this test, transfered amount is deducted from sending amount
	*/
	it('transfers video ownership', function(){
		return VideoToken.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.transfer.call(accounts[1],999999999999);
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >=0,'error message must contain revert');
			return tokenInstance.transfer.call(accounts[1],250000,{from: accounts[0] });
		}).then(function(success){
			assert.equal(success,true,'it returns true');
			return tokenInstance.transfer(accounts[1],250000,{from: accounts[0]});
		}).then(function(reciept){
			assert.equal(reciept.logs.length, 1, 'triggers one event');
			assert.equal(reciept.logs[0].event, 'Transfer', 'should be the "Transfer" event');
			assert.equal(reciept.logs[0].args._from,accounts[0], 'logs the account the tokens are transfered from');
			assert.equal(reciept.logs[0].args._to,accounts[1], 'logs the account the tokens are transfered to');
			assert.equal(reciept.logs[0].args._value,250000, 'logs the transfered amount');
			return tokenInstance.balanceOf(accounts[1]);
		}).then(function(balance){
			assert.equal(balance.toNumber(),250000,'adds the amount to the recieving account');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(balance){
			assert.equal(balance.toNumber(), 750000, 'detects the amount from sending account');
		});
	})
})
