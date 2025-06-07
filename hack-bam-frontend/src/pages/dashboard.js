import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import axios from "axios";
import { Heart, Tag, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [preferences, setPreferences] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      const [prefsResponse, artworksResponse] = await Promise.all([
        axios.get("/api/preferences"),
        axios.get("/api/artworks"),
      ]);
      setPreferences(prefsResponse.data);
      setArtworks(artworksResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const allTags = preferences.flatMap((p) => p.tags);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-2">
            ¡Bienvenido, {session.user.name || session.user.email}!
          </h1>
          <p className="text-gray-600">
            Gestiona tus preferencias artísticas y descubre nuevas obras.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Tus Preferencias Top
            </h2>
            {topTags.length > 0 ? (
              <div className="space-y-2">
                {topTags.map(([tag, count]) => (
                  <div
                    key={tag}
                    className="flex justify-between items-center bg-gray-50 p-2 rounded"
                  >
                    <span className="flex items-center">
                      <Tag className="w-4 h-4 mr-2 text-blue-600" />
                      {tag}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No tienes preferencias aún. ¡Analiza algunas obras para
                comenzar!
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              Obras Recientes
            </h2>
            {artworks.length > 0 ? (
              <div className="space-y-3">
                {artworks.slice(0, 5).map((artwork) => (
                  <div
                    key={artwork.id}
                    className="border-l-4 border-blue-500 pl-4"
                  >
                    <h3 className="font-medium">
                      {artwork.title || "Obra sin título"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {artwork.museum || artwork.library}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {artwork.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No has guardado obras aún. ¡Comienza analizando algunas!
              </p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
            <h2 className="text-xl font-semibold mb-2">
              Analiza una Nueva Obra
            </h2>
            <p className="mb-4">
              Usa nuestra IA para identificar y categorizar obras de arte
              automáticamente.
            </p>
            <button
              onClick={() => router.push("/camera")}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Comenzar Análisis
            </button>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow p-6 text-white">
            <h2 className="text-xl font-semibold mb-2">Estadísticas</h2>
            <div className="space-y-2">
              <p>
                Obras analizadas:{" "}
                <span className="font-bold">{artworks.length}</span>
              </p>
              <p>
                Preferencias:{" "}
                <span className="font-bold">{preferences.length}</span>
              </p>
              <p>
                Tags únicos:{" "}
                <span className="font-bold">
                  {Object.keys(tagCounts).length}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
