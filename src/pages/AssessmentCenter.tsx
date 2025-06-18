import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Edit, Eye, CheckCircle, AlertTriangle, Info, ArrowRight } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  status: string;
  score: number;
  jobId: string;
}

const AssessmentCenter = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Mock data for candidates
    const mockCandidates: Candidate[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        jobTitle: "Frontend Developer",
        status: "Assignment Pending to be Sent",
        score: 85,
        jobId: "101",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        jobTitle: "Backend Developer",
        status: "Assessment Completed",
        score: 92,
        jobId: "102",
      },
      {
        id: "3",
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        jobTitle: "Data Scientist",
        status: "Initial Screening",
        score: 78,
        jobId: "103",
      },
      {
        id: "4",
        name: "Bob Williams",
        email: "bob.williams@example.com",
        jobTitle: "Project Manager",
        status: "Assignment Pending to be Sent",
        score: 65,
        jobId: "104",
      },
      {
        id: "5",
        name: "Charlie Brown",
        email: "charlie.brown@example.com",
        jobTitle: "UX Designer",
        status: "Assessment Completed",
        score: 88,
        jobId: "105",
      },
    ];

    setCandidates(mockCandidates);
    setFilteredCandidates(mockCandidates);
  }, []);

  useEffect(() => {
    let results = candidates;

    if (filterStatus) {
      results = results.filter((candidate) => candidate.status === filterStatus);
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      results = results.filter((candidate) =>
        candidate.name.toLowerCase().includes(lowerCaseQuery) ||
        candidate.email.toLowerCase().includes(lowerCaseQuery) ||
        candidate.jobTitle.toLowerCase().includes(lowerCaseQuery)
      );
    }

    setFilteredCandidates(results);
  }, [candidates, filterStatus, searchQuery]);

  const handleCraftAssignment = (candidateId: string, jobId: string) => {
    navigate(`/dashboard/jobs/${jobId}/resume/${candidateId}/craft-assignment`);
  };

  const handleViewDetails = (candidateId: string, jobId: string) => {
    navigate(`/dashboard/jobs/${jobId}/resume/${candidateId}`);
  };

  const handleStatusChange = (candidateId: string, newStatus: string) => {
    setCandidates((prevCandidates) =>
      prevCandidates.map((candidate) =>
        candidate.id === candidateId ? { ...candidate, status: newStatus } : candidate
      )
    );
  };

  const handleOpenFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const handleApplyFilters = () => {
    setIsFilterModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white py-6 px-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assessment Center</h1>
            <p className="text-gray-600 mt-1">Manage and track candidate assessments</p>
          </div>
          <Input
            type="text"
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-6xl mx-auto mt-6 px-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleOpenFilterModal}>
            Filter Candidates
          </Button>
        </div>
      </div>
      
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Users className="h-6 w-6" />
            Active Assessments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="px-6 py-3 font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 font-semibold text-gray-900">Job Title</th>
                  <th className="px-6 py-3 font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 font-semibold text-gray-900">Score</th>
                  <th className="px-6 py-3 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((candidate, index) => (
                  <motion.tr
                    key={candidate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{candidate.name}</td>
                    <td className="px-6 py-4">{candidate.email}</td>
                    <td className="px-6 py-4">{candidate.jobTitle}</td>
                    <td className="px-6 py-4">
                      <Select value={candidate.status} onValueChange={(value) => handleStatusChange(candidate.id, value)}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Initial Screening">Initial Screening</SelectItem>
                          <SelectItem value="Assignment Pending to be Sent">Assignment Pending to be Sent</SelectItem>
                          <SelectItem value="Assessment Completed">Assessment Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {candidate.score > 70 ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : candidate.score > 50 ? (
                          <Info className="h-4 w-4 text-blue-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                        {candidate.score}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {candidate.status === 'Assignment Pending to be Sent' && (
                          <Button
                            size="sm"
                            onClick={() => handleCraftAssignment(candidate.id, candidate.jobId)}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            Craft Assignment
                          </Button>
                        )}
                        <Button size="sm" onClick={() => handleViewDetails(candidate.id, candidate.jobId)}>
                          <Eye className="mr-1 h-3 w-3" />
                          View Details
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Filter Modal */}
      <Dialog open={isFilterModalOpen} onOpenChange={handleCloseFilterModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Candidates</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value)} className="col-span-3">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="Initial Screening">Initial Screening</SelectItem>
                  <SelectItem value="Assignment Pending to be Sent">Assignment Pending to be Sent</SelectItem>
                  <SelectItem value="Assessment Completed">Assessment Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={handleCloseFilterModal}>
              Cancel
            </Button>
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssessmentCenter;
