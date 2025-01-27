import ClientProvider from "../components/providers/ClientProvider";
import Navigation from "../components/Navigation";
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
          <Navigation />
          <main>{children}</main>
        </ClientProvider>
      </body>
    </html>
  );
}
