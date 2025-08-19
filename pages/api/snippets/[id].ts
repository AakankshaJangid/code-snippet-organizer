import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectDB } from "@/lib/mongodb";
import Snippet from "@/models/Snippet";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    const snippet = await Snippet.findOne({ _id: id, userId: session.user.id });
    if (!snippet) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(snippet);
  }

  if (req.method === "PUT") {
    const { title, description, language, tags, code, embedding } = req.body;
    const updated = await Snippet.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { title, description, language, tags, code, embedding },
      { new: true }
    );
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    await Snippet.findOneAndDelete({ _id: id, userId: session.user.id });
    return res.status(204).end();
  }

  return res.status(405).json({ error: "Method not allowed" });
}