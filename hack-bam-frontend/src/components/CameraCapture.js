import { useState, useRef } from "react";
import { Camera, Upload, Loader } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function CameraCapture({ onAnalysisComplete }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target.result;
      setCapturedImage(imageData);
      await analyzeImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (imageData) => {
    setIsAnalyzing(true);
    try {
      const response = await axios.post("/api/analyze-image", { imageData });
      const { tags, description } = response.data;

      // Actualizar preferencias automáticamente
      await axios.put("/api/preferences", { tags });

      toast.success("¡Imagen analizada y preferencias actualizadas!");
      onAnalysisComplete({ tags, description, imageData });
    } catch (error) {
      toast.error("Error al analizar la imagen");
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Camera className="w-6 h-6 mr-2" />
        Analizar Obra de Arte
      </h2>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured artwork"
              className="max-w-full h-64 object-contain mx-auto"
            />
          ) : (
            <div>
              <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">
                Sube una foto de la obra de arte
              </p>
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
          >
            <Upload className="w-4 h-4 mr-2" />
            Subir Imagen
          </button>

          {isAnalyzing && (
            <div className="flex items-center space-x-2 text-blue-600">
              <Loader className="w-4 h-4 animate-spin" />
              <span>Analizando...</span>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
