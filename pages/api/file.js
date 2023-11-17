import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({
  pinataJWTKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjOTRlODNhYy0yNTc3LTQwNTQtODEzYS1lZmEyYWM4OTNiYzQiLCJlbWFpbCI6ImRpdnlhbmsxNmtoYWp1cmlhQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIwNGQ2NTZlOWJlOGU2NzNkOTQ5OSIsInNjb3BlZEtleVNlY3JldCI6IjNiMzcwMjMxMTJmNDg4MTlkYjVlODYzYTNiYWNhOTBjNDM3MTUwODU3NGNkMDcxODA2MmU5N2UxMjIwMzg1MmUiLCJpYXQiOjE2OTk5MzcwMjN9.AVFY-dPl-dd4hlZA1NvddoLydw8bXPF30WbfRUwsiTA",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const saveFile = async (file) => {
  try {
    const stream = fs.createReadStream(file.filepath);
    const options = {
      pinataMetadata: {
        name: file.name,
      },
    };
    const response = await pinata.pinFileToIPFS(stream, options);
    fs.unlinkSync(file.filepath);

    return response;
  } catch (error) {
    throw error;
  }
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const form = new formidable.IncomingForm();
      form.parse(req, async function (err, fields, files) {
        if (err) {
          console.log({ err });
          return res.status(500).send("Upload Error");
        }
        const response = await saveFile(files.file);
        const { IpfsHash } = response;

        return res.send(IpfsHash);
      });
    } catch (e) {
      console.log(e);
      res.status(500).send("Server Error");
    }
  } else if (req.method === "GET") {
    try {
      const response = await pinata.pinList(
        {
          pinataJWTKey:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjOTRlODNhYy0yNTc3LTQwNTQtODEzYS1lZmEyYWM4OTNiYzQiLCJlbWFpbCI6ImRpdnlhbmsxNmtoYWp1cmlhQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIwNGQ2NTZlOWJlOGU2NzNkOTQ5OSIsInNjb3BlZEtleVNlY3JldCI6IjNiMzcwMjMxMTJmNDg4MTlkYjVlODYzYTNiYWNhOTBjNDM3MTUwODU3NGNkMDcxODA2MmU5N2UxMjIwMzg1MmUiLCJpYXQiOjE2OTk5MzcwMjN9.AVFY-dPl-dd4hlZA1NvddoLydw8bXPF30WbfRUwsiTA",
        },
        {
          pageLimit: 1,
        }
      );
      res.json(response.rows[0]);
    } catch (e) {
      console.log(e);
      res.status(500).send("Server Error");
    }
  }
}
