**Ethereum Video Gallery**

**THE WHY ?**
Paid content is increasingly gaining traction, but the monetization of online media goes through a lot of middle-men, this includes the central application, where is video is hosted, the ad-serves that serves the ad to promote this media and a lot other expensive middlemen aggregators along the media workflow pipeline.

Ethereum Video Gallery tries to solve this problem by removing the unnecessory middle-men between the content creator and the content owner and to streamline the royalty payment of originally produced content.

The idea behind this app was to enable the content creator to get most economical value of his content when a user access his created content. 

**What does this project do ?**

Leveraging the advantages of blockchain technology, I have created a contract to that will behave as an ERC#20 Token in this Blockchain DAPP, called them the *Video TOkens* using these video tokens, the end-user can buy the video from the plethora of videos on the platform and pay for them in term on ETH.

This Tokens is gone to the content creator, in our case the owner of the contract, this helps in supporting the individual in creating more such visually pleasing content for the end-users entertainment.

The videos are hosted on a private IPFS platfrom.

**The Setup**
**1.** Git Clone this project to your home directory.

**2.**InterPlanetary File System (IPFS) is a protocol and network designed to create a content-addressable, peer-to-peer method of storing and sharing hypermedia in a distributed file system.

Please follow this link to install IPFS
https://docs.ipfs.io/guides/guides/install/

**3.** Open preferred terminal and type the following commands after setting up IPFS.

	$ cd ~/
	$ ipfs init 
		*run this command only if youre running ipfs for the first time.*
		*output initializing ipfs node at ~/arun/.go-ipfs
				 generating 2048-bit RSA keypair...done
				 peer identity: Qmcpo2iLBikrdf1d6QU6vXuNb6P7hwrbNPW9kLAH8eG67z
				 to get started, enter:
  				 ipfs cat /ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme*

$ ipfs daemon 
	*let the daemon be running on this tab.*

**4.** Open new tab and run the following commands

	$ ipfs add ~/ethereum-video-dapp/resource/poster.jpg
		*output:*
			*added QmVwSBWS7jqnvPRyM4hvMHNVb5PfDiCESiM1P6mztpbvLV poster.jpg
 			17.40 KiB / 17.40 KiB [=========================================] 100.00%*

 	Please save the hash "QmVwSBWS7jqnvPRyM4hvMHNVb5PfDiCESiM1P6mztpbvLV" and paste it on ~/ethereum-video-dapp/src/js/App.js line#30. videoPoster:"http://127.0.0.1:8080/ipfs/QmVwSBWS7jqnvPRyM4hvMHNVb5PfDiCESiM1P6mztpbvLV"

 	$ ipfs add ~/ethereum-video-dapp/resource/video.mp4
 		*output*
 			*added QmdR9mo7Y5avZTDjjDEzHddNDU75GdF7Tkp3YGsTM7GiDt video.mp4
 			7.26 MiB / 7.26 MiB [==========================================] 100.00%*

 	Please save the hash "QmdR9mo7Y5avZTDjjDEzHddNDU75GdF7Tkp3YGsTM7GiDt" and paste it on ~/ethereum-video-dapp/src/js/App.js line#34. videoSource:"http://127.0.0.1:8080/ipfs/QmdR9mo7Y5avZTDjjDEzHddNDU75GdF7Tkp3YGsTM7GiDt"


**5.** Since i have created custom tokens for the user to interact with the DAPP and buy the video. you need to add the 	   tokens into the blockchain after deploying the DApp on your provate blockchain
	   
	   *Ensure GANACHE is running and deployed the code onto your private blockchain*
	   $ truffle migrate --reset --all

	   Add the following code to add tokens to your dapp on the blockchain on truffle console
	   $ truffle console
		
		  truffle(development)> VideoTokenSale.deployed().then(function(i){tokenSale = i;})
		  truffle(development)> VideoToken.deployed().then(function(i){token =i;})
		  truffle(development)> accounts = await web3.eth.getAccounts()
		  truffle(development)> admin = accounts[0]
		  truffle(development)> tokensAvailable = 750000
		  truffle(development)> token.transfer(tokenSale.address, tokensAvailable, {from:admin})

**6.** Come out of the console and run the following commands to run the dapp
		$ npm install
		$ npm run dev

The app should now be running on your local web server.

*Thank You
Arun Thara Purath*