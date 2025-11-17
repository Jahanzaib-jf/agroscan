
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const teamMembers = [
    {
      name: 'Suleman Sohail Sarwar',
      role: 'Lead Engineer',
      bio: 'Expert in deep learning, computer vision, and AI development using Python, TensorFlow, and OpenCV to solve complex real-world problems across domains.',
      image: 'https://media.licdn.com/dms/image/v2/D4E03AQHLWBd0jgHH9Q/profile-displayphoto-scale_200_200/B4EZjjZBfTGYAY-/0/1756161652141?e=1760572800&v=beta&t=q8RqSkrIR81Q_RUJq5eYHcif9vx7mJXtHCaVZKklV1o',
    },
    {
      name: 'Jahanzaib Fareed',
      role: 'Lead Engineer',
      bio: 'Proficient in building and deploying intelligent systems using PyTorch, scikit-learn, and advanced image processing techniques, with a solid background in computer engineering.',
      image: 'https://media.licdn.com/dms/image/v2/D4D03AQFyNqeBfKZJSg/profile-displayphoto-shrink_200_200/B4DZVIZo.8HYAY-/0/1740676436404?e=1753920000&v=beta&t=eaf3j50DqW_3IOs-oqs8RtAVfiN4PnfgKG9RyTyR_2E',
    },
    {
      name: 'Dr. Amina Jameel',
      role: 'Supervisor',
      bio: 'Bridges research and practical application for farmers and agricultural stakeholders.',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcxNzI2NTc0Mw&ixlib=rb-4.0.3&q=80&w=500',
    },
    {
      name: 'Dr. Zahid Mahmood',
      role: 'Agricultural Expert',
      bio: 'Principal Scientific Officer, Wheat Programme, National Agricultural Research Centre',
      image: 'https://media.licdn.com/dms/image/v2/D4D03AQG2VJyrLyVBIQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1665943468108?e=1753920000&v=beta&t=Us7YUvmoUWWgjRDFKzJTw8WH5v4sZ3JYRrJBrrvbFlo',
    },
    
  ];

  return (
    <Layout>
      <div className="page-container">
        <h1 className="section-heading text-center">About AgroScan</h1>
        
        {/* Mission Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-lg text-gray-700 leading-relaxed">
            AgroScan is a cutting-edge research tool developed to advance the field of agriculture by integrating artificial intelligence and plant health diagnostics. Its goal is to support early disease detection, improved yield sustainability, and research advancement in the fight against wheat rust.
          </p>
        </div>
        
        {/* Vision Section */}
        <div className="bg-agro-primary text-white py-12 rounded-lg mb-16">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h2 className="text-2xl font-bold mb-6">Our Vision</h2>
            <p className="text-lg leading-relaxed">
              We envision a future where advanced AI technologies contribute to global food security by enabling precise, timely, and accessible disease management tools for agricultural researchers and practitioners worldwide.
            </p>
          </div>
        </div>
        
        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-agro-primary text-center mb-8">Our Research Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-56 object-cover"
                />
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold text-agro-dark">{member.name}</h3>
                  <p className="text-agro-primary font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Affiliations Section */}
        <div>
          <h2 className="text-2xl font-bold text-agro-primary text-center mb-8">Research Affiliations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">National Agriculture Research Centre</h3>
              <p className="text-gray-600">Wheat Programme</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Bahria University Islamabad</h3>
              <p className="text-gray-600">Department of Computer Engineering</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Center of Excellence in AI</h3>
              <p className="text-gray-600">Bahria University Islamabad</p>
            </div>
           
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
