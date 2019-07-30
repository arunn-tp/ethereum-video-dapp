/*
* This contract manages how the user can buy the videos listed on the front-end using our custom Video-Tokens
* This contract has an Event that the front-end listens when ever a video is brought
* This contract contains functionality to facilitate the end-user to buy videos
* This contract contains functionality which allows the owner to end the sale and thus the tokens collected by this contract will be sent ot the owner of the contract
*/
pragma solidity ^0.5.0;

///@title Video Token Sale Contract, manages buying videos and ending the video sale.
///@author Arun Thara Purath
///@notice This contract helps you in gettting an idea as to how the Video-Token is used in buying the videos from the Owner of the videos.
///		   This contract behaves as a escrow contract to manage the token transfer between the end-user and the owner of this contract.
///@dev	All the functions are currently implemeted without any side effects

/*Importing the  ERC20 Video Token for this DAPP*/
import "./VideoToken.sol";

contract VideoTokenSale {
	/*The owner of this contract*/
	address payable owner;
	
	/*
	*A instance of our custom build ERC#20 Compatible VideoToken
	*/
	VideoToken public tokenContract;
	
	/*
	The price of the Video-Token, which the owner of the contract decides while deploying this contract
	*/
	uint256 public tokenPrice;
	
	/*
	*Circuit breaker variable to stop the code in case of an emergency.
	*/
	bool private stopped = false; 
	/*
	*The total numbe of Video-tokens that were sold from this DAPP
	*/
	uint256 public tokensSold;
	
	/*
	* The VideoBought event is transmited to the frontend, whenever a end-user successfully buys a video.
	*/
	event VideoBought(address _buyer, uint256 _amount);

	/*
	* The modifier isTheValueValid(uint256 _numberOfTokens), check if the end-user has sent enough tokens to buy the video.
	* the input params to this modifier is the "number of tokens" the msg.sender, which then is multiplied with the price of Video-token to get the price of video.
	*/
	modifier isTheValueValid(uint256 _numberOfTokens){require(msg.value == mul(_numberOfTokens, tokenPrice),"The value is not enough");_;}

	/*
	* The modifier areThereEnoughTokens(uint256 _numberOfTokens) checks if the msg.sender has enough tokens to interact with the contract.
	* the input params to this modifier is the "number of tokens" the msg.sender wants transfer to the the owner.
	*/
	modifier areThereEnoughTokens(uint256 _numberOfTokens){require(tokenContract.balanceOf(address(this)) >= _numberOfTokens,"The contract doesnt have the requested amount of tokens");_;}

	/*
	* The modifier isOwner(), checks who the owner of this contract is.
	*/
	modifier isOwner(){require(msg.sender == owner,"You're not my dad");_;}

	/*
	* The modifier stopInEmergency(), enables the owner to pause the contract
	*/
	modifier stopInEmergency(){require(!stopped,"Contract has been paused because of an emergency");_;}


	///@author Arun Thara Purath
	///@notice Helps the end-user in knowing the price of each video
	///@dev Assigns the Owner of this contract, The Video-token instance and price of each Video-token.
	///@param _tokenContract An instance of the ERC#20 custom Video-Token and,
	///		  _tokenPrice The Price of each Video-Token, which the owner decides while deploying the contract to Ethereum BlockChain
	constructor(VideoToken _tokenContract, uint256 _tokenPrice)
	public
	{
		owner = msg.sender;
		tokenContract = _tokenContract;
		tokenPrice = _tokenPrice;
	}

	///@author Arun Thara Purath
	///@notice When ever a enduser buys a Video-Token, it's been managed in this function. 
	///@dev An internal function that helps in managing integer overflow and Underflow.
	///@param x and y The 2 values, using which the produc of them is calculated.
	function mul(uint256 x, uint256 y)
	internal
	pure
	returns(uint256 z)
	{
		require(y ==0 || (z = x*y) / y==x);
	}

	///@author Arun Thara Purath
	///@notice This function helps in managing the Video-Token transfer between the the end-user and the owner of this video/contract. 
	///@dev Creates an exception if the user-account doesnt have enough tokens.
	///		Creates an exception if the there aren't enough token in this contract for end-use owner transact
	///		Emits an a event for The UI to lsiten on successful purchase of a video.
	///		If there is an attack the owner can call the Circuit breaked and the function throws an exception
	///@param _numberOfTokens The "no of token" the end-user pays to buy the video. 
	function buyVideos(uint256 _numberOfTokens)
	isTheValueValid(_numberOfTokens)
	areThereEnoughTokens(_numberOfTokens)
	stopInEmergency()
	public
	payable
	{
		require(tokenContract.transfer(msg.sender, _numberOfTokens));
		//keep track of number of tokens sold
		tokensSold += _numberOfTokens;
		emit VideoBought(msg.sender, _numberOfTokens);
	}

	///@author Arun Thara Purath
	///@notice Ends the Video Sale and the end-user cannot transact with this contract anymore after that. 
	///@dev Creates an exception if the account calling this function isnt the owner.
	///		Transfer the remaining Video-tokens in this contract to the owner
	function endSale()
	isOwner()
	public
	{
		require(tokenContract.transfer(owner, tokenContract.balanceOf(address(this))));
		//selfdestruct the contract once the sale is over.
		selfdestruct(owner);
	}

	///@author Arun Thara Purath
	///@notice functionality not really pertaining to the end user. 
	///@dev Circuit breaker Pause Contract functionality.
	///		The owner can stop the contract incase he dectected any attack on the contract
	///		If the Owner initiates an circuit breaker, the current balance of the contract is passed to the owner
	function pauseContract()
	isOwner()
	stopInEmergency()
	public
	{
		stopped = !stopped;
		require(tokenContract.transfer(owner, tokenContract.balanceOf(address(this))));

	}
}