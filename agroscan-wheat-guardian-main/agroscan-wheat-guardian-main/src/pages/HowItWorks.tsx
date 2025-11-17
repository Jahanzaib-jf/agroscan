
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HowItWorks = () => {
  const processingSteps = [
    {
      title: "Image Resizing",
      description: "All uploaded wheat leaf images are resized to 224×224 pixels to ensure consistent input for the AI models.",
      icon: "📏",
    },
    {
      title: "Feature Extraction",
      description: "The VGG16 deep learning model extracts meaningful features from the image, capturing patterns relevant to disease identification.",
      icon: "🔍",
    },
    {
      title: "Classification",
      description: "A Siamese Neural Network compares the extracted features with a database of reference features to determine the disease classification.",
      icon: "🧮",
    },
    {
      title: "Infection Quantification",
      description: "HSV-based color segmentation is used to precisely measure and quantify the infected area as a percentage.",
      icon: "📊",
    },
    {
      title: "Result Generation",
      description: "Three output images are created: original, green mask (showing healthy vs. infected tissue), and infected region highlighted.",
      icon: "📷",
    },
  ];

  const faqs = [
    {
      question: "What wheat rust diseases can AgroScan detect?",
      answer: "AgroScan can detect and classify various types of wheat rust, including stem rust, leaf rust, and stripe rust, with different severity levels.",
    },
    {
      question: "What image quality is required for accurate analysis?",
      answer: "For optimal results, images should be well-lit, in focus, and capture the leaf clearly against a neutral background. The system works best with 1080p or higher resolution images.",
    },
    {
      question: "How accurate is the disease classification?",
      answer: "The combined VGG16 and Siamese Network approach achieves approximately 92-95% accuracy in classifying wheat rust severity classes when compared to expert pathologist assessments.",
    },
    {
      question: "Is internet connectivity required for analysis?",
      answer: "No, AgroScan operates entirely locally. Once installed, all analysis is performed on your computer without requiring an internet connection.",
    },
    {
      question: "Can the system be trained on new disease classes?",
      answer: "Yes, the admin panel includes functionality to upload new image datasets and retrain the models to recognize additional disease classes or improve accuracy for existing ones.",
    },
  ];

  return (
    <Layout>
      <div className="page-container">
        <h1 className="section-heading text-center">How It Works</h1>
        
        {/* Technical Overview */}
        <div className="max-w-3xl mx-auto mb-16">
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            AgroScan uses advanced deep learning techniques to analyze wheat rust disease. The system combines computer vision with specialized neural networks to provide accurate disease classification and quantification.
          </p>
          
          <div className="bg-agro-primary/10 rounded-lg p-6">
            <h2 className="text-xl font-bold text-agro-dark mb-4">Technical Specifications</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><span className="font-medium">AI Models:</span> VGG16 and Siamese Neural Network</li>
              <li><span className="font-medium">Image Processing:</span> OpenCV, HSV color segmentation</li>
              <li><span className="font-medium">Classification Method:</span> Feature comparison via Euclidean distance</li>
              <li><span className="font-medium">Output Format:</span> Disease class, infection percentage, annotated images</li>
              <li><span className="font-medium">Processing Time:</span> Typically 2-5 seconds per image on standard hardware</li>
            </ul>
          </div>
        </div>
        
        {/* Processing Steps */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-agro-primary text-center mb-8">Image Processing Workflow</h2>
          
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-agro-light -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {processingSteps.map((step, index) => (
                <div key={index} className="relative z-10">
                  <div className="bg-white rounded-lg shadow-md p-6 text-center h-full flex flex-col">
                    <div className="mx-auto bg-agro-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-4">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-agro-dark mb-2">{step.title}</h3>
                    <p className="text-gray-600 flex-grow">{step.description}</p>
                    <div className="hidden md:block absolute -bottom-3 left-1/2 -translate-x-1/2 bg-agro-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Output Examples */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-agro-primary text-center mb-8">Analysis Outputs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <img
                src="/howitworks/orig.jpg"
                alt="Original Input"
                className="mb-4 h-48 w-full object-cover rounded-md"
              />
              <h3 className="text-lg font-semibold text-agro-dark mb-2">Original Input</h3>
              <p className="text-gray-600">The uploaded wheat leaf image that will be analyzed by the system.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <img
                src="/howitworks/greenmask.jpg"
                alt="Green Mask"
                className="mb-4 h-48 w-full object-cover rounded-md"
              />
              <h3 className="text-lg font-semibold text-agro-dark mb-2">Green Mask</h3>
              <p className="text-gray-600">Black and white segmentation showing healthy vs. infected tissue areas.</p>
            </CardContent>
          </Card>

          <Card>    
            <CardContent className="pt-6">
              <img
                src="/howitworks/infect.jpg"
                alt="Infected Region Highlighted"
                className="mb-4 h-48 w-full object-cover rounded-md"
              />
              <h3 className="text-lg font-semibold text-agro-dark mb-2">Infected Region Highlighted</h3>
              <p className="text-gray-600">Original image with infected areas clearly highlighted against a blurred background.</p>
            </CardContent>
          </Card>

          </div>
        </div>
        
        {/* FAQs */}
        <div>
          <h2 className="text-2xl font-bold text-agro-primary text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:text-agro-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HowItWorks;
