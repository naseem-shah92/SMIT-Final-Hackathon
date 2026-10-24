import "./globals.css";

export const metadata = {
  title: "SMIT Final Hackathon | Web Application",
  description: "Official submission for SMIT Final Web Development Hackathon",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
