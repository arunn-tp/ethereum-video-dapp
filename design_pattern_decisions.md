**Design Pattern Decisions**

This document list the design patterns I chose to implement on this contract to ensure better functionality.
Below are the list of the most common decision patterns I used in the architecture of the contract.

**1. Fail early and fail loud.**
		I have used require statement in most of the public functions *{in VideoToken.sol->transfer(), in VideoTokenSale.sol -> buyVideos(), endSale(), pauseContract()}*, so the contract can create an exception and fails, whenever the condition to those require statements are not met. I have also taken advantage of function modifiers in solidity to create exceptions when ever a condition to call the function is not met.

**2. Restricting Access**
		I have implemented an internal function named *mul()* in VideoTokenSale.sol, this function can only be called from the current contract and not from an external conntract.
		I have also implemeted a private funcion *stopped* in VideoTokenSale.sol, which is later used in circuit breaking pattern of the contract.

**3. Mortal**
		I have implemented the mortal design pattern in VideoTokenSale.sol for function *endSale()*, The contract kills itself and get removed from the blockchain automatically when the video sale is ended. only the owner of the contract can call this function.

**4.Circuit Breaker**
		Circuit Breakers are design patterns that allow contract functionality to be stopped.I have implemented a circuit breaker for function *pauseContract()* in VideoTokenSale.sol. This is called by the owner in case of a situation where a bug has been detected once the contract goes live.


*Thank You.
Arun Thara Purath*