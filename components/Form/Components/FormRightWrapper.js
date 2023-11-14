'use server'
import styled from 'styled-components';
import { FormState } from '../Form';
import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner'
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { fs } from "fs";
// Use the api keys by providing the strings directly 
// import {pinFileToIPFS} from '../../../pages/api/pinatafile'
import { create as IPFSHTTPClient } from 'ipfs-http-client';
// const projectId = process.env.NEXT_PUBLIC_IPFS_ID
// const projectSecret = process.env.NEXT_PUBLIC_IPFS_KEY
// const auth = 'Basic ' + Buffer.from(projectId + ":" + projectSecret).toString('base64')
  // const pinataSDK = require("@pinata/sdk");
  //   const pinata = new pinataSDK(
  //     pak,
  //     psak
  //   );
  //   const res = await pinata.testAuthentication();
  //   console.log(res);
// const client = IPFSHTTPClient({
//   host:'ipfs.infura.io',
//   port:5001,
//   protocol: 'https',
//   headers: {
//     authorization: auth
//   }
// })
// const token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjOTRlODNhYy0yNTc3LTQwNTQtODEzYS1lZmEyYWM4OTNiYzQiLCJlbWFpbCI6ImRpdnlhbmsxNmtoYWp1cmlhQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4NDRkYzNjYzJmNGUwNmEyMWFiNiIsInNjb3BlZEtleVNlY3JldCI6IjY3MDEzYjliMDE4NTJhN2U1YTRkMzM0OTI0ZWZkNjMzYzA2ZDYxNzYxYTY3YzZkOGM0NzZmYTY0ODhmMTZjZGUiLCJpYXQiOjE2OTk5MDYxMTB9k2OLGVbOsURc9p3QJxVEM9K_F_hbI4IeqLYKRtrA - eE'
const axios = require("axios");
const FormData = require("form-data");
// const fs = require("fs");
require("dotenv").config();
// const check = async (pak, psak, URL) => {
//   try {
//     const pinataSDK = require("@pinata/sdk");
//       const pinata = new pinataSDK(pak, psak);
//       const rest = await pinata.testAuthentication();
//       console.log(rest);
//   }
//   catch (e) {
//     consol
//   }
// }
const pinFileToIPFS = async (pak,psak,fileUpload,title) => {
  try {
    let key1 = "407b7210ab9db99d8857";
    let key2 = "b0e474133f5e9732f1aa31231ddfdd6377880b4063c045ef7d9d6175afa229bf";
    const litNodeClient = new LitJsSdk.LitNodeClient({
      litNetwork: "cayenne",
    });
    // Then get the authSig
    await litNodeClient.connect();
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: "ethereum",
    });
    // Define our access controls, this is set to be anyone
    const accs = [
      {
        contractAddress: "",
        standardContractType: "",
        chain: "ethereum",
        method: "eth_getBalance",
        parameters: [":userAddress", "latest"],
        returnValueTest: {
          comparator: ">=",
          value: "0",
        },
      },
    ];
      const encryptedZip = await LitJsSdk.encryptFileAndZipWithMetadata({
        accessControlConditions: accs,
        authSig,
        chain: "ethereum",
        file: fileUpload,
        litNodeClient: litNodeClient,
        readme: "Use IPFS CID of this file to decrypt it",
      });
          const encryptedBlob = new Blob([encryptedZip]);
          const encryptedFile = new File([encryptedBlob],title);
    let data = new FormData();
    // const fileBlob = new Blob([URL], {
    //   type: "application/octet-stream",
    // });
    data.append("file", encryptedFile,encryptedFile.name);
    // data.append("pinataOptions", '{"cidVersion": 0}');
    // data.append("pinataMetadata", '{"name": "pinnie"}');
    //  console.log(pak)
    //  console.log(psak)
    const res = await axios({
      method: "post",
      url:"https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: data,
      headers: {
        pinata_api_key: key1,
        pinata_secret_api_key: key2,
      }
    }
    );
    console.log(res.data.IpfsHash);
    // console.log(
    //   `View the file here: https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
    //   );
    return res.data.IpfsHash;
    } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Request setup error:", error.message);
        }
    }
  };
