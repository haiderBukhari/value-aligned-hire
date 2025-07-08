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
  Download, Eye, Target, TrendingUp, DollarSign, Gift, CalendarDays, XCircle
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
        return candidate.screening_score || candidate.total_weighted_score || 0;
      case 'Initial Interview':
        return candidate.initial_interview_score || 0;
      case 'Assessment':
        return candidate.score || 0;
      case 'Secondary Interview':
        return candidate.scondary_interview_score || 0;
      case 'Final Interview':
        return candidate.final_interview_score || 0;
      case 'Offer Stage':
        return candidate.is_hired ? 100 : 0;
      default:
        return 0;
    }
  };

  const getStageDetails = (candidate: any, stage: string) => {
    switch (stage) {
      case 'Initial Interview':
        return candidate.initial_details;
      case 'Final Interview':
        return candidate.final_details;
      case 'Secondary Interview':
        return candidate.secondary_details;
      default:
        return null;
    }
  };

  const getStageSuggestion = (candidate: any, stage: string) => {
    switch (stage) {
      case 'Initial Interview':
        return candidate.initial_interview_suggestion;
      case 'Final Interview':
        return candidate.final_interview_suggestion;
      case 'Secondary Interview':
        return candidate.scondary_interview_suggestion;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatOfferDetails = (offerDetails: any) => {
    if (!offerDetails) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <DollarSign className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Base Salary</p>
                <p className="text-2xl font-bold text-green-900">${offerDetails.base_salary?.toLocaleString()}</p>
              </div>
            </div>
            
            {offerDetails.signing_bonus > 0 && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Gift className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Signing Bonus</p>
                  <p className="text-xl font-bold text-blue-900">${offerDetails.signing_bonus?.toLocaleString()}</p>
                </div>
              </div>
            )}
            
            {offerDetails.equity_percentage > 0 && (
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-800">Equity</p>
                  <p className="text-xl font-bold text-purple-900">{offerDetails.equity_percentage}%</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Important Dates
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Start Date:</strong> {new Date(offerDetails.start_date).toLocaleDateString()}</p>
                <p><strong>Response Deadline:</strong> {new Date(offerDetails.response_deadline).toLocaleDateString()}</p>
                <p><strong>Sent Date:</strong> {new Date(offerDetails.sent_date).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2">Status</h4>
              <Badge className={`${offerDetails.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                                offerDetails.status === 'accepted' ? 'bg-green-100 text-green-800 border-green-200' : 
                                'bg-red-100 text-red-800 border-red-200'} px-3 py-1`}>
                {offerDetails.status?.charAt(0).toUpperCase() + offerDetails.status?.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
        
        {offerDetails.benefits && offerDetails.benefits.length > 0 && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold mb-2">Benefits & Perks</h4>
            <ul className="list-disc list-inside space-y-1">
              {offerDetails.benefits.map((benefit: string, index: number) => (
                <li key={index} className="text-gray-700">{benefit}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
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

                {/* Assignment Score Section */}
                {candidate.score !== null && candidate.score !== undefined && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Assessment Score</h3>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Direct assessment performance</span>
                        <span className={`text-xl font-bold ${getScoreColor(candidate.score)}`}>
                          {candidate.score}%
                        </span>
                      </div>
                      <Progress value={candidate.score} className="h-3 mb-3" />
                      
                      {candidate.total_weighted_score && (
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Combined evaluation score</span>
                          <span className={`text-lg font-bold ${getScoreColor(candidate.total_weighted_score)}`}>
                            {candidate.total_weighted_score}%
                          </span>
                        </div>
                      )}
                      
                      {candidate.assignment_feedback && (
                        <div className="mt-4 p-3 bg-white rounded border">
                          <h4 className="font-semibold mb-2">AI Feedback</h4>
                          <p className="text-gray-700 text-sm">{candidate.assignment_feedback}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {workflow && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Stage Progress</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(workflow.workflow_process)
                        .sort(([a], [b]) => {
                          const orderA = parseInt(a.replace('step', ''));
                          const orderB = parseInt(b.replace('step', ''));
                          return orderA - orderB;
                        })
                        .map(([stepKey, stage]: [string, any]) => {
                        const stageScore = getStageScore(candidate, stage);
                        const isCompleted = candidate[WORKFLOW_STEP_TO_COLUMN[stage]];
                        const stageDetails = getStageDetails(candidate, stage);
                        const stageSuggestion = getStageSuggestion(candidate, stage);
                        
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
                            
                            <div className="flex items-center gap-2 mb-2">
                              <Progress value={stageScore} className="flex-1 h-2" />
                              <span className={`text-sm font-bold ${getScoreColor(stageScore)}`}>
                                {stageScore}%
                              </span>
                            </div>
                            
                            {stageDetails && (
                              <div className="text-xs text-gray-600 space-y-1 mb-2">
                                <p><strong>Overall:</strong> {stageDetails.overall}/5</p>
                                <p><strong>Communication:</strong> {stageDetails.communication}/5</p>
                                <p><strong>Job Skills:</strong> {stageDetails.job_related_skill}/5</p>
                                <p><strong>Professionalism:</strong> {stageDetails.professionalism}/5</p>
                              </div>
                            )}
                            
                            {stageSuggestion && (
                              <div className="text-xs text-gray-600">
                                <p><strong>Suggestion:</strong> {stageSuggestion}</p>
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
              {/* Final Interview */}
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
                          <div className="space-y-2">
                            <p><strong>Overall:</strong> {candidate.final_details.overall}/5</p>
                            <p><strong>Communication:</strong> {candidate.final_details.communication}/5</p>
                            <p><strong>Job Skills:</strong> {candidate.final_details.job_related_skill}/5</p>
                            <p><strong>Professionalism:</strong> {candidate.final_details.professionalism}/5</p>
                            {candidate.final_interview_score && (
                              <p><strong>Score:</strong> <span className={getScoreColor(candidate.final_interview_score)}>{candidate.final_interview_score}%</span></p>
                            )}
                            {candidate.final_interview_suggestion && (
                              <p><strong>Suggestion:</strong> {candidate.final_interview_suggestion}</p>
                            )}
                            <p className="mt-2"><strong>Feedback:</strong> {candidate.final_details.detailed_feedback}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Initial Interview */}
              {candidate.initial_interview_schedule && (
                <Card>
                  <CardHeader>
                    <CardTitle>Initial Interview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Schedule Details</h4>
                        <p><strong>Date:</strong> {candidate.initial_interview_schedule.date}</p>
                        <p><strong>Time:</strong> {candidate.initial_interview_schedule.time}</p>
                        <p><strong>Notes:</strong> {candidate.initial_interview_schedule.notes}</p>
                        {candidate.initial_interview_schedule.meet_link && (
                          <Button asChild className="mt-2">
                            <a href={candidate.initial_interview_schedule.meet_link} target="_blank" rel="noopener noreferrer">
                              Join Meeting
                            </a>
                          </Button>
                        )}
                      </div>
                      
                      {candidate.initial_details && (
                        <div>
                          <h4 className="font-medium mb-2">Interview Feedback</h4>
                          <div className="space-y-2">
                            <p><strong>Overall:</strong> {candidate.initial_details.overall}/5</p>
                            <p><strong>Communication:</strong> {candidate.initial_details.communication}/5</p>
                            <p><strong>Job Skills:</strong> {candidate.initial_details.job_related_skill}/5</p>
                            <p><strong>Professionalism:</strong> {candidate.initial_details.professionalism}/5</p>
                            {candidate.initial_interview_score && (
                              <p><strong>Score:</strong> <span className={getScoreColor(candidate.initial_interview_score)}>{candidate.initial_interview_score}%</span></p>
                            )}
                            {candidate.initial_interview_suggestion && (
                              <p><strong>Suggestion:</strong> {candidate.initial_interview_suggestion}</p>
                            )}
                            <p className="mt-2"><strong>Feedback:</strong> {candidate.initial_details.detailed_feedback}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Secondary Interview */}
              {candidate.scondary_interview_schedule && (
                <Card>
                  <CardHeader>
                    <CardTitle>Secondary Interview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Schedule Details</h4>
                        <p><strong>Date:</strong> {candidate.scondary_interview_schedule.date}</p>
                        <p><strong>Time:</strong> {candidate.scondary_interview_schedule.time}</p>
                        <p><strong>Notes:</strong> {candidate.scondary_interview_schedule.notes}</p>
                        {candidate.scondary_interview_schedule.meet_link && (
                          <Button asChild className="mt-2">
                            <a href={candidate.scondary_interview_schedule.meet_link} target="_blank" rel="noopener noreferrer">
                              Join Meeting
                            </a>
                          </Button>
                        )}
                      </div>
                      
                      {candidate.secondary_details && (
                        <div>
                          <h4 className="font-medium mb-2">Interview Feedback</h4>
                          <div className="space-y-2">
                            <p><strong>Overall:</strong> {candidate.secondary_details.overall}/5</p>
                            <p><strong>Communication:</strong> {candidate.secondary_details.communication}/5</p>
                            <p><strong>Job Skills:</strong> {candidate.secondary_details.job_related_skill}/5</p>
                            <p><strong>Professionalism:</strong> {candidate.secondary_details.professionalism}/5</p>
                            {candidate.scondary_interview_score && (
                              <p><strong>Score:</strong> <span className={getScoreColor(candidate.scondary_interview_score)}>{candidate.scondary_interview_score}%</span></p>
                            )}
                            {candidate.scondary_interview_suggestion && (
                              <p><strong>Suggestion:</strong> {candidate.scondary_interview_suggestion}</p>
                            )}
                            <p className="mt-2"><strong>Feedback:</strong> {candidate.secondary_details.detailed_feedback}</p>
                          </div>
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
                    <h3 className="font-semibold mb-2">{candidate.assignment_template[0].title || candidate.assignment_template[0].assessmentTitle}</h3>
                    <p className="text-gray-700 mb-4">{candidate.assignment_template[0].description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-6">
                      {candidate.assignment_template[0].duration && (
                        <p><strong>Duration:</strong> {candidate.assignment_template[0].duration}</p>
                      )}
                      {candidate.assignment_template[0].time_limit && (
                        <p><strong>Time Limit:</strong> {candidate.assignment_template[0].time_limit} minutes</p>
                      )}
                      {candidate.assignment_template[0].deadline && (
                        <p><strong>Deadline:</strong> {new Date(candidate.assignment_template[0].deadline).toLocaleDateString()}</p>
                      )}
                      {candidate.assignment_template[0].passing_score && (
                        <p><strong>Passing Score:</strong> {candidate.assignment_template[0].passing_score}%</p>
                      )}
                    </div>

                    {/* Quiz Questions Display */}
                    {candidate.assignment_template[0].questions && candidate.assignment_template[0].questions.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Quiz Questions & Answers</h4>
                        
                        {/* Summary Stats */}
                        {candidate.full_assignment_submission?.[0] && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
                              <div className="text-2xl font-bold text-blue-600">{candidate.assignment_template[0].questions.length}</div>
                              <div className="text-sm text-blue-800">Total Questions</div>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {candidate.assignment_template[0].questions.reduce((correct, question, index) => {
                                  const userAnswer = candidate.full_assignment_submission[0].answers[index.toString()];
                                  return correct + (userAnswer === question.correct_answer ? 1 : 0);
                                }, 0)}
                              </div>
                              <div className="text-sm text-green-800">Correct Answers</div>
                            </div>
                            <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-center">
                              <div className="text-2xl font-bold text-red-600">
                                {candidate.assignment_template[0].questions.reduce((wrong, question, index) => {
                                  const userAnswer = candidate.full_assignment_submission[0].answers[index.toString()];
                                  return wrong + (userAnswer !== question.correct_answer ? 1 : 0);
                                }, 0)}
                              </div>
                              <div className="text-sm text-red-800">Wrong Answers</div>
                            </div>
                          </div>
                        )}

                        {candidate.assignment_template[0].questions.map((question: any, index: number) => {
                          const userAnswer = candidate.full_assignment_submission?.[0]?.answers?.[index.toString()];
                          const isCorrect = userAnswer === question.correct_answer;
                          
                          return (
                            <div key={index} className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                              <div className="flex items-start gap-3 mb-3">
                                <div className={`p-1 rounded-full ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                                  {isCorrect ? (
                                    <CheckCircle className="h-4 w-4 text-white" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-white" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-medium mb-2">Question {index + 1}:</h5>
                                  <p className="text-gray-800 mb-3">{question.question}</p>
                                  
                                  {question.options && (
                                    <div className="space-y-2">
                                      {question.options.map((option: string, optionIndex: number) => {
                                        const isUserChoice = userAnswer === option;
                                        const isCorrectOption = question.correct_answer === option;
                                        
                                        return (
                                          <div
                                            key={optionIndex}
                                            className={`p-2 rounded border text-sm ${
                                              isCorrectOption
                                                ? 'bg-green-100 border-green-300 text-green-800 font-medium'
                                                : isUserChoice && !isCorrectOption
                                                ? 'bg-red-100 border-red-300 text-red-800'
                                                : 'bg-gray-50 border-gray-200 text-gray-700'
                                            }`}
                                          >
                                            <div className="flex items-center gap-2">
                                              {isCorrectOption && (
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                              )}
                                              {isUserChoice && !isCorrectOption && (
                                                <XCircle className="h-4 w-4 text-red-600" />
                                              )}
                                              <span>{option}</span>
                                              {isUserChoice && (
                                                <Badge className="ml-auto text-xs bg-blue-100 text-blue-800 border-blue-200">
                                                  Selected
                                                </Badge>
                                              )}
                                              {isCorrectOption && (
                                                <Badge className="ml-auto text-xs bg-green-100 text-green-800 border-green-200">
                                                  Correct
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                  
                                  {!question.options && userAnswer && (
                                    <div className="mt-2">
                                      <p className="text-sm font-medium">Answer:</p>
                                      <p className="text-gray-700">{userAnswer}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Manual Assignment Content */}
                    {candidate.assignment_template[0].content && (
                      <div className="space-y-4">
                        <h4 className="font-semibold">Assignment Content</h4>
                        <div className="p-4 bg-gray-50 rounded-lg border">
                          <div dangerouslySetInnerHTML={{ __html: candidate.assignment_template[0].content }} />
                        </div>
                      </div>
                    )}

                    {/* Manual Assignment Questions */}
                    {candidate.assignment_template[0].questions && candidate.assignment_template[0].questions.some((q: any) => q.type) && (
                      <div className="space-y-4">
                        <h4 className="font-semibold">Assignment Questions</h4>
                        {candidate.assignment_template[0].questions.map((question: any, index: number) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                            <p className="font-medium mb-2">Question {index + 1}: {question.question}</p>
                            {question.type === 'multiple_choice' && question.options && (
                              <div className="mb-2">
                                <p className="text-sm text-gray-600">Options:</p>
                                <ul className="list-disc list-inside text-sm text-gray-700">
                                  {question.options.map((option: string, optionIndex: number) => (
                                    <li key={optionIndex}>{option}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {candidate.full_assignment_submission?.[0]?.answers?.[index.toString()] && (
                              <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                                <p className="text-sm font-medium text-blue-800">Candidate's Answer:</p>
                                <p className="text-blue-700">{candidate.full_assignment_submission[0].answers[index.toString()]}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {candidate.assignment_feedback && (
                  <div className="space-y-2">
                    <h3 className="font-semibold mb-2">Assignment Feedback</h3>
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-gray-700">{candidate.assignment_feedback}</p>
                    </div>
                  </div>
                )}

                {candidate.full_assignment_submission?.[0] && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Submission Information</h3>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Submitted: {new Date(candidate.full_assignment_submission[0].submission_time).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Badge>
                    </div>
                  </div>
                )}

                {!candidate.assignment_template && !candidate.assignment_feedback && !candidate.full_assignment_submission && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No assignment details available</p>
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
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-800 mb-4">Offer Details</h3>
                      {formatOfferDetails(candidate.offer_details)}
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
