**Design Pattern Decisions**

This document list the design patterns I chose to implement on this contract to ensure better functionality and the reasons to why I didnt choose the other available design patterns.

**Below are the list of the most common decision patterns I used in the architecture of the contract.**

**1. Fail early and fail loud.**
		I have used require statement in most of the public functions *{in VideoToken.sol->transfer(), in VideoTokenSale.sol -> buyVideos(), endSale(), pauseContract()}*, so the contract can create an exception and fails, whenever the condition to those require statements are not met. I have also taken advantage of function modifiers in solidity to create exceptions when ever a condition to call the function is not met.

**2. Restricting Access**
		I have implemented an internal function named *mul()* in VideoTokenSale.sol, this function can only be called from the current contract and not from an external conntract.
		I have also implemeted a private funcion *stopped* in VideoTokenSale.sol, which is later used in circuit breaking pattern of the contract.

**3. Mortal**
		I have implemented the mortal design pattern in VideoTokenSale.sol for function *endSale()*, The contract kills itself and get removed from the blockchain automatically when the video sale is ended. only the owner of the contract can call this function.

**4.Circuit Breaker**
		Circuit Breakers are design patterns that allow contract functionality to be stopped.I have implemented a circuit breaker for function *pauseContract()* in VideoTokenSale.sol. This is called by the owner in case of a situation where a bug has been detected once the contract goes live.

**Why not other design patters ?**

**1. Speed Bump**
        Speed bumps slow down actions so that if malicious actions occur, there is time to recover. Since this is a near real-time Dapp, the user would want to get the video immedietly after his purchase and the user should be given the liberty to buy any number of videos from the DApp, because of that I didnt want to create a time-bound dependency to create a transaction.

**2. Rate Limiting**
        Rate limiting halts or requires approval for substantial changes, for the same reason that this is a near real-time Dapp and the user would need to buy as many videos he wants with the number of tokens he has, I didnt see a point of restricting the user in getting Video-Tokens because once the end-user gets out of the DAPP because the platform isnt giving him enough tokens to buy the video, then there is no coming back from that user. To have the user interested in this DAPP for the maximum time, i have choose to not have any restrictions on rate.

**3. Restricting the Amount of Ether per user/contract**
        I chose not to use this design pattern to keep the user interested in the Dapp for the most possible time.


*Thank You.*
	*Arun Thara Purath*