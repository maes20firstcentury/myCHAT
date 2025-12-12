export default function handler(req, res) {
  return res.status(200).json({
    key: process.env.CLERK_PUBLISHABLE_KEY,
  });
}
