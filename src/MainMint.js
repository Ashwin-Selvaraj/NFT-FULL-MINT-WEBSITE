import React, { useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import contractABI from "./AshPunksNFT.js";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
// Chakra - we can specify the css classes directly inside the jsx

const ashPunksNFTAddress = "0x1209BEBe3Ef988052Ce1110d17bB2F430a8f0441";
const MainMint = ({ accounts, setAccounts }) => {
  // this is going gto determine the quantity of mint
  const [mintAmount, setMintAmount] = useState(1);
  const isConnected = Boolean(accounts[0]);
  const [withdrawError, setWithdrawError] = useState();
  const [withdrawSuccess, setWithdrawSuccess] = useState();

  async function handleMint() {
    setWithdrawError("");
    setWithdrawSuccess("");
    if (window.ethereum) {
      const web3Modal = new Web3Modal();
      // Web3Modal is a library that simplifies the process of connecting to a user's Ethereum wallet, like MetaMask.
      const connection = await web3Modal.connect();
      //A Provider is an abstraction of a connection to the Ethereum network
      const provider = new ethers.BrowserProvider(connection);
      console.log(provider);
      //   const provider = new ethers.BrowserProvider(window.ethereum);
      if (provider) {
        try {
          const getnetwork = await provider.getNetwork();
          const sepoliaChainId = 11155111;

          if (getnetwork.chainId != sepoliaChainId) {
            alert("please switch to Ethereum Sepolia Testnet");
            return;
          }
        } catch (err) {
          console.error(err.message);
        }
      }
      const signer = await provider.getSigner();
      console.log(signer);
      const contract = new ethers.Contract(
        ashPunksNFTAddress,
        contractABI,
        signer
      );
      try {
        // Solidity requires BigNumber to be used
        const response = await contract.mint(mintAmount, {
          value: ethers.parseEther((0.02 * mintAmount).toString()),
        });
        await response.wait();
        setWithdrawSuccess("Minting successful - enjoy NFTs!");
        console.log(response.hash);
      } catch (error) {
        if (error.message.search("minting not enabled") !== -1)
          setWithdrawError("Minting is not enabled by the Owner");
        else if (
          error.message.search(
            "Wrong mint value or insufficient funds to mint"
          ) !== -1
        )
          setWithdrawError(
            "Wrong mint value(0.02 ether) or insufficient funds to mint"
          );
        else if (error.message.search("Sold out") !== -1)
          setWithdrawError("All NFTs are Sold out!");
        else if (error.message.search("excedded max per wallet") !== -1)
          setWithdrawError("Each person can mint only 3 NFTs");
        else if (error.message.search("user rejected action") !== -1)
          setWithdrawError("User triggered Reject Button");
        else setWithdrawError(error.message);
        console.log("Error: ", error);
      }
    } else {
      alert("Please connect to a Wallet first");
    }
  }

  const handleDecrement = () => {
    if (mintAmount <= 1) return;
    setMintAmount(mintAmount - 1);
  };

  const handleIncrement = () => {
    if (mintAmount >= 3) return;
    setMintAmount(mintAmount + 1);
  };

  return (
    <>
      <Flex
        justify="center"
        align="center"
        height="100vh"
        paddingBottom="150px"
      >
        <Box width="520px">
          <div>
            <Text fontSize="48px" textShadow="0 5px #000000">
              AshPunks
            </Text>
            <Text
              fontSize="30px"
              letterSpacing="-5.5%"
              fontFamily="VT323"
              textShadow="0 2px 2px #000000"
            >
              It's 2068. Can the AshPunks NFT save humans from destructive
              rampant NFT speculation? Mint AshPunksNFT to find out.
            </Text>
          </div>
          {isConnected ? (
            <div>
              <Flex align="center" justify="center">
                <Button
                  backgroundColor="#D6517D"
                  borderRadius="5px"
                  boxShadow="0px 2px 2px 1px #0F0F0F"
                  color="white"
                  cursor="pointer"
                  fontFamily="inherit"
                  padding="15px"
                  marginTop="10px"
                  onClick={handleDecrement}
                >
                  -
                </Button>
                <Input
                  readonly
                  fontFamily="inherit"
                  width="100px"
                  height="40px"
                  textAlign="center"
                  paddingLeft="19px"
                  marginTop="10px"
                  type="number"
                  value={mintAmount}
                ></Input>
                <Button
                  backgroundColor="#D6517D"
                  borderRadius="5px"
                  boxShadow="0px 2px 2px 1px #0F0F0F"
                  color="white"
                  cursor="pointer"
                  fontFamily="inherit"
                  padding="15px"
                  marginTop="10px"
                  onClick={handleIncrement}
                >
                  +
                </Button>
              </Flex>
              <Button
                backgroundColor="#D6517D"
                borderRadius="5px"
                boxShadow="0px 2px 2px 1px #0F0F0F"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="15px"
                marginTop="10px"
                onClick={handleMint}
              >
                Mint Now!
              </Button>
            </div>
          ) : (
            <Text
              marginTop="70px"
              fontSize="30px"
              letterSpacing="-5.5%"
              fontFamily="VT323"
              textShadow="0 3px #000000"
              color="#D6517D"
            >
              You must be connected to Mint.
            </Text>
          )}
          {
            <Flex
              align="center"
              justify="center"
              marginTop="10px"
              fontSize="10px"
            >
              {withdrawError && (
                <div className="withdraw-error">{withdrawError}</div>
              )}
              {withdrawSuccess && (
                <div className="withdraw-success">{withdrawSuccess}</div>
              )}
            </Flex>
          }
        </Box>
      </Flex>
    </>
  );
};

export default MainMint;
