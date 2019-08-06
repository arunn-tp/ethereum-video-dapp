//console.log("app.js")
App={
	/*
	* Place holder to save the handle of web3Provider
	*/
	web3Provider: null,
	/*
	* Placeholder to save the deployed smart contracts
	*/
	contracts: {},
	/*
	* Placeholder to save the accounts used in this smart contracts
	*/
	account:'0x0',
	/*
	* Place holder to save the state of the loader, used while the page loads
	*/
	loading:false,
	/*
	* Place holder to save the default token Price
	*/
	tokenPrice:1000000000000000,
	/*
	* Place holder to save the price of each video
	*/
	videoPrice:1,
	/*
	* Place holder to save the vide thumbnail
	*/
	videoPoster:"http://127.0.0.1:8080/ipfs/QmVwSBWS7jqnvPRyM4hvMHNVb5PfDiCESiM1P6mztpbvLV", //Please change to corresponding IPFS Hash of poster.jpg
	/*
	* Place holder to save the vide source
	*/
	videoSource:"http://127.0.0.1:8080/ipfs/QmdR9mo7Y5avZTDjjDEzHddNDU75GdF7Tkp3YGsTM7GiDt", //Please change to corresponding IPFS Hash of video.mp4

	init:function(){
		console.log("Video PLayer initialized...");
		return App.initWeb3();
	},

	initWeb3:function(){
		/*
		*initialize web3
		*/
		if(typeof web3 !== 'undefined'){
			App.web3Provider = web3.currentProvider;
			web3 = new Web3(web3.currentProvider);
		}else{
			App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
			web3 = new Web3(web3.currentProvider);
		}
		return App.initContracts();
	},

	initContracts: function(){
		/*
		* initialize the deployed contracts to their respective handles using the contract json in the build directory.
		*/
		$.getJSON("VideoTokenSale.json", function(videoTokenSale){
			App.contracts.VideoTokenSale = TruffleContract(videoTokenSale);
			App.contracts.VideoTokenSale.setProvider(App.web3Provider);
			App.contracts.VideoTokenSale.deployed().then(function(videoTokenSale){
				console.log("VideoTokenSale contract Address : ", videoTokenSale.address);
			});
		})
		.done(function(){
			$.getJSON("VideoToken.json", function(videoToken){
				App.contracts.VideoToken = TruffleContract(videoToken);
				App.contracts.VideoToken.setProvider(App.web3Provider);
				App.contracts.VideoToken.deployed().then(function(videoToken){
					console.log("VideoToken contract Address : ", videoToken.address);
				});
				return App.render();
			});
		})
	},

	render: function(){
		/*
		* Renders the page
		*/
		if(App.loading){
			return;
		}
		App.loading = true;

		var loader = $('#loader');
		var content = $('#content');

		loader.show();
		content.hide();

		var videoPoster = $('#video-thumbnail');
		videoPoster.attr('poster',App.videoPoster);
		//Load the account address
		web3.eth.getCoinbase(function(err,account){
			if(err === null){
				App.account = account;
				$('#account-address').html("Your account address is "+account);
			}
		})

		App.contracts.VideoTokenSale.deployed().then(function(instance){
			videoTokenSaleInstance = instance;
			return videoTokenSaleInstance.tokenPrice();
		}).then(function(tokenPrice){
			console.log("tokenPrice " +tokenPrice)
			App.tokenPrice = tokenPrice;
			$('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
			App.videoPrice = web3.fromWei(App.tokenPrice,"ether").toNumber() * 1;
			console.log(App.videoPrice);
			$('#buy-button1').html("Buy Video " +  App.videoPrice + "eth");
			App.loading = false;
			loader.hide();
			content.show();
		})
	},

	eventListner : function(){
		/*
		* Listening events that were emitted from contracts
		*/
		App.contracts.VideoTokenSale.deployed().then(function(instance){
			instance.VideoBought({},{
				fromBlock: 0,
				toBlock: 'latest',
			}).watch(function(err, event){
				console.log("Event triggered", event);
				$('#event-msg').html("You just bought a video my dear friend !! Thanks for the support :) {Listening to 'VideoBought' event from smart contract}");
			})

		})
	},

	buyVideo : function(){
		/*
		* Functionality to buy the video.
		*/
		console.log("App.buyVideo()")
		$('#content').hide();
		$('loader').show();
		var numberOfTokens = 1;
		App.contracts.VideoTokenSale.deployed().then(function(instance){
			return instance.buyVideos(numberOfTokens,{
				from: App.account,
				value: numberOfTokens * App.tokenPrice,
				gas: 500000// GasLimit
			});
		}).then(function(result){
			console.log("Video Bought...")
			//here
			var videoPlayer = $('#video-player');
			videoPlayer.show();
			videoPlayer.attr('src',App.videoSource )
			$('form').trigger('reset')
			$('#loader').hide();
			$('#content').show();
			App.eventListner();
		})
	}
}

$(function(){
	$(window).load(function(){
		App.init();
	})
});