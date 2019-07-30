/*This contract identifies each video as a token, this contract is implemeted
on the line of Blockchain ERC-20 tokens.
You can read more about ERC20 tokens from the below wiki link 
https://en.wikipedia.org/wiki/ERC-20 */

pragma solidity ^0.5.0;

///@title A ERC20 sketch of The tokens Used to buy the Video
///@author Arun Thara Purath
///@notice This contract gives you a basic sketch of the tokens used on this ethereum-video-Dapp.
///		   I have not implemented the functionality of all the ERC20 function callbacks, but only the ones I need in successfully completing this dapp.
///		   This contract behaves as a escrow contract to manage the token transfer between the end-user and the owner of this contract.
///@dev	All the functions are currently implemeted without any side effects

contract VideoToken{

	/*
	* Name of the token
	*/ 
	string public name = "Video Token";
	/*
	* A global variable to know the total number of Tokens available in the contract
	*/
	uint256 public totalSupply;

	/*
	* A mapping to store how much Video Tokens each address has
	*/ 
	mapping(address => uint256) public balanceOf;

	/*
	* This "Transfer" event is transmitted back to the UI on a successfull transfer of Video Token
	*/
	event Transfer(address indexed _from, address indexed _to, uint256 _value);
	
	/*
	* The modifier hasEnoughTokens(uint256 _value) checks if the msg.sender has enough tokens to interact with the contract.
	* the input params to this modifier is the "number of tokens" the msg.sender wants transfer to the the owner.
	*/
	modifier hasEnoughToken(uint256 _value){require(balanceOf[msg.sender] >= _value,"Comeback with enough tokens"); _;}
	
	///@author Arun Thara Purath
	///@notice The number of tokens for this dapp is assigned in this constructor.
	///@dev The balance of the owner of this contract has the total number of tokens in this dapp
	///@param _initialSupply the initial supply of tokens to this dapp has been added while deploying this app
	constructor(uint256 _initialSupply)
	public
	{
		balanceOf[msg.sender] = _initialSupply;
		totalSupply = _initialSupply;
	}

	///@author Arun Thara Purath
	///@notice When ever a enduser buys a Video-Token, it's been managed in this function. 
	///@dev Creates an exception if the user-account doesnt have enough tokens,and if they have transfer the number of tokens to the user, from the owner.
	///		Emits an a event for The UI to lsiten on successful transfer
	///@param _to The "to" address to which, the tokens frm this contract has to be transfered, in our case, The Owner. 
	///		  _value The "value" is the number of tokens that has ot be transfered
	///@return returns True when after a successfull tranfer of token 
	function transfer(address _to, uint256 _value)
	public
	hasEnoughToken(_value)
	payable
	returns (bool success){
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;
		emit Transfer(msg.sender, _to, _value);
		return true;
	}
}
