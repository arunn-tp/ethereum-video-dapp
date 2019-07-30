const VideoToken = artifacts.require("./VideoToken.sol");
const VideoTokenSale = artifacts.require("./VideoTokenSale.sol");

module.exports = function(deployer) {
	deployer.deploy(VideoToken, 1000000/*initialsupply of the tokens*/).then(function(){
		var tokenPrice = 1000000000000000; //Token Price 0.001 Ether
		return deployer.deploy(VideoTokenSale, VideoToken.address, tokenPrice);
	});
};
