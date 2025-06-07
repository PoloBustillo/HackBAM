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
      const preferences = await prisma.preference.findMany({
        where: { userId: user.id },
      });
      res.status(200).json(preferences);
    } catch (error) {
      res.status(500).json({ message: "Error fetching preferences" });
    }
  }

  if (req.method === "POST") {
    try {
      const { category, tags, weight } = req.body;

      const preference = await prisma.preference.create({
        data: {
          userId: user.id,
          category,
          tags,
          weight: weight || 1.0,
        },
      });

      res.status(201).json(preference);
    } catch (error) {
      res.status(500).json({ message: "Error creating preference" });
    }
  }

  if (req.method === "PUT") {
    try {
      const { tags } = req.body;

      // Actualizar preferencias basadas en nuevos tags
      for (const tag of tags) {
        await prisma.preference.upsert({
          where: {
            userId_category: {
              userId: user.id,
              category: "auto-generated",
            },
          },
          update: {
            tags: {
              push: tag,
            },
            weight: {
              increment: 0.1,
            },
          },
          create: {
            userId: user.id,
            category: "auto-generated",
            tags: [tag],
            weight: 1.0,
          },
        });
      }

      res.status(200).json({ message: "Preferences updated" });
    } catch (error) {
      res.status(500).json({ message: "Error updating preferences" });
    }
  }
}
