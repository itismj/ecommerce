import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Mini Store",
  description: "Simple online store built with Next.js and Spring",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="p-4">{children}</main>
          <footer className="text-center py-4 text-gray-600 text-sm border-t mt-8">
            © {new Date().getFullYear()} Mini Store
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
