
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Upload, Database, Repeat, LogIn } from 'lucide-react';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ fullName: '', email: '', username: '', password: '', confirmPassword: '' });
  const [activeTab, setActiveTab] = useState('login');
  
  // Mock analysis logs
  const analysisLogs = [
    { imageId: 'WR001', class: 'MRMS', infectionPercent: 22, timestamp: '2025-08-15 14:32' },
    { imageId: 'WR002', class: 'MS', infectionPercent: 35, timestamp: '2025-08-14 09:45' },
    { imageId: 'WR003', class: 'R', infectionPercent: 5, timestamp: '2025-08-13 16:20' },
    { imageId: 'WR004', class: 'MR', infectionPercent: 12, timestamp: '2025-08-12 11:10' },
    { imageId: 'WR005', class: 'S', infectionPercent: 48, timestamp: '2025-08-11 15:30' },
    { imageId: 'WR006', class: 'RMR', infectionPercent: 8, timestamp: '2025-08-10 13:15' },
    { imageId: 'WR007', class: 'MS', infectionPercent: 30, timestamp: '2025-08-09 10:45' },
    { imageId: 'WR008', class: 'MRMS', infectionPercent: 25, timestamp: '2025-08-08 14:55' },
    { imageId: 'WR009', class: 'MR', infectionPercent: 15, timestamp: '2025-08-07 16:20' },
    { imageId: 'WR010', class: 'S', infectionPercent: 55, timestamp: '2025-08-06 11:10' },
  ];
  
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };
  
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This would normally authenticate against your backend
    // For this demo, we'll accept any non-empty username/password
    if (loginData.username.trim() && loginData.password.trim()) {
      setIsLoggedIn(true);
      toast.success("Login successful!");
    } else {
      toast.error("Please enter both username and password");
    }
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (
      !registerData.fullName.trim() ||
      !registerData.email.trim() ||
      !registerData.username.trim() ||
      !registerData.password.trim()
    ) {
      toast.error("All fields are required");
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    // This would normally register the user in your backend
    // For this demo, we'll just show a success message and switch to login
    toast.success("Registration successful! Please log in.");
    setActiveTab('login');
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginData({ username: '', password: '' });
    toast.success("Logged out successfully");
  };
  
  const handleUploadDataset = () => {
    toast.success("Dataset uploaded successfully");
  };
  
  const handleRetrainModel = () => {
    toast.success("Model retraining initiated");
  };

  return (
    <Layout>
      <div className="page-container">
        <h1 className="section-heading text-center">Admin Panel</h1>
        
        {!isLoggedIn ? (
          <div className="max-w-md mx-auto mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Admin Access</CardTitle>
                <CardDescription>Login or register for admin access</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="mt-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          name="username"
                          value={loginData.username}
                          onChange={handleLoginChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-agro-primary hover:bg-agro-dark">
                        <LogIn className="h-4 w-4 mr-2" /> Log In
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="register" className="mt-4">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={registerData.fullName}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={registerData.email}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="regUsername">Username</Label>
                        <Input
                          id="regUsername"
                          name="username"
                          value={registerData.username}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="regPassword">Password</Label>
                        <Input
                          id="regPassword"
                          name="password"
                          type="password"
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-agro-primary hover:bg-agro-dark">
                        Register
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="mt-8 space-y-12">
            {/* Admin Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-agro-dark">Welcome, Admin</h2>
                <p className="text-gray-600">Manage your wheat rust analysis system</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
            
            <Separator />
            
            {/* Analysis Logs */}
            <div>
              <h2 className="text-xl font-bold text-agro-primary mb-6">Analysis Logs</h2>
              
              <Card>
                <CardContent className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-agro-primary/10">
                          <th className="px-4 py-2 text-left text-agro-dark">Image ID</th>
                          <th className="px-4 py-2 text-left text-agro-dark">Class</th>
                          <th className="px-4 py-2 text-left text-agro-dark">Infection %</th>
                          <th className="px-4 py-2 text-left text-agro-dark">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisLogs.map((log, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">{log.imageId}</td>
                            <td className="px-4 py-3">{log.class}</td>
                            <td className="px-4 py-3">{log.infectionPercent}%</td>
                            <td className="px-4 py-3">{log.timestamp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Admin Tools */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Dataset Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload New Dataset
                  </CardTitle>
                  <CardDescription>
                    Add new wheat rust images to improve model training
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-agro-primary transition-colors">
                    <input id="dataset" type="file" multiple className="hidden" />
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-500 mt-2">Click to upload dataset</p>
                    <p className="text-xs text-gray-400">ZIP or folder containing images</p>
                  </div>
                  
                  <Button onClick={handleUploadDataset} className="w-full mt-6 bg-agro-primary hover:bg-agro-dark">
                    Upload Dataset
                  </Button>
                </CardContent>
              </Card>
              
              {/* Model Retraining */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Repeat className="h-5 w-5 mr-2" />
                    Model Retraining
                  </CardTitle>
                  <CardDescription>
                    Retrain AI models with new datasets for improved accuracy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">VGG16 Model</span>
                      <span className="text-sm text-green-600">Ready</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Siamese Network</span>
                      <span className="text-sm text-green-600">Ready</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Feature Database</span>
                      <span className="text-sm text-green-600">Up to date</span>
                    </div>
                  </div>
                  
                  <Button onClick={handleRetrainModel} className="w-full bg-agro-primary hover:bg-agro-dark">
                    <Database className="mr-2 h-4 w-4" /> Retrain Models
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Admin;
