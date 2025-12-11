
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import AboutHero from '@/components/about/AboutHero';
import OurStory from '@/components/about/OurStory';
import Mission from '@/components/about/Mission';
import Values from '@/components/about/Values';
import Artisans from '@/components/about/Artisans';

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col font-sans">
            <Header />
            <main className="flex-1">
                <AboutHero />
                <OurStory />
                <Mission />
                <Values />
                <Artisans />
            </main>
            <Footer />
        </div>
    );
}
