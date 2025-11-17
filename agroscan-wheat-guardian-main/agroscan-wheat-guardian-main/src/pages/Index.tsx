
import React from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <Features />
      
      {/* Process Section */}
      <section className="py-16 bg-agro-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-agro-primary">How AgroScan Works</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Our AI-driven process ensures accurate diagnosis of wheat rust disease in just a few simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-agro-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-agro-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-agro-dark">Upload Image</h3>
              <p className="text-gray-600">Upload your wheat leaf image and enter an Image ID for tracking.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-agro-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-agro-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-agro-dark">AI Analysis</h3>
              <p className="text-gray-600">Our deep learning models analyze the image to detect and classify rust severity.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-agro-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-agro-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-agro-dark">Get Results</h3>
              <p className="text-gray-600">Receive detailed analysis with visualization and downloadable reports.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild className="bg-agro-primary hover:bg-agro-dark">
              <Link to="/how-it-works">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-16 bg-agro-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Analyze Your Wheat Samples?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Start using AgroScan today to accurately diagnose and analyze wheat rust disease in your crops.
          </p>
          <Button asChild size="lg" variant="outline" className="bg-white text-agro-primary hover:bg-gray-100 border-white">
            <Link to="/services">
              Start Analysis <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
