import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Award, Clock, Calendar, Filter, Search, Eye, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";

const JobAssessmentCenter = () => {
  const { jobId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const stage = queryParams.get("stage") || "Assessment Center";

  const [searchTerm, setSearchTerm] = useState("");
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobs/${jobId}/assessments?stage=${encodeURIComponent(stage)}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch candidates');
        const data = await response.json();
        setCandidates(data.candidates || []);
      } catch (err: any) {
        setError(err.message || 'Error fetching candidates');
      } finally {
        setLoading(false);
      }
    };
    if (jobId) fetchCandidates();
  }, [jobId, stage]);

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.status?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'assignment received': return 'bg-green-100 text-green-800 border-green-200';
      case 'assignment pending to be sent': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'assignment pending by the candidate': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Assessment Center for Job #{jobId}</h2>
        <span className="text-gray-500 font-medium">Stage: {stage}</span>
      </div>
      <Card className="border-0 shadow-lg bg-white w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-6 w-6" />
            Candidate Assessments
          </CardTitle>
          <CardDescription>
            All candidates for this job and stage
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search candidates, status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Candidate</TableHead>
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Score</TableHead>
                  <TableHead className="font-semibold">Time Spent</TableHead>
                  <TableHead className="font-semibold">Assignment Sent</TableHead>
                  <TableHead className="font-semibold whitespace-nowrap text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8">Loading...</TableCell></TableRow>
                ) : error ? (
                  <TableRow><TableCell colSpan={7} className="text-center text-red-500 py-8">{error}</TableCell></TableRow>
                ) : filteredCandidates.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8">No candidates found</TableCell></TableRow>
                ) : (
                  filteredCandidates.map((candidate, index) => (
                    <motion.tr
                      key={candidate.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                              {candidate.name?.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{candidate.name}</p>
                            <p className="text-sm text-gray-500">{candidate.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-gray-700">{candidate.title}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(candidate.status)} font-medium`}>
                          {candidate.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {candidate.score !== undefined && candidate.score !== null ? (
                          <div className="flex items-center space-x-2">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span className="font-bold text-green-600">{candidate.score}%</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Pending</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {candidate.time_spent ? (
                          <div className="flex items-center text-gray-600">
                            <Clock className="mr-1 h-4 w-4" />
                            {candidate.time_spent}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {candidate.assignment_sent_date ? (
                          <div className="flex items-center text-gray-600">
                            <Calendar className="mr-1 h-4 w-4" />
                            {candidate.assignment_sent_date}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Not sent</span>
                        )}
                      </TableCell>
                      <TableCell className="w-1 whitespace-nowrap text-center">
                        <div className="flex justify-center">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobAssessmentCenter; 