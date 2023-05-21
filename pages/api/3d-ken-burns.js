import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const getKenBurns = async (imageUrl) => {
  try {
    const output = await replicate.run(
      "sniklaus/3d-ken-burns:9d1d7a66c3a1475fc5b1e09deb4da0d9868beaa91e9f159470f54b6a7dc8ff6e",
      {
        input: {
          image: imageUrl,
        },
      }
    );
    return output;
  } catch (err) {
    console.error(err);
  }
};

export default async function handler(req, res) {
  const data = await getKenBurns(req.body.image);
  console.log(data);

  res.status(201).json(data);
}
