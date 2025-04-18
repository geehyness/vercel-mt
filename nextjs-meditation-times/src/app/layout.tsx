import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './styles.css';
import { AudioPlayerProvider } from '@/context/AudioPlayerContext';

export const metadata = {
  title: 'Meditation Times',
  description: 'Your weekly devotional to meditate on.',
};

import FloatingAudioControls from '@/components/FloatingAudioControls';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AudioPlayerProvider>
            <Header />
            <main className="main-content">{children}</main>
            
            {/* Make sure this is placed here */}
            <FloatingAudioControls />

            <Footer />
          </AudioPlayerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}