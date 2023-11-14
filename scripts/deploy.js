const hre = require('hardhat');

async function main() {

    const NoteFactory = await hre.ethers.getContractFactory("NoteFactory")
    const noteFactory = await NoteFactory.deploy();

    await noteFactory.deployed();

    console.log("Factory deployed to:", noteFactory.address);
}   

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });