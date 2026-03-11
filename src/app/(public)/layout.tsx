import Navbar from "@/components/static/Navbar";
import Footer from "@/components/static/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </>
  );
}