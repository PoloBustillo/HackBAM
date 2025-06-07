import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (req.method === "GET") {
    try {
      const artworks = await prisma.artwork.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
      res.status(200).json(artworks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching artworks" });
    }
  }

  if (req.method === "POST") {
    try {
      const { title, description, tags, imageUrl, museum, library, location } =
        req.body;

      const artwork = await prisma.artwork.create({
        data: {
          userId: user.id,
          title,
          description,
          tags,
          imageUrl,
          museum,
          library,
          location,
        },
      });

      res.status(201).json(artwork);
    } catch (error) {
      res.status(500).json({ message: "Error creating artwork" });
    }
  }
}
