import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Briefcase, ListChecks } from "lucide-react";

const dummyInterview = {
  date: "2024-07-10",
  time: "10:00 AM",
  candidate: "Sarah Johnson",
  role: "Frontend Developer",
  questions: [
    "Tell us about a challenging project you worked on.",
    "How do you approach code reviews?",
    "Describe your experience with React and TypeScript.",
    "How do you handle tight deadlines?"
  ]
};

const dummyResume = {
  applicant_name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  cv_link: "https://example.com/cv.pdf",
  coverletter_link: "https://example.com/cover.pdf",
  company_fit_score: 92,
  culture_score: 88,
  experience_score: 90,
  skill_score: 95,
  total_weighted_score: 91,
  final_recommendation: "Strong Match",
  level_suggestion: "Senior",
  evaluated: true,
  created_at: "2024-06-15",
  experience_facts: [
    "5 years at TechCorp as Senior Frontend Developer",
    "Led migration to React/TypeScript stack",
    "Mentored 3 junior developers"
  ],
  skill_reason: "- **Positive Matches:** React, TypeScript, Node.js\n- **Potential Matches:** GraphQL, Next.js\n- **Areas for Further Exploration:** Testing, CI/CD"
};

const ScheduledInterviewJobDetails = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Top: Scheduled Interview Info */}
      <div className="max-w-5xl mx-auto mb-8">
        <Card className="shadow-lg border-0">
          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6">
            <div className="flex items-center gap-4">
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-lg font-semibold">
                <Calendar className="inline-block mr-2 h-5 w-5" />
                {dummyInterview.date} {dummyInterview.time}
              </Badge>
              <Badge className="bg-green-100 text-green-800 px-4 py-2 text-lg font-semibold">
                <User className="inline-block mr-2 h-5 w-5" />
                {dummyInterview.candidate}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-lg font-semibold">
                <Briefcase className="inline-block mr-2 h-5 w-5" />
                {dummyInterview.role}
              </Badge>
            </div>
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* Main Content: Left (Resume), Right (Questions) */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Resume Details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Resume Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-xl font-semibold text-gray-900">{dummyResume.applicant_name}</div>
                <div className="text-gray-500">{dummyResume.email}</div>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-green-100 text-green-800">{dummyResume.final_recommendation}</Badge>
                <Badge className="bg-purple-100 text-purple-800">{dummyResume.level_suggestion} Level</Badge>
              </div>
              <div className="mt-4">
                <div className="font-semibold text-gray-700">Company Fit: <span className="text-gray-900">{dummyResume.company_fit_score}%</span></div>
                <div className="font-semibold text-gray-700">Culture Fit: <span className="text-gray-900">{dummyResume.culture_score}%</span></div>
                <div className="font-semibold text-gray-700">Experience: <span className="text-gray-900">{dummyResume.experience_score}%</span></div>
                <div className="font-semibold text-gray-700">Skills: <span className="text-gray-900">{dummyResume.skill_score}%</span></div>
                <div className="font-semibold text-gray-700 mt-2">Overall Score: <span className="text-2xl text-blue-700 font-bold">{dummyResume.total_weighted_score}%</span></div>
              </div>
              <div className="mt-4">
                <div className="font-semibold text-gray-700 mb-2">Key Experience Highlights:</div>
                <ul className="list-disc pl-6 text-gray-700">
                  {dummyResume.experience_facts.map((fact, i) => (
                    <li key={i}>{fact}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <div className="font-semibold text-gray-700 mb-2">Skills:</div>
                <pre className="bg-gray-100 rounded p-3 text-sm text-gray-800 whitespace-pre-wrap">{dummyResume.skill_reason}</pre>
              </div>
              <div className="mt-4 flex gap-4">
                <a href={dummyResume.cv_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View CV</a>
                <a href={dummyResume.coverletter_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Cover Letter</a>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Right: Interview Questions */}
        <div className="space-y-6">
          <Card className="shadow border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <ListChecks className="h-6 w-6 text-blue-600" /> Interview Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal pl-6 text-gray-800 space-y-2">
                {dummyInterview.questions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScheduledInterviewJobDetails; 