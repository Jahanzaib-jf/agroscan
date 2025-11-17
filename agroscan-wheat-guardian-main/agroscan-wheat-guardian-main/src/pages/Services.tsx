'use client';
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const exampleImages = [
  { id: 'ex-1', path: '/examples/example1.jpg' },
  { id: 'ex-2', path: '/examples/example2.jpg' },
  { id: 'ex-3', path: '/examples/example3.jpg' },
  { id: 'ex-4', path: '/examples/example5.jpg' },
  { id: 'ex-5', path: '/examples/example4.jpg' },
];

const Services = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageId, setImageId] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [results, setResults] = useState<{
    class: string;
    infectionPercent: number;
    finalResult: string;
    originalImage: string;
    maskImage: string;
    highlightedImage: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];

      if (!validTypes.includes(selectedFile.type)) {
        toast.error("Invalid Image.");
        setFile(null);
        setPreviewUrl(null);
        return;
      }

      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleImageIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageId(e.target.value);
  };

  const handleExampleSelect = async (imagePath: string, exampleId: string) => {
    try {
      const response = await fetch(imagePath);
      const blob = await response.blob();
      const file = new File([blob], `example-${exampleId}.jpg`, { type: blob.type });

      setFile(file);
      setImageId(exampleId);
      setPreviewUrl(URL.createObjectURL(file));
      toast.success("Image loaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to load example image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select an image file");
      return;
    }

    if (!imageId.trim()) {
      toast.error("Please enter an Image ID");
      return;
    }

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("image_id", imageId);

      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const data = await response.json();

      setResults({
        class: data.predicted_class,
        infectionPercent: data.infected_percentage,
        finalResult: data.result,
        originalImage: URL.createObjectURL(file),
        maskImage: `data:image/png;base64,${data.green_mask}`,
        highlightedImage: `data:image/png;base64,${data.infected_highlight}`,
      });

      toast.success("Analysis completed successfully");
    } catch (error) {
      console.error(error);
      toast.error("Invalid image. Please provide wheat leaf sample.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!results) return;

    const reportElement = document.getElementById("report-section");
    if (!reportElement) return;

    const canvas = await html2canvas(reportElement);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const currentDate = new Date().toLocaleString();

    pdf.setFontSize(16);
    pdf.text("AgroScan Analysis Report", 15, 20);
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${currentDate}`, 15, 28);

    const imgWidth = 180;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 35;

    pdf.addImage(imgData, "PNG", 15, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 15, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`wheat-rust-report-${imageId}.pdf`);
    toast.success("Report downloaded successfully");
  };

  return (
    <Layout>
      <div className="page-container">
        <h1 className="section-heading text-center">Wheat Rust Analyzer</h1>

        <div className="max-w-3xl mx-auto">
          {!results ? (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Upload Wheat Image for Analysis</CardTitle>
                <CardDescription>
                  Upload a clear image of wheat leaves to analyze for rust disease
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="imageId">Image ID</Label>
                    <Input
                      id="imageId"
                      placeholder="Enter a unique ID for this image"
                      value={imageId}
                      onChange={handleImageIdChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Upload Image</Label>
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-agro-primary transition-colors"
                      onClick={() => document.getElementById('image')?.click()}
                    >
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      {previewUrl ? (
                        <div className="space-y-4">
                          <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                          <p className="text-sm text-gray-500">Click to change image</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                          <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-400">PNG, JPG, JPEG</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Sample images:</Label>
                    <div className="flex overflow-x-auto gap-4 pb-4">
                      {exampleImages.map((example) => (
                        <div
                          key={example.id}
                          onClick={() => handleExampleSelect(example.path, example.id)}
                          className="flex-shrink-0 cursor-pointer hover:opacity-75 transition-opacity"
                        >
                          <img
                            src={example.path}
                            alt="Example"
                            className="h-24 w-24 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <p className="text-xs text-center mt-1 text-gray-500">Sample {example.id}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-agro-primary hover:bg-agro-dark"
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze Image"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="mt-8 space-y-8" id="report-section">
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                  <CardDescription>Image ID: {imageId}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="border rounded-lg p-4 text-center">
                      <h3 className="text-lg font-medium text-gray-700">Predicted Class</h3>
                      <p className="text-2xl font-bold text-agro-primary mt-2">{results.class}</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <h3 className="text-lg font-medium text-gray-700">Infected Area</h3>
                      <p className="text-2xl font-bold text-agro-primary mt-2">{results.infectionPercent}%</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <h3 className="text-lg font-medium text-gray-700">Final Result</h3>
                      <p className="text-2xl font-bold text-agro-primary mt-2">{results.finalResult}</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-gray-700 mb-4">Result Images</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <img src={results.originalImage} alt="Original" className="rounded-lg w-full h-56 object-cover" />
                      <p className="text-sm text-center text-gray-500">Original Image</p>
                    </div>
                    <div className="space-y-2">
                      <img src={results.maskImage} alt="Green Mask" className="rounded-lg w-full h-56 object-cover" />
                      <p className="text-sm text-center text-gray-500">Green Mask</p>
                    </div>
                    <div className="space-y-2 cursor-pointer" onClick={() => setIsModalOpen(true)}>
                      <img src={results.highlightedImage} alt="Highlighted" className="rounded-lg w-full h-56 object-cover" />
                      <p className="text-sm text-center text-gray-500">Infected Region Highlighted</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleDownloadReport}
                    className="w-full mt-8 bg-agro-accent hover:bg-agro-accent/90 text-gray-800"
                  >
                    <Download className="mr-2 h-4 w-4" /> Download Report (PDF)
                  </Button>

                  <Button
                    onClick={() => {
                      setResults(null);
                      setFile(null);
                      setPreviewUrl(null);
                      setImageId('');
                    }}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    Analyze Another Image
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Fullscreen View */}
      {isModalOpen && results?.highlightedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="relative">
            <img src={results.highlightedImage} alt="Fullscreen" className="max-h-[90vh] max-w-[90vw] rounded-lg" />
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-200"
            >
              <X className="h-5 w-5 text-black" />
            </button>
          </div>
        </div>
      )}
      <div className="bg-white shadow-md rounded-xl p-6 mt-10 max-w-3xl mx-auto">
  <h2 className="text-2xl font-bold text-green-700 text-center mb-4">Dataset Converter</h2>
  <p className="text-gray-600 text-center mb-6">Convert dataset to JPEG/JPG</p>

  {/* File Upload */}
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Dataset folder</label>
    <div className="flex justify-center items-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-gray-300">
      <div className="space-y-1 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M14 22l10-10 10 10M24 32V12"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 24v14h36V24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="flex text-sm text-gray-600 justify-center">
          <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-700 hover:text-green-600">
            <span>Click to upload</span>
            <input type="file" className="sr-only" />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">.CR2 Folder</p>
      </div>
    </div>
  </div>

  {/* Format Options */}
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">Target Format</label>
    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm">
      <option>JPEG</option>
      <option>JPG</option>
      
    </select>
  </div>

  {/* Convert Button */}
  <button
    type="button"
    className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
  >
    Convert Dataset
  </button>
</div>

    </Layout>
  );
};

export default Services;
