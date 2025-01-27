import ClientProvider from "../components/providers/ClientProvider";
import Navigation from "../components/Navigation";
import BackgroundAnimation from "../components/BackgroundAnimation";
import "../app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>
          <BackgroundAnimation opacity={1.2} />
          <Navigation />
          <main>{children}</main>
        </ClientProvider>
      </body>
    </html>
  );
}
