
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Image, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      title: 'AI-Powered Analysis',
      description: 'Advanced deep learning models (VGG16 and Siamese Network) for accurate disease detection and classification.',
      icon: <Image className="h-12 w-12 text-agro-primary mb-4" />
    },
    {
      title: 'Accurate Quantification',
      description: 'Precise measurement of infected areas using HSV color segmentation for research-grade analysis.',
      icon: <BarChart className="h-12 w-12 text-agro-primary mb-4" />
    },
    {
      title: 'Research Support',
      description: 'Comprehensive tools for agricultural researchers to advance wheat rust studies and prevention.',
      icon: <Users className="h-12 w-12 text-agro-primary mb-4" />
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-agro-primary">Key Features</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            AgroScan combines cutting-edge AI technology with agricultural expertise to provide powerful disease diagnostic capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow card-gradient">
              <CardHeader className="text-center pt-8">
                <div className="flex justify-center">{feature.icon}</div>
                <CardTitle className="text-xl text-agro-dark">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