const FormRightWrapper = () => {
    
    // console.log(token);
    // console.log(process.env.NEXT_PINATA_API_SECRET);
  // console.log(process.env.NEXT_PINATA_API_KEY)
  const Handler = useContext(FormState);

  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const uploadFiles = async (e) => {
    e.preventDefault();
    setUploadLoading(true);

    // if(Handler.form.story !== "") {
    //   try {
    //     const added = await pinFileToIPFS(
    //       process.env.NEXT_PINATA_API_KEY,
    //       process.env.NEXT_PINATA_API_SECRET,
    //       Handler.form.story,
    //       Handler.form.NoteTitle
    //     );
    //     Handler.setStoryUrl(added)
    //   } catch (error) {
    //     toast.warn(`Error Uploading Story`);
    //   }
    // }


      if(Handler.image !== null) {
          try {
              const added = await pinFileToIPFS(
                process.env.NEXT_PINATA_API_KEY,
                process.env.NEXT_PINATA_API_SECRET,
                Handler.image,
                Handler.form.NoteTitle
            );
            Handler.setImageUrl(added)
            console.log("ADDED---- ",Handler.image)
          } catch (error) {
            toast.warn(`Error Uploading Image`);
          }
      }

      setUploadLoading(false);
      setUploaded(true);
      Handler.setUploaded(true);
      toast.success("Files Uploaded Sucessfully")
}

  return (
    <FormRight>
      <FormInput>
        <FormRow>
          <RowFirstInput>
            <label>Required Amount</label>
            <Input
              onChange={Handler.FormHandler}
              value={Handler.form.requiredAmount}
              name="requiredAmount"
              type={"number"}
              placeholder="Required Amount"
            ></Input>
          </RowFirstInput>
          <RowSecondInput>
            <label>Choose Category</label>
            <Select
              onChange={Handler.FormHandler}
              value={Handler.form.category}
              name="category"
            >
              <option>Education</option>
              <option>Health</option>
              <option>Animal</option>
            </Select>
          </RowSecondInput>
        </FormRow>
      </FormInput>
      {/* Image */}
      <FormInput>
        <label>Select Image</label>
        <Image
          alt="dapp"
          onChange={Handler.ImageHandler}
          type={"file"}
          accept="image/*"
        ></Image>
      </FormInput>
      {uploadLoading == true ? (
        <Button>
          <TailSpin color="#fff" height={20} />
        </Button>
      ) : uploaded == false ? (
        <Button onClick={uploadFiles}>Upload Files to IPFS</Button>
      ) : (
        <Button style={{ cursor: "no-drop" }}>
          Files uploaded Sucessfully
        </Button>
      )}
      <Button onClick={Handler.CreateNoteawaitfunc}>Add Note</Button>
    </FormRight>
  );
}

const FormRight = styled.div`
  width:45%;
`

const FormInput = styled.div`
  display:flex ;
  flex-direction:column;
  font-family:'poppins';
  margin-top:10px ;
`

const FormRow = styled.div`
  display: flex;
  justify-content:space-between;
  width:100% ;
`

const Input = styled.input`
  padding:15px;
  background-color:${(props) => props.theme.bgDiv} ;
  color:${(props) => props.theme.color} ;
  margin-top:4px;
  border:none ;
  border-radius:8px ;
  outline:none;
  font-size:large;
  width:100% ;
` 

const RowFirstInput = styled.div`
  display:flex ;
  flex-direction:column ;
  width:45% ;
`

const RowSecondInput = styled.div`
  display:flex ;
  flex-direction:column ;
  width:45% ;
`

const Select = styled.select`
  padding:15px;
  background-color:${(props) => props.theme.bgDiv} ;
  color:${(props) => props.theme.color} ;
  margin-top:4px;
  border:none ;
  border-radius:8px ;
  outline:none;
  font-size:large;
  width:100% ;
`

const Image = styled.input`
  background-color:${(props) => props.theme.bgDiv} ;
  color:${(props) => props.theme.color} ;
  margin-top:4px;
  border:none ;
  border-radius:8px ;
  outline:none;
  font-size:large;
  width:100% ;

  &::-webkit-file-upload-button {
    padding: 15px ;
    background-color: ${(props) => props.theme.bgSubDiv} ;
    color: ${(props) => props.theme.color} ;
    outline:none ;
    border:none ;
    font-weight:bold ;
  }  
`

const Button = styled.button`
  display: flex;
  justify-content:center;
  width:100% ;
  padding:15px ;
  color:white ;
  background-color:#00b712 ;
  background-image:
      linear-gradient(180deg, #00b712 0%, #5aff15 80%) ;
  border:none;
  margin-top:30px ;
  cursor: pointer;
  font-weight:bold ;
  font-size:large ;
`

export default FormRightWrapper