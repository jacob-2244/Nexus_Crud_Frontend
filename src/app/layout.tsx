import "./globals.css";
import ReduxProvider from "@/redux/Provider";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <ReduxProvider>
          <Navbar />
          <Header />
          <main className="flex-1 px-4 md:px-8 py-6">{children}</main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
