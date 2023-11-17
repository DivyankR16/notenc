import styled from 'styled-components';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PaidIcon from '@mui/icons-material/Paid';
import EventIcon from '@mui/icons-material/Event';
import Image from 'next/image';
import { ethers } from 'ethers';
// import CampaignFactory from '../artifacts/contracts/Campaign.sol/CampaignFactory.json'
import NoteFactory from '../artifacts/contracts/Note.sol/NoteFactory.json'
import { useState } from 'react';
import Link from 'next/link'

export default function Index({AllData, UrgentData, ImportantData,InSignificantData}) {
  const [filter, setFilter] = useState(AllData);

  return (
    <HomeWrapper>
      {/* Filter Section */}
      <FilterWrapper>
        <FilterAltIcon style={{ fontSize: 40 }} />
        <Category onClick={() => setFilter(AllData)}>All</Category>
        <Category onClick={() => setFilter(UrgentData)}>Urgent</Category>
        <Category onClick={() => setFilter(ImportantData)}>Important</Category>
        <Category onClick={() => setFilter(InSignificantData)}>InSignificant</Category>
      </FilterWrapper>

      {/* Cards Container */}
      <CardsWrapper>
        {/* Card */}
        {filter.map((e) => {
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



export async function getStaticProps() {
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
  const AllData = AllNotes.map((e) => {
    return {
      title: e.args.title,
      image: e.args.imgURI,
      owner: e.args.owner,
      timeStamp: parseInt(e.args.timestamp),
      address: e.args.NoteAddress
    }
  });

  const getUrgent = contract.filters.NoteCreated(null,null,null,null,null,null,'Urgent');
  const Urgent = await contract.queryFilter(getUrgent);
  const UrgentData = Urgent.map((e) => {
    return {
      title: e.args.title,
      image: e.args.imgURI,
      owner: e.args.owner,
      timeStamp: parseInt(e.args.timestamp),
      address: e.args.NoteAddress
    }
    console.log(UrgentData)
  });

  const getImportant = contract.filters.NoteCreated(null,null,null,null,null,null,'Important');
  const Important = await contract.queryFilter(getImportant);
  const ImportantData = Important.map((e) => {
    return {
      title: e.args.title,
      image: e.args.imgURI,
      owner: e.args.owner,
      timeStamp: parseInt(e.args.timestamp),
      address: e.args.NoteAddress
    }
  });

  const getInSignificant = contract.filters.NoteCreated(null,null,null,null,null,null,'InSignificant');
  const InSignificant = await contract.queryFilter(getInSignificant);
  const InSignificantData = InSignificant.map((e) => {
    return {
      title: e.args.title,
      image: e.args.imgURI,
      owner: e.args.owner,
      timeStamp: parseInt(e.args.timestamp),
      address: e.args.NoteAddress
    }
  });

  return {
    props: {
      AllData,
      UrgentData,
      ImportantData,
      InSignificantData
    },
    revalidate: 10
  }
}






const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`
const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  margin-top: 15px;
`
const Category = styled.div`
  padding: 10px 15px;
  background-color: ${(props) => props.theme.bgDiv};
  margin: 0px 15px;
  border-radius: 8px;
  font-family: 'Poppins';
  font-weight: normal;
  cursor: pointer;
`
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
  margin: 20px;
`;
const Card_body = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const Card_content = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0em 2em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
`;
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
`;
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