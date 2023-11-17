import styled from "styled-components";
import { ethers } from 'ethers';
import * as LitJsSdk from "@lit-protocol/lit-node-client";
require("dotenv").config({ path: "./.env.local" });
import NoteFactory from '../artifacts/contracts/Note.sol/NoteFactory.json'
import Note from '../artifacts/contracts/Note.sol/Note.json'
import { useEffect, useState } from "react";


export default function Detail({Data}) {
  // const [mydonations, setMydonations] = useState([]);
  const [story, setStory] = useState('');
  // const [amount, setAmount] = useState();
  const [change, setChange] = useState(false);

  useEffect(() => {
    const Request = async () => {

      
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
      setStory(Data.storyUrl)
    }

    Request();
  }, [change])

     const decryptFile = async (fileToDecrypt) => {
       try {
         const fileRes = await fetch(
           `https://gateway.pinata.cloud/ipfs/${fileToDecrypt}?filename=encrypted.zip`
         );
         const file = await fileRes.blob();
         const litNodeClient = new LitJsSdk.LitNodeClient({
           litNetwork: "cayenne",
         });
         await litNodeClient.connect();
         const authSig = await LitJsSdk.checkAndSignAuthMessage({
           chain: "polygon",
         });
         const { decryptedFile, metadata } =
           await LitJsSdk.decryptZipFileWithMetadata({
             file: file,
             litNodeClient: litNodeClient,
             authSig: authSig,
           });
         const blob = new Blob([decryptedFile], {
           type: "application/octet-stream",
         });
         const downloadLink = document.createElement("a");
         downloadLink.href = URL.createObjectURL(blob);
        //  console.log(URL.createObjectURL(blob));
         downloadLink.download = metadata.name;  
         downloadLink.click();
       } catch (error) {
         alert("No access to the file")
         console.log(error);
       }
     };

  return (
    <DetailWrapper>
      <Bgforbttn>
        <Button
          onClick={() => {
            decryptFile(Data.image)[0];
          }}
        >
          Download note
        </Button>
        <Button
          onClick={() => {
            decryptFile(Data.storyUrl)[0];
          }}
        >
          Downlaod Story
        </Button>
      </Bgforbttn>
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
  const image = await contract.image();
  const storyUrl = await contract.story();
  const owner = await contract.owner();



  const Data = {
      address: context.params.address,
      title, 
      image, 
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Bgforbttn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;
const Button = styled.div`
  padding: 8px;
  text-align: center;
  width: 100%;
  background-color: red;
  border: none;
  cursor: pointer;
  font-family: "Roboto";
  text-transform: uppercase;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  padding: 15px;
  margin:10px;
`;