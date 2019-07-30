//var HDWalletProvider = require("truffle-hdwallet-provider");
//const MNEMONIC = 'Are you gonna believe me, if i tell you this is a legit twelve word hash';

module.exports = {
	networks:{
		development:{
			host: "127.0.0.1",
			port: "8545",
			network_id: "*"
		},
		/*Configuration to deploy the DApp on Ropsten Test Net.*/
		ropsten:{
			provider: function() {
				return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/df378a47f60d4f97845ba74065c4281d")
			},
			network_id: 3, //netword id for Ropsten
        	gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    	}
	},
	compilers:{
		solc:{
			version: "0.5.0",
		},
	}
};
