import styled from 'styled-components';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PaidIcon from '@mui/icons-material/Paid';
import EventIcon from '@mui/icons-material/Event';
import Image from 'next/image';
import { ethers } from 'ethers';
require('dotenv').config({ path: './.env.local' });
import * as LitJsSdk from "@lit-protocol/lit-node-client";
const axios = require("axios");
// import CampaignFactory from '../artifacts/contracts/Campaign.sol/CampaignFactory.json'
import NoteFactory from '../artifacts/contracts/Note.sol/NoteFactory.json'
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [NotesData, setNotesData] = useState([]);

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
        process.env.NEXT_PUBLIC_ADDRESS,
        NoteFactory.abi,
        provider
      );
  
      const getAllNotes = contract.filters.NoteCreated(null, null, Address);
      const AllNotes = await contract.queryFilter(getAllNotes);
      const AllData = AllNotes.map((e) => {
      return {
        title: e.args.title,
        image: e.args.imgURI,
        owner: e.args.owner,
        timeStamp: parseInt(e.args.timestamp),
        amount: ethers.utils.formatEther(e.args.requiredAmount),
        address: e.args.NoteAddress,
        story:e.args.story
      }
      })  
      setNotesData(AllData)
    }
    Request();
  }, [])
  return (
    <HomeWrapper>

      {/* Cards Container */}
      <CardsWrapper>

      {/* Card */}
      {NotesData.map((e) => {
        return (
          <Card key={e.title}>
            {/* <CardImg>
              <Image
                alt={decryptFile(e.image)[1] || ''}
                layout="fill"
                src={decryptFile(e.image)[0]|| ''}
              />
            </CardImg> */}
            <Title>{e.title}</Title>
            <CardData>
              <Text>
                Owner
                <AccountBoxIcon />
              </Text>
              <Text>
                {e.owner.slice(0, 6)}...{e.owner.slice(39)}
              </Text>
            </CardData>
            <CardData>
              <Text>
                Amount
                <PaidIcon />
              </Text>
              <Text>{e.amount} Matic</Text>
            </CardData>
            <CardData>
              <Text>
                <EventIcon />
              </Text>
              <Text>{new Date(e.timeStamp * 1000).toLocaleString()}</Text>
            </CardData>
            <Link passHref href={"/" + e.address}>
              <Button>View Note</Button>
            </Link>
          </Card>
        );
      })}
        {/* Card */}

      </CardsWrapper>
    </HomeWrapper>
  )
}



const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border-radius: 40px;
`;
const CardsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 80%;
  margin-top: 25px;
  border-radius: 40px;
`;
const Card = styled.div`
  width: 30%;
  margin-top: 20px;
  background-color: ${(props) => props.theme.bgDiv};
  border-radius:40px;
  &:hover{
    transform: translateY(-10px);
    transition: transform 0.5s;
  }
  
  &:not(:hover){
    transition: transform 0.5s;
  }
`
const CardImg = styled.div`
  position: relative;
  height: 120px;
  width: 100%;
`
const Title = styled.h2`
  font-family: "Roboto";
  font-size: 18px;
  margin: 8px 0px;
  background-color: ${(props) => props.theme.bgSubDiv};
  padding: 15px;
  cursor: pointer;
  font-weight: normal;
`;
const CardData = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 8px 0px;
  background-color: ${(props) => props.theme.bgSubDiv};
  padding: 15px;
  cursor: pointer;
`;
const Text = styled.p`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  font-family: 'Roboto';
  font-size: 18px;
  font-weight: bold;
`
const Button = styled.button`
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
`;