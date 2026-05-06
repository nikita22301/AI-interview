import type { Metadata } from "next";
import "../../public/globals.css";
import { Noto_Sans, Roboto_Mono } from 'next/font/google'

const noto = Noto_Sans({  // Heading
  subsets: ['latin'],
  weight: ['100','200','300','400','500','600','700','800','900'],
})

const robotoMono = Roboto_Mono({ // pra
  subsets: ['latin'],
  weight: ['100','200','300','400','500','600','700'],
})

export const metadata: Metadata = {
  title: "AI Interview",
  description: "Get ready for your next interview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${noto.className}`}
    >
      <body className={`${robotoMono.className} min-h-full flex flex-col bg-black`}>{children}</body>
    </html>
  );
}
