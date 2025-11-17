import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, File } from 'lucide-react';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart as ReLineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';
import * as XLSX from 'xlsx'; // ✅ Import xlsx

// Mock data for charts
const classDistributionData = [
  { name: 'R', count: 15 },
  { name: 'MR', count: 22 },
  { name: 'MS', count: 18 },
  { name: 'S', count: 12 },
  { name: 'RMR', count: 8 },
  { name: 'MRMS', count: 25 },
];

const infectionOverTimeData = [
  { date: '2025-05', percent: 18 },
  { date: '2025-05', percent: 22 },
  { date: '2025-05', percent: 19 },
  { date: '2025-05', percent: 24 },
  { date: '2025-05', percent: 27 },
  { date: '2025-05', percent: 21 },
  { date: '2025-06', percent: 15 },
  { date: '2025-06', percent: 12 },
];

const analysisHistory = [
  { id: 'WR001', class: 'MRMS', percent: 22, timestamp: '2025-05-1 14:32' },
  { id: 'WR002', class: 'MS', percent: 35, timestamp: '2025-05-6 09:45' },
  { id: 'WR003', class: 'R', percent: 5, timestamp: '2025-05-8 16:20' },
  { id: 'WR004', class: 'MR', percent: 12, timestamp: '2025-03-9 11:10' },
  { id: 'WR005', class: 'S', percent: 48, timestamp: '2025-03-11 15:30' },
  { id: 'WR006', class: 'RMR', percent: 8, timestamp: '2025-03-12 13:15' },
  { id: 'WR007', class: 'MS', percent: 30, timestamp: '2025-03-23 10:45' },
  { id: 'WR008', class: 'MRMS', percent: 25, timestamp: '2025-05-25 14:55' },
];

// ✅ Export to CSV
const exportToCSV = () => {
  const headers = ['Image ID', 'Class', 'Infection %', 'Timestamp'];
  const rows = analysisHistory.map(item => [item.id, item.class, item.percent, item.timestamp]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers, ...rows]
      .map(e => e.map(value => `"${value}"`).join(','))
      .join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'analysis_results.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ✅ Export to Excel
const exportToExcel = () => {
  const worksheetData = [
    ['Image ID', 'Class', 'Infection %', 'Timestamp'],
    ...analysisHistory.map(item => [item.id, item.class, item.percent, item.timestamp]),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Analysis Results');

  XLSX.writeFile(workbook, 'analysis_results.xlsx');
};

const Results = () => {
  const [activeTab, setActiveTab] = useState('charts');

  const handleExport = (format: string) => {
    if (format === 'csv') {
      exportToCSV();
      toast.success('CSV exported successfully');
    } else if (format === 'excel') {
      exportToExcel();
      toast.success('Excel exported successfully');
    } else {
      toast.info(`${format.toUpperCase()} export not implemented`);
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <h1 className="section-heading text-center">Results Dashboard</h1>

        <Tabs defaultValue="charts" value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="charts">Charts & Graphs</TabsTrigger>
            <TabsTrigger value="history">Analysis History</TabsTrigger>
          </TabsList>

          {/* Charts Tab */}
          <TabsContent value="charts" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2" />
                    Class Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ReBarChart data={classDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#2E7D32" name="Number of Samples" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Line Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="h-5 w-5 mr-2" />
                    Infection % Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ReLineChart data={infectionOverTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="percent"
                        stroke="#2E7D32"
                        name="Infection %"
                        activeDot={{ r: 8 }}
                      />
                    </ReLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Export Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button
                variant="outline"
                className="border-agro-primary text-agro-primary hover:bg-agro-primary hover:text-white"
                onClick={() => handleExport('excel')}
              >
                <File className="mr-2 h-4 w-4" /> Export as Excel
              </Button>
              <Button
                variant="outline"
                className="border-agro-primary text-agro-primary hover:bg-agro-primary hover:text-white"
                onClick={() => handleExport('csv')}
              >
                <File className="mr-2 h-4 w-4" /> Export as CSV
              </Button>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Analysis History</CardTitle>
              </CardHeader>
              <CardContent>
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
                      {analysisHistory.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{item.id}</td>
                          <td className="px-4 py-3">{item.class}</td>
                          <td className="px-4 py-3">{item.percent}%</td>
                          <td className="px-4 py-3">{item.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Export buttons under history */}
                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    variant="outline"
                    className="border-agro-primary text-agro-primary hover:bg-agro-primary hover:text-white"
                    onClick={() => handleExport('excel')}
                  >
                    <File className="mr-2 h-4 w-4" /> Export as Excel
                  </Button>
                  <Button
                    variant="outline"
                    className="border-agro-primary text-agro-primary hover:bg-agro-primary hover:text-white"
                    onClick={() => handleExport('csv')}
                  >
                    <File className="mr-2 h-4 w-4" /> Export as CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Results;
