import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { Camera, Heart, BookOpen, MapPin } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  return (
    <Layout>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Descubre y Guarda tus Obras Favoritas
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Gestiona tus preferencias de arte, analiza obras con IA y descubre
          nuevas piezas en museos y bibliotecas de todo el mundo.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Camera className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Análisis con IA</h3>
            <p className="text-gray-600">
              Toma fotos y deja que la IA identifique y categorice las obras
              automáticamente.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Preferencias Personalizadas
            </h3>
            <p className="text-gray-600">
              Guarda y organiza tus gustos artísticos para recibir
              recomendaciones.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <MapPin className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Museos y Bibliotecas</h3>
            <p className="text-gray-600">
              Descubre obras en instituciones culturales cerca de ti.
            </p>
          </div>
        </div>

        <div className="space-x-4">
          <Link
            href="/auth/signup"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block"
          >
            Comenzar Gratis
          </Link>
          <Link
            href="/auth/signin"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg border border-blue-600 hover:bg-blue-50 inline-block"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </Layout>
  );
}
