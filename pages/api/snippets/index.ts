import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectDB } from "@/lib/mongodb";
import Snippet from "@/models/Snippet";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  await connectDB();

  if (req.method === "POST") {
    const { title, description, language, tags, code, embedding } = req.body;

    const snippet = await Snippet.create({
      userId: session.user.id,
      title,
      description,
      language,
      tags,
      code,
      embedding,
    });

    return res.status(201).json(snippet);
  }

  if (req.method === "GET") {
    const snippets = await Snippet.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(snippets);
  }

  return res.status(405).json({ error: "Method not allowed" });
}