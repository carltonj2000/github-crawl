const authorization = `bearer ${process.env.GITHUB_TOKEN}`;
export default (req, res) => res.status(200).json({ authorization });
