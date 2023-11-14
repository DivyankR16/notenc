import styled from "styled-components";
import Image from "next/image";
import { ethers } from 'ethers';
import * as LitJsSdk from "@lit-protocol/lit-node-client";
require("dotenv").config({ path: "./.env.local" });
// import NoteFactory from '../artifacts/contracts/Campaign.sol/CampaignFactory.json'
import NoteFactory from '../artifacts/contracts/Note.sol/NoteFactory.json'
// import Note from '../artifacts/contracts/Campaign.sol/Campaign.json'
import Note from '../artifacts/contracts/Note.sol/Note.json'
import { useEffect, useState } from "react";
const axios = require("axios");


export default function Detail({Data, DonationsData}) {
  const [mydonations, setMydonations] = useState([]);
  const [story, setStory] = useState('');
  const [amount, setAmount] = useState();
  const [change, setChange] = useState(false);

  useEffect(() => {
    const Request = async () => {
      let storyData;
      
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const Web3provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = Web3provider.getSigner();
      const Address = await signer.getAddress();

      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL
      );
    
      const contract = new ethers.Contract(
        Data.address,
        Note.abi,
        provider
      );

      // fetch("https://gateway.pinata.cloud/ipfs/" + Data.storyUrl)
      //   .then((res) => res.text())
      //   .then((data) => (storyData = data));
      setStory(Data.story)
      const MyDonations = contract.filters.donated(Address);
      const MyAllDonations = await contract.queryFilter(MyDonations);

      setMydonations(MyAllDonations.map((e) => {
        return {
          donar: e.args.donar,
          amount: ethers.utils.formatEther(e.args.amount),
          timestamp : parseInt(e.args.timestamp)
        }
      }));

    }

    Request();
  }, [change])

     const decryptFile = async (fileToDecrypt) => {
       try {
         // First we fetch the file from IPFS using the CID and our Gateway URL, then turn it into a blob
         const fileRes = await fetch(
           `https://gateway.pinata.cloud/ipfs/${fileToDecrypt}`
         );
         const file = await fileRes.blob();
         // We recreated the litNodeClient and the authSig
         const litNodeClient = new LitJsSdk.LitNodeClient({
           litNetwork: "cayenne",
         });
         await litNodeClient.connect();
         const authSig = await LitJsSdk.checkAndSignAuthMessage({
           chain: "ethereum",
         });
         // Then we simpyl extract the file and metadata from the zip
         // We could do more with this, like try to display it in the app UI if we wanted to
         const { decryptedFile, metadata } =
           await LitJsSdk.decryptZipFileWithMetadata({
             file: file,
             litNodeClient: litNodeClient,
             authSig: authSig,
           });
         // After we have our dcypted file we can download it
         //  const blob = new Blob([decryptedFile], {
         //    type: "application/octet-stream",
         //  });
         //  const imgElement = document.createElement("img");
         const blob = new Blob([decryptedFile], {
           type: "application/octet-stream",
         });
         const downloadLink = document.createElement("a");
         downloadLink.href = URL.createObjectURL(blob);
         downloadLink.download = metadata.name;  
         //  imgElement.src = dataUrl;
         //  imgElement.alt = metadata.name;
         return [downloadLink.href, downloadLink.download];
       } catch (error) {
         //  alert("Trouble decrypting file");
         console.log("KYU BHAI")
         console.log(error);
       }
     };

  return (
    <DetailWrapper>
      <LeftContainer>
        {/* <ImageSection> */}
        {/* <Image
            alt={decryptFile(Data.image)[1] || ''}
            layout="fill"
            src={decryptFile(Data.image)[0] || ''}
          />
        </ImageSection> */}
        <button onClick={() => decryptFile(Data.image)[0]}>
          Image Download Link
        </button>
        <Text>{story}</Text>
      </LeftContainer>
      <RightContainer>
        <Title>{Data.title}</Title>
      </RightContainer>
    </DetailWrapper>
  );
}


export async function getStaticPaths() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_URL
  );

  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_ADDRESS,
    NoteFactory.abi,
    provider
  );

  const getAllNotes = contract.filters.NoteCreated();
  const AllNotes = await contract.queryFilter(getAllNotes);

  return {
    paths: AllNotes.map((e) => ({
        params: {
          address: e.args.NoteAddress.toString(),
        }
    })),
    fallback: "blocking"
  }
}

export async function getStaticProps(context) {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_URL
  );

  const contract = new ethers.Contract(
    context.params.address,
    Note.abi,
    provider
  );

  const title = await contract.title();
  const requiredAmount = await contract.requiredAmount();
  const image = await contract.image();
  const storyUrl = await contract.story();
  const owner = await contract.owner();
  const receivedAmount = await contract.receivedAmount();

  const Donations = contract.filters.donated();
  const AllDonations = await contract.queryFilter(Donations);


  const Data = {
      address: context.params.address,
      title, 
      requiredAmount: ethers.utils.formatEther(requiredAmount), 
      image, 
      receivedAmount: ethers.utils.formatEther(receivedAmount), 
      storyUrl, 
      owner,
  }

  return {
    props: {
      Data
    },
    revalidate: 10
  }


}




const DetailWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  width: 98%;
`;
const LeftContainer = styled.div`
  width: 45%;
`;
const RightContainer = styled.div`
  width: 50%;
`;
const ImageSection = styled.div`
  width: 100%;
  position: relative;
  height: 350px;
`;
const Text = styled.p`
  font-family: "Roboto";
  font-size: large;
  color: ${(props) => props.theme.color};
  text-align: justify;
`;
const Title = styled.h1`
  padding: 0;
  margin: 0;
  font-family: "Poppins";
  font-size: x-large;
  color: ${(props) => props.theme.color};
`;
const DonateSection = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;
const Input = styled.input`
  padding: 8px 15px;
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: large;
  width: 40%;
  height: 40px;
`;
const Donate = styled.button`
  display: flex;
  justify-content: center;
  width: 40%;
  padding: 15px;
  color: white;
  background-color: #00b712;
  background-image: linear-gradient(180deg, #00b712 0%, #5aff15 80%);
  border: none;
  cursor: pointer;
  font-weight: bold;
  border-radius: 8px;
  font-size: large;
`;
const FundsData = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;
const Funds = styled.div`
  width: 45%;
  background-color: ${(props) => props.theme.bgDiv};
  padding: 8px;
  border-radius: 8px;
  text-align: center;
`;
const FundText = styled.p`
  margin: 2px;
  padding: 0;
  font-family: "Poppins";
  font-size: normal;
`;
const Donated = styled.div`
  height: 280px;
  margin-top: 15px;
  background-color: ${(props) => props.theme.bgDiv};
`;
const LiveDonation = styled.div`
  height: 65%;
  overflow-y: auto;
`;
const MyDonation = styled.div`
  height: 35%;
  overflow-y: auto;
`;
const DonationTitle = styled.div`
  font-family: "Roboto";
  font-size: x-small;
  text-transform: uppercase;
  padding: 4px;
  text-align: center;
  background-color: #4cd137;
`;
const Donation = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  background-color: ${(props) => props.theme.bgSubDiv};
  padding: 4px 8px;
`;
const DonationData = styled.p`
  color: ${(props) => props.theme.color};
  font-family: "Roboto";
  font-size: large;
  margin: 0;
  padding: 0;
`;