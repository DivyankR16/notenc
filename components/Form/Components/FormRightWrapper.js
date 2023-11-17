'use server'
import styled from 'styled-components';
import { FormState } from '../Form';
import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner'
import * as LitJsSdk from "@lit-protocol/lit-node-client";
const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();
const pinFileToIPFS = async (pak,psak,fileUpload,title) => {
  try {
    let key1 = "407b7210ab9db99d8857";
    let key2 = "b0e474133f5e9732f1aa31231ddfdd6377880b4063c045ef7d9d6175afa229bf";
    const litNodeClient = new LitJsSdk.LitNodeClient({
      litNetwork: "cayenne",
    });
    await litNodeClient.connect();
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: "polygon",
    });
    const accs = [
      {
        contractAddress: "",
        standardContractType: "",
        chain: "polygon",
        method: '',
        parameters: [":userAddress",],
        returnValueTest: {
          comparator: "=",
          value: "0x1457B2d38e38408A7B7916bD709fC2C2585a01aE",
        },
      },
    ];
      const encryptedZip = await LitJsSdk.encryptFileAndZipWithMetadata({
        accessControlConditions: accs,
        authSig,
        chain: "polygon",
        file: fileUpload,
        litNodeClient: litNodeClient,
        readme: "Use IPFS CID of this file to decrypt it",
      });
          const encryptedBlob = new Blob([encryptedZip]);
          const encryptedFile = new File([encryptedBlob],title);
    let data = new FormData();
    data.append("file", encryptedFile,encryptedFile.name);
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
    return res.data.IpfsHash;
    } catch (error) {
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Request setup error:", error.message);
        }
    }
};
  const pinFileToIPFS1 = async (pak, psak, fileUpload, title) => {
    try {
      let key1 = "407b7210ab9db99d8857";
      let key2 ="b0e474133f5e9732f1aa31231ddfdd6377880b4063c045ef7d9d6175afa229bf";
      const litNodeClient = new LitJsSdk.LitNodeClient({
        litNetwork: "cayenne",
      });
      await litNodeClient.connect();
      const authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: "polygon",
      });
      const accs = [
        {
          contractAddress: "",
          standardContractType: "",
          chain: "polygon",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: "0x1457B2d38e38408A7B7916bD709fC2C2585a01aE",
          },
        },
      ];
      const fileneed = new Blob([fileUpload], { type: "text/plain;charset=utf-8" });
      const encryptedZip = await LitJsSdk.encryptFileAndZipWithMetadata({
        accessControlConditions: accs,
        authSig,
        chain: "polygon",
        file: fileneed,
        litNodeClient: litNodeClient,
        readme: "Use IPFS CID of this file to decrypt it",
      });
      const encryptedBlob = new Blob([encryptedZip]);
      const encryptedFile = new File([encryptedBlob], title);
      let data = new FormData();
      data.append("file", encryptedFile, encryptedFile.name);
      const res = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: data,
        headers: {
          pinata_api_key: key1,
          pinata_secret_api_key: key2,
        },
      });
      // console.log(res.data.IpfsHash);
      return res.data.IpfsHash;
    } catch (error) {
      if (error.response) {
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
  const Handler = useContext(FormState);

  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const uploadFiles = async (e) => {
    e.preventDefault();
    setUploadLoading(true);
      if(Handler.image !== null) {
          try {
              const added = await pinFileToIPFS(
                process.env.NEXT_PINATA_API_KEY,
                process.env.NEXT_PINATA_API_SECRET,
                Handler.image,
                Handler.form.NoteTitle
            );
            Handler.setImageUrl(added)
          } catch (error) {
            toast.warn(`Error Uploading Image`);
          }
    }
    if (Handler.form.story !== "") {
      try {
        const added = await pinFileToIPFS1(
          process.env.NEXT_PINATA_API_KEY,
          process.env.NEXT_PINATA_API_SECRET,
          Handler.form.story,
          Handler.form.NoteTitle
        );
        Handler.setStoryUrl(added);
      } catch (error) {
        toast.warn(`Error Uploading Story`);
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
          {/* <RowFirstInput>
            <label>Required Amount</label>
            <Input
              onChange={Handler.FormHandler}
              value={Handler.form.requiredAmount}
              name="requiredAmount"
              type={"number"}
              placeholder="Required Amount"
            ></Input>
          </RowFirstInput> */}
          <RowSecondInput>
            <label>Choose Category</label>
            <Select
              onChange={Handler.FormHandler}
              value={Handler.form.category}
              name="category"
            >
              <option>Urgent</option>
              <option>Important</option>
              <option>InSignificant</option>
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
  display:flex;
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
  padding: 20px;
  margin:30px;
  border-radius:20px;
`

export default FormRightWrapper