import styled from 'styled-components';
import { ethers } from 'ethers';
require('dotenv').config({ path: './.env.local' });
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
            // <Content key={e.title}>
            <Card_container key={e.title}>
              <Card_body>
                <Card_content>
                  <Card_icon>{e.title}</Card_icon>
                  <Card_author>
                    {" "}
                    {e.owner.slice(0, 6)}...{e.owner.slice(39)}
                  </Card_author>
                </Card_content>
                <Card_meta>
                  <Card_tag>
                    {" "}
                    <Link passHref href={"/" + e.address}>
                      <Button>View Note</Button>
                    </Link>
                  </Card_tag>
                </Card_meta>
              </Card_body>
            </Card_container>
            // </Content>
          );
        })}
        {/* Card */}
      </CardsWrapper>
    </HomeWrapper>
  );
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
const Card_container = styled.div`
  background: #45d045;
  background: ${(props) => props.theme.bgSubDiv};
  width: 20em;
  height: 25em;
  box-sizing: content-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 1em;
  margin:20px;
`;
const Card_body=styled.div`
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;`

const Card_content = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0em 2em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
`
const Card_meta = styled.div`
  background: rgba(0, 0, 0, 0.2);
  width: 100%;
  box-sizing: border-box;
  padding: 0em 2em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-left-radius: 1em;
  border-bottom-right-radius: 1em;
`
const Card_title = styled.div`
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  margin: 0em 0em;
  background-color: ${(props) => props.theme.bgSubDiv};
  font-size: 1.75em;
  line-height: 1.15em;
`;
const Card_icon = styled.div`
  font-family: "Open Sans", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5em;
  font-size: 30px;
  font-weight: 700;
  height: 25%;
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
`;
const Card_author = styled.div`
  font-family: "Open Sans", sans-serif;
  margin: 0;
  padding: 0;
  background-color: ${(props) => props.theme.bgSubDiv};
  font-size: 1em;
  line-height: 1.15em;
`;
const Card_tag = styled.div`
  font-family: "Open Sans", sans-serif;
  margin: 2em 0em;
  font-size: 0.75em;
  background-color: ${(props) => props.theme.bgSubDiv};
  line-height: 1.15em;
`;