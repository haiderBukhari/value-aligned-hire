
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, Mail, MapPin, Calendar, Phone, ExternalLink, FileText, 
  Star, Award, Clock, User, Briefcase, MessageSquare, CheckCircle,
  Download, Eye, Target, TrendingUp
} from "lucide-react";

const CandidateDetailsView = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<any>(null);
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const WORKFLOW_STEP_TO_COLUMN = {
    'Application Screening': 'is_screening',
    'Initial Interview': 'is_initial_interview',
    'Assessment': 'in_assessment',
    'Secondary Interview': 'is_secondary_interview',
    'Final Interview': 'in_final_interview',
    'Offer Stage': 'is_hired',
  };

  useEffect(() => {
    const fetchCandidateAndWorkflow = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          return;
        }

        // Fetch candidate details
        const candidateResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/candidates/${candidateId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!candidateResponse.ok) {
          throw new Error('Failed to fetch candidate details');
        }

        const candidateData = await candidateResponse.json();
        setCandidate(candidateData.candidate);

        // Fetch workflow
        const workflowResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/workflow`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (workflowResponse.ok) {
          const workflowData = await workflowResponse.json();
          setWorkflow(workflowData.workflow);
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching candidate details');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (candidateId) {
      fetchCandidateAndWorkflow();
    }
  }, [candidateId]);

  const getCurrentStage = (candidate: any) => {
    if (!workflow) return 'Unknown';
    
    const workflowSteps = workflow.workflow_process;
    const stepOrder = ['step4', 'step3', 'step2', 'step1'];
    
    for (const step of stepOrder) {
      const stepName = workflowSteps[step];
      const columnName = WORKFLOW_STEP_TO_COLUMN[stepName];
      if (candidate[columnName]) {
        return stepName;
      }
    }
    
    return workflowSteps.step1 || 'Application Screening';
  };

  const getStageScore = (candidate: any, stage: string) => {
    switch (stage) {
      case 'Application Screening':
        return candidate.screening_score || 0;
      case 'Initial Interview':
        return candidate.initial_interview_score || 0;
      case 'Assessment':
        return candidate.score || 0;
      case 'Secondary Interview':
        return candidate.scondary_interview_score || 0;
      case 'Final Interview':
        return candidate.final_interview_score || 0;
      default:
        return 0;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading candidate details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Candidate not found</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const currentStage = getCurrentStage(candidate);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Candidate Profile</h1>
            <p className="text-gray-600 mt-1">Comprehensive view of candidate progress</p>
          </div>
        </div>

        {/* Candidate Overview */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24 ring-4 ring-blue-100">
                {candidate.picture ? (
                  <AvatarImage src={candidate.picture} alt={candidate.applicant_name} />
                ) : null}
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-2xl">
                  {candidate.applicant_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{candidate.applicant_name}</h2>
                  <div className="flex items-center gap-4 mt-2 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{candidate.email}</span>
                    </div>
                    {candidate.created_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Applied {new Date(candidate.created_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2 text-sm font-medium">
                    Current Stage: {currentStage}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className={`text-xl font-bold ${getScoreColor(candidate.total_weighted_score || 0)}`}>
                      {candidate.total_weighted_score || 0}% Total Score
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {candidate.cv_link && (
                    <Button variant="outline" asChild>
                      <a href={candidate.cv_link} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2" />
                        View CV
                      </a>
                    </Button>
                  )}
                  {candidate.coverletter_link && (
                    <Button variant="outline" asChild>
                      <a href={candidate.coverletter_link} target="_blank" rel="noopener noreferrer">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Cover Letter
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="scores" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1">
            <TabsTrigger value="scores">Scores & Progress</TabsTrigger>
            <TabsTrigger value="evaluation">Evaluation Details</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
            <TabsTrigger value="assignment">Assignment</TabsTrigger>
            <TabsTrigger value="offer">Offer Details</TabsTrigger>
          </TabsList>

          <TabsContent value="scores" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Company Fit</span>
                      <span className={`font-bold ${getScoreColor(candidate.company_fit_score || 0)}`}>
                        {candidate.company_fit_score || 0}%
                      </span>
                    </div>
                    <Progress value={candidate.company_fit_score || 0} className="h-2" />
                    <p className="text-xs text-gray-600">{candidate.company_fit_reason}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Culture Fit</span>
                      <span className={`font-bold ${getScoreColor(candidate.culture_score || 0)}`}>
                        {candidate.culture_score || 0}%
                      </span>
                    </div>
                    <Progress value={candidate.culture_score || 0} className="h-2" />
                    <p className="text-xs text-gray-600">{candidate.culture_reason}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Skills Match</span>
                      <span className={`font-bold ${getScoreColor(candidate.skill_score || 0)}`}>
                        {candidate.skill_score || 0}%
                      </span>
                    </div>
                    <Progress value={candidate.skill_score || 0} className="h-2" />
                    <p className="text-xs text-gray-600">{candidate.skill_reason}</p>
                  </div>
                </div>

                {workflow && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Stage Progress</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.values(workflow.workflow_process).map((stage: any) => {
                        const stageScore = getStageScore(candidate, stage);
                        const isCompleted = candidate[WORKFLOW_STEP_TO_COLUMN[stage]];
                        return (
                          <div key={stage} className={`p-4 rounded-lg border ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{stage}</span>
                              {isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <Clock className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            {stageScore > 0 && (
                              <div className="flex items-center gap-2">
                                <Progress value={stageScore} className="flex-1 h-2" />
                                <span className={`text-sm font-bold ${getScoreColor(stageScore)}`}>
                                  {stageScore}%
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evaluation">
            <Card>
              <CardHeader>
                <CardTitle>Evaluation Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Experience Facts</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {candidate.experience_facts?.map((fact: string, index: number) => (
                      <li key={index}>{fact}</li>
                    )) || <p>No experience facts available</p>}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Final Recommendation</h3>
                  <p className="text-gray-700">{candidate.final_recommendation || 'No recommendation available'}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Level Suggestion</h3>
                  <Badge variant="outline">{candidate.level_suggestion || 'Not specified'}</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interviews">
            <div className="space-y-6">
              {candidate.final_interview_schedule && (
                <Card>
                  <CardHeader>
                    <CardTitle>Final Interview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Schedule Details</h4>
                        <p><strong>Date:</strong> {candidate.final_interview_schedule.date}</p>
                        <p><strong>Time:</strong> {candidate.final_interview_schedule.time}</p>
                        <p><strong>Notes:</strong> {candidate.final_interview_schedule.notes}</p>
                        {candidate.final_interview_schedule.meet_link && (
                          <Button asChild className="mt-2">
                            <a href={candidate.final_interview_schedule.meet_link} target="_blank" rel="noopener noreferrer">
                              Join Meeting
                            </a>
                          </Button>
                        )}
                      </div>
                      
                      {candidate.final_details && (
                        <div>
                          <h4 className="font-medium mb-2">Interview Feedback</h4>
                          <p><strong>Overall:</strong> {candidate.final_details.overall}/5</p>
                          <p><strong>Communication:</strong> {candidate.final_details.communication}/5</p>
                          <p><strong>Job Skills:</strong> {candidate.final_details.job_related_skill}/5</p>
                          <p><strong>Professionalism:</strong> {candidate.final_details.professionalism}/5</p>
                          <p className="mt-2"><strong>Feedback:</strong> {candidate.final_details.detailed_feedback}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="assignment">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {candidate.assignment_template?.[0] && (
                  <div>
                    <h3 className="font-semibold mb-2">{candidate.assignment_template[0].title}</h3>
                    <p className="text-gray-700 mb-4">{candidate.assignment_template[0].description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <p><strong>Duration:</strong> {candidate.assignment_template[0].duration}</p>
                      <p><strong>Deadline:</strong> {new Date(candidate.assignment_template[0].deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}

                {candidate.assignment_feedback && (
                  <div>
                    <h3 className="font-semibold mb-2">Assignment Feedback</h3>
                    <p className="text-gray-700">{candidate.assignment_feedback}</p>
                  </div>
                )}

                {candidate.full_assignment_submission?.[0] && (
                  <div>
                    <h3 className="font-semibold mb-2">Candidate Submission</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {Object.entries(candidate.full_assignment_submission[0].answers).map(([key, answer]) => (
                        <div key={key} className="mb-2">
                          <p><strong>Answer {parseInt(key) + 1}:</strong> {answer as string}</p>
                        </div>
                      ))}
                      <p className="text-sm text-gray-600 mt-2">
                        Submitted: {new Date(candidate.full_assignment_submission[0].submission_time).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offer">
            <Card>
              <CardHeader>
                <CardTitle>Offer Information</CardTitle>
              </CardHeader>
              <CardContent>
                {candidate.offer_details ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-800 mb-2">Offer Details</h3>
                      <pre className="bg-white p-4 rounded text-sm border">
                        {JSON.stringify(candidate.offer_details, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No offer details available yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CandidateDetailsView;
