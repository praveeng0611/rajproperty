import './globals.css';

export const metadata = {
  title: 'Raj Property — Rajsamand Real Estate',
  description: 'Find plots, houses, flats, and commercial properties in Rajsamand. Trusted local property listings.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
