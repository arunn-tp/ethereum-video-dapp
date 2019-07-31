**Avoiding Common Attacks**

This documents give you an idea of the measures I took and how I architectured this Dapp to avoid common attacks on the smart contract.

**1.Integer OverFlow and UnderFlow**
		While in necessity of a mulitiplication function, and to avoid integer overflow and underflow to the product of the parameters. I have implemented a *mul()* function in VideoTokenSale.sol, this is an internal function that returns the multiplication of two unsigned integers, reverting on Overflow.

**2.Force Sending Ether**
		Using the logic that depends on contract balance is an open invitation to danger. I have used the *self destruct* function on *endSale()* This will kill the contract and remove it from the blockchain. Using the *selfdestruct* function on another contract and using the target contract as the recipient will force the destroyed contract’s funds to be sent to the target.
		
**3.Denial of Service by Block Gas Limit**
		There is a limit to how much computation can be included in a single Ethereum block, So while calling the *buyVideos()* in VideoTokenSale.sol from *app.js*, I have added meta-data to control the gas-limit on this function call.

*Thank You*
	*Arun Thara Purath*
