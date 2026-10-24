import "./globals.css";

export const metadata = {
  title: "SMIT Final Hackathon",
  description: "Created for SMIT Final Hackathon",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
