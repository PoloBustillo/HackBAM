import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, Camera, Heart, User } from "lucide-react";

export default function Layout({ children }) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                MuseoPrefs
              </Link>
            </div>

            {session && (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                >
                  <Heart className="w-4 h-4" />
                  <span>Preferencias</span>
                </Link>
                <Link
                  href="/camera"
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                >
                  <Camera className="w-4 h-4" />
                  <span>Analizar</span>
                </Link>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{session.user.email}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Salir</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
