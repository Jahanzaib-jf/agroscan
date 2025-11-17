
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-white to-agro-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-agro-primary mb-6 animate-fade-up">
            AgroScan
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-700 mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            AgroScan is an AI-driven crop disease diagnosis tool that classifies wheat rust severity and highlights infected regions in wheat leaves. It supports agricultural research by enabling image-based analysis for accurate severity grading and infection quantification.
          </p>
          <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Button asChild size="lg" className="bg-agro-accent hover:bg-agro-accent/90 text-gray-800 font-medium">
              <Link to="/services">
                Start Analysis <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
