import './globals.css';

export const metadata = {
  title: 'DailyDev Digest',
  description: 'Your daily digest of developer news from HN, Dev.to, and Reddit',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}