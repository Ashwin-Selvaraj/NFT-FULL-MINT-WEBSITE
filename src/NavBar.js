import React from "react";
import { Box, Button, Flex, Link, Image, Spacer } from "@chakra-ui/react";
// Chakra - we can specify the css classes directly inside the jsx
import Instagram from "./assets/social-media-icons/instagram.png";
import Twitter from "./assets/social-media-icons/X.png";
import LinkedIn from "./assets/social-media-icons/LinkedIn.png";

const NavBar = ({ accounts, setAccounts }) => {
  // We can able to find out whether the wallet is connected or not connected
  const isConnected = Boolean(accounts[0]);

  async function connectAccount() {
    // when you're using metamask, it basically injects the application with window.ethereum
    if (window.ethereum) {
      // this will give all the coounts that exists in the metamask wallet
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(accounts);
    } else {
      alert("Please Intall Metamask Wallet");
    }
  }

  return (
    // flex is a way to align things properly
    <Flex justify="space-between" align="center" padding="30px">
      {/* left side - social media icons */}
      <Flex justify="space-around" width="40%" padding="0 75px">
        <Link href="https://www.instagram.com/ashontech/">
          <Image src={Instagram} boxSize="42px" margin="0 15px"></Image>
        </Link>

        <Link href="https://twitter.com/ashontech_">
          <Image src={Twitter} boxSize="42px" margin="0 15px"></Image>
        </Link>

        <Link href="https://www.linkedin.com/in/ashwin-s-18992b193/">
          <Image src={LinkedIn} boxSize="42px" margin="0 15px"></Image>
        </Link>
      </Flex>
      {/* right side - sections and connect */}
      <Flex justify="space--around" align="center" width="40%" padding="30px">
        <Box margin="0 15px">About</Box>
        <Spacer />
        <Box margin="0 15px">Mint</Box>
        <Spacer />
        <Box margin="0 15px">Team</Box>
        <Spacer />

        {/* Connect Button */}
        {isConnected ? (
          <Box margin="0 15px">Connected</Box>
        ) : (
          <Button
            backgroundColor="#D6517D"
            borderRadius="5px"
            boxShadow="0px 2px 2px 1px #0F0F0F"
            color="white"
            cursor="pointer"
            fontFamily="inherit"
            padding="15px"
            margin="0 15px"
            onClick={connectAccount}
          >
            Connect
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default NavBar;
