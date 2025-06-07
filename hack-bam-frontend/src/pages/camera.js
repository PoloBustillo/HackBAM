import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import CameraCapture from "../components/CameraCapture";
import axios from "axios";
import toast from "react-hot-toast";
import { Save, Tag } from "lucide-react";

export default function Camera() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState(null);
  const [artworkData, setArtworkData] = useState({
    title: "",
    description: "",
    museum: "",
    library: "",
    location: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setArtworkData((prev) => ({
      ...prev,
      description: result.description,
    }));
  };

  const handleInputChange = (e) => {
    setArtworkData({
      ...artworkData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveArtwork = async () => {
    if (!analysisResult) return;

    setIsSaving(true);
    try {
      await axios.post("/api/artworks", {
        ...artworkData,
        tags: analysisResult.tags,
        imageUrl: analysisResult.imageData,
      });

      toast.success("¡Obra guardada exitosamente!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Error al guardar la obra");
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <CameraCapture onAnalysisComplete={handleAnalysisComplete} />

        {analysisResult && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Resultado del Análisis</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img
                  src={analysisResult.imageData}
                  alt="Analyzed artwork"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    Tags Identificados
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Descripción</h3>
                  <p className="text-gray-700">{analysisResult.description}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Información Adicional</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título de la Obra
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={artworkData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre de la obra"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={artworkData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ciudad, País"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Museo
                  </label>
                  <input
                    type="text"
                    name="museum"
                    value={artworkData.museum}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre del museo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biblioteca
                  </label>
                  <input
                    type="text"
                    name="library"
                    value={artworkData.library}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre de la biblioteca"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción Personal
                </label>
                <textarea
                  name="description"
                  value={artworkData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tus pensamientos sobre esta obra..."
                />
              </div>

              <button
                onClick={handleSaveArtwork}
                disabled={isSaving}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Guardando..." : "Guardar Obra"}
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
