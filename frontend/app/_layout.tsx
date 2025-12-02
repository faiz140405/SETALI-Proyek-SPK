// Location: app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        {/* Layar ini mengarah ke folder (tabs). 
          headerShown: false agar header stack tidak dobel dengan header tab.
        */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Layar untuk halaman pencarian dinamis.
          Kita biarkan headernya dikontrol oleh file [method].tsx sendiri.
        */}
        <Stack.Screen name="search/[method]" options={{ presentation: 'card' }} />
      </Stack>
    </>
  );
}