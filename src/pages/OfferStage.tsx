
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Handshake, DollarSign, Calendar, Clock, FileText, Search, Filter, Plus, 
  CheckCircle, XCircle, AlertTriangle, Send, Download, Edit, Trophy, Gift,
  Star, TrendingUp, Users, Target, Briefcase, MapPin, Phone, Mail, 
  GraduationCap, Award, Sparkles, Crown, Zap
} from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  job_title: string;
  location: string;
  experience_years: number;
  education: string;
  skills: string[];
  photo_url?: string;
  offer_details?: {
    base_salary: number;
    signing_bonus: number;
    equity_percentage: number;
    start_date: string;
    benefits: string[];
    status: 'pending' | 'accepted' | 'declined' | 'negotiating';
    sent_date: string;
    response_deadline: string;
  };
  total_weighted_score?: number;
  assessment_score?: number;
}

const OfferStage = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [offerForm, setOfferForm] = useState({
    base_salary: '',
    signing_bonus: '',
    equity_percentage: '',
    start_date: '',
    benefits: '',
    response_deadline: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchOfferCandidates();
  }, []);

  const fetchOfferCandidates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/offers/candidates', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCandidates(data.candidates || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch candidates",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast({
        title: "Error", 
        description: "Failed to load candidates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const makeOffer = async () => {
    if (!selectedCandidate) return;
    
    try {
      const token = localStorage.getItem('token');
      const offerDetails = {
        base_salary: parseInt(offerForm.base_salary),
        signing_bonus: parseInt(offerForm.signing_bonus),
        equity_percentage: parseFloat(offerForm.equity_percentage),
        start_date: offerForm.start_date,
        benefits: offerForm.benefits.split(',').map(b => b.trim()),
        status: 'pending',
        sent_date: new Date().toISOString().split('T')[0],
        response_deadline: offerForm.response_deadline
      };

      const response = await fetch('/offers/make', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          resume_id: selectedCandidate.id,
          offer_details: offerDetails
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Offer created successfully!"
        });
        fetchOfferCandidates();
        setSelectedCandidate(null);
        setOfferForm({
          base_salary: '',
          signing_bonus: '',
          equity_percentage: '',
          start_date: '',
          benefits: '',
          response_deadline: ''
        });
      }
    } catch (error) {
      console.error('Error making offer:', error);
      toast({
        title: "Error",
        description: "Failed to create offer",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg';
      case 'accepted': return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg';
      case 'negotiating': return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg';
      case 'declined': return 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg';
      default: return 'bg-gradient-to-r from-slate-500 to-gray-600 text-white shadow-lg';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'negotiating': return <AlertTriangle className="h-4 w-4" />;
      case 'declined': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getDaysRemaining = (deadline?: string) => {
    if (!deadline) return 0;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingOffers = filteredCandidates.filter(c => c.offer_details?.status === 'pending');
  const acceptedOffers = filteredCandidates.filter(c => c.offer_details?.status === 'accepted');
  const negotiatingOffers = filteredCandidates.filter(c => c.offer_details?.status === 'negotiating');
  const noOfferCandidates = filteredCandidates.filter(c => !c.offer_details);

  const stats = [
    { 
      label: "Ready for Offers", 
      value: noOfferCandidates.length, 
      icon: Target, 
      gradient: "from-purple-500 to-violet-600",
      description: "Qualified candidates awaiting offers"
    },
    { 
      label: "Active Offers", 
      value: pendingOffers.length, 
      icon: Handshake, 
      gradient: "from-amber-500 to-orange-600",
      description: "Outstanding offers pending response"
    },
    { 
      label: "Acceptance Rate", 
      value: candidates.length > 0 ? Math.round((acceptedOffers.length / Math.max(1, pendingOffers.length + acceptedOffers.length + filteredCandidates.filter(c => c.offer_details?.status === 'declined').length)) * 100) + "%" : "0%", 
      icon: Trophy, 
      gradient: "from-emerald-500 to-green-600",
      description: "Offer acceptance success rate"
    },
    { 
      label: "Avg Offer Value", 
      value: acceptedOffers.length > 0 ? "$" + Math.round(acceptedOffers.reduce((acc, c) => acc + (c.offer_details?.base_salary || 0), 0) / acceptedOffers.length / 1000) + "k" : "$0k", 
      icon: DollarSign, 
      gradient: "from-blue-500 to-cyan-600",
      description: "Average accepted offer amount"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Crown className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Offer Management</h1>
              <p className="text-lg text-white/90">Close the deal with top talent</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <stat.icon className="h-6 w-6" />
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-white/80">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search candidates, positions, skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 border-2 border-gray-200 focus:border-indigo-500 rounded-2xl text-base shadow-sm"
          />
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="h-12 px-6 rounded-2xl border-2 border-gray-200 hover:border-indigo-500">
            <Filter className="mr-2 h-5 w-5" />
            Filter
          </Button>
        </div>
      </div>

      {/* Offer Management Tabs */}
      <Tabs defaultValue="no-offer" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-2 rounded-2xl h-14">
          <TabsTrigger value="no-offer" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg font-semibold">
            Ready ({noOfferCandidates.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg font-semibold">
            Pending ({pendingOffers.length})
          </TabsTrigger>
          <TabsTrigger value="negotiating" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg font-semibold">
            Negotiating ({negotiatingOffers.length})
          </TabsTrigger>
          <TabsTrigger value="accepted" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg font-semibold">
            Accepted ({acceptedOffers.length})
          </TabsTrigger>
        </TabsList>

        {/* Ready for Offers Tab */}
        <TabsContent value="no-offer">
          <div className="grid gap-6">
            {noOfferCandidates.map((candidate) => (
              <Card key={candidate.id} className="border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 rounded-3xl overflow-hidden hover:shadow-xl group">
                <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 p-1">
                  <div className="bg-white rounded-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-6">
                          <div className="relative">
                            <Avatar className="h-20 w-20 ring-4 ring-purple-200 shadow-lg">
                              <AvatarImage src={candidate.photo_url} />
                              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xl">
                                {candidate.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-purple-500 rounded-full flex items-center justify-center">
                              <Star className="h-3 w-3 text-white" />
                            </div>
                          </div>
                          
                          <div className="space-y-3 flex-1">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900">{candidate.name}</h3>
                              <p className="text-lg text-gray-600 font-semibold">{candidate.position}</p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Mail className="h-4 w-4" />
                                  <span>{candidate.email}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{candidate.location}</span>
                                </div>
                                {candidate.experience_years && (
                                  <div className="flex items-center space-x-1">
                                    <Briefcase className="h-4 w-4" />
                                    <span>{candidate.experience_years} years</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {candidate.assessment_score && (
                                <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                                  <p className="text-lg font-bold text-green-600">{candidate.assessment_score}/100</p>
                                  <p className="text-xs text-green-700 font-semibold">Assessment Score</p>
                                </div>
                              )}
                              {candidate.total_weighted_score && (
                                <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                                  <p className="text-lg font-bold text-blue-600">{candidate.total_weighted_score}/100</p>
                                  <p className="text-xs text-blue-700 font-semibold">Overall Score</p>
                                </div>
                              )}
                              <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
                                <p className="text-lg font-bold text-purple-600">Ready</p>
                                <p className="text-xs text-purple-700 font-semibold">Status</p>
                              </div>
                            </div>

                            {candidate.skills && candidate.skills.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                  <Zap className="h-4 w-4 mr-2 text-purple-600" />
                                  Skills
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {candidate.skills.slice(0, 6).map((skill, index) => (
                                    <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800 border border-purple-200 px-3 py-1 rounded-full">
                                      {skill}
                                    </Badge>
                                  ))}
                                  {candidate.skills.length > 6 && (
                                    <Badge variant="secondary" className="bg-gray-100 text-gray-600 border border-gray-200 px-3 py-1 rounded-full">
                                      +{candidate.skills.length - 6} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right space-y-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-2xl px-6 py-3 font-semibold shadow-lg"
                                onClick={() => setSelectedCandidate(candidate)}
                              >
                                <Gift className="h-4 w-4 mr-2" />
                                Make Offer
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] rounded-3xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center space-x-2">
                                  <Gift className="h-5 w-5 text-purple-600" />
                                  <span>Create Offer for {selectedCandidate?.name}</span>
                                </DialogTitle>
                                <DialogDescription>
                                  Craft a competitive offer package for this top candidate.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="base_salary">Base Salary ($)</Label>
                                    <Input
                                      id="base_salary"
                                      value={offerForm.base_salary}
                                      onChange={(e) => setOfferForm({...offerForm, base_salary: e.target.value})}
                                      placeholder="120000"
                                      className="rounded-xl"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="signing_bonus">Signing Bonus ($)</Label>
                                    <Input
                                      id="signing_bonus"
                                      value={offerForm.signing_bonus}
                                      onChange={(e) => setOfferForm({...offerForm, signing_bonus: e.target.value})}
                                      placeholder="10000"
                                      className="rounded-xl"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="equity">Equity (%)</Label>
                                    <Input
                                      id="equity"
                                      value={offerForm.equity_percentage}
                                      onChange={(e) => setOfferForm({...offerForm, equity_percentage: e.target.value})}
                                      placeholder="0.5"
                                      className="rounded-xl"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="start_date">Start Date</Label>
                                    <Input
                                      id="start_date"
                                      type="date"
                                      value={offerForm.start_date}
                                      onChange={(e) => setOfferForm({...offerForm, start_date: e.target.value})}
                                      className="rounded-xl"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="response_deadline">Response Deadline</Label>
                                  <Input
                                    id="response_deadline"
                                    type="date"
                                    value={offerForm.response_deadline}
                                    onChange={(e) => setOfferForm({...offerForm, response_deadline: e.target.value})}
                                    className="rounded-xl"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="benefits">Benefits (comma-separated)</Label>
                                  <Textarea
                                    id="benefits"
                                    value={offerForm.benefits}
                                    onChange={(e) => setOfferForm({...offerForm, benefits: e.target.value})}
                                    placeholder="Health Insurance, 401k Matching, Remote Work, PTO"
                                    className="rounded-xl"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button 
                                  onClick={makeOffer}
                                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-xl px-6"
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  Send Offer
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pending Offers Tab */}
        <TabsContent value="pending">
          <div className="grid gap-6">
            {pendingOffers.map((candidate) => (
              <Card key={candidate.id} className="border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 rounded-3xl overflow-hidden hover:shadow-xl">
                <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 p-1">
                  <div className="bg-white rounded-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-6">
                          <div className="relative">
                            <Avatar className="h-16 w-16 ring-4 ring-amber-200 shadow-lg">
                              <AvatarImage src={candidate.photo_url} />
                              <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold">
                                {candidate.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-amber-500 rounded-full flex items-center justify-center">
                              <Clock className="h-3 w-3 text-white" />
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                              <p className="text-gray-600 font-semibold">{candidate.position}</p>
                              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                <span>{candidate.email}</span>
                                <span>•</span>
                                <span>{candidate.location}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                              <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                                <p className="text-xl font-bold text-green-600">${candidate.offer_details?.base_salary?.toLocaleString()}</p>
                                <p className="text-xs text-green-700 font-semibold">Base Salary</p>
                              </div>
                              <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                                <p className="text-lg font-bold text-blue-600">${candidate.offer_details?.signing_bonus?.toLocaleString()}</p>
                                <p className="text-xs text-blue-700 font-semibold">Signing Bonus</p>
                              </div>
                              <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
                                <p className="text-lg font-bold text-purple-600">{candidate.offer_details?.equity_percentage}%</p>
                                <p className="text-xs text-purple-700 font-semibold">Equity</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-3">
                          <Badge className={getStatusColor(candidate.offer_details?.status)}>
                            {getStatusIcon(candidate.offer_details?.status)}
                            <span className="ml-2">{candidate.offer_details?.status?.toUpperCase()}</span>
                          </Badge>
                          <div className="text-sm text-gray-600">
                            <p><span className="font-semibold">Sent:</span> {candidate.offer_details?.sent_date}</p>
                            <p><span className="font-semibold">Deadline:</span> {candidate.offer_details?.response_deadline}</p>
                            <p className="font-bold text-amber-600">
                              {getDaysRemaining(candidate.offer_details?.response_deadline)} days left
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="rounded-xl">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl">
                              <Send className="h-4 w-4 mr-1" />
                              Follow Up
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Negotiating Tab */}
        <TabsContent value="negotiating">
          <div className="grid gap-6">
            {negotiatingOffers.map((candidate) => (
              <Card key={candidate.id} className="border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 rounded-3xl overflow-hidden hover:shadow-xl">
                <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-1">
                  <div className="bg-white rounded-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-14 w-14 ring-4 ring-blue-200">
                            <AvatarImage src={candidate.photo_url} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold">
                              {candidate.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-bold text-lg">{candidate.name}</h4>
                            <p className="text-gray-600">{candidate.position}</p>
                            <p className="text-sm text-blue-600 font-semibold">In active negotiation</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">${candidate.offer_details?.base_salary?.toLocaleString()}</p>
                          <Badge className="bg-blue-500 text-white">Negotiating</Badge>
                          <div className="mt-2 flex space-x-2">
                            <Button size="sm" variant="outline" className="rounded-xl">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Counter
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Accepted Tab */}
        <TabsContent value="accepted">
          <div className="grid gap-6">
            {acceptedOffers.map((candidate) => (
              <Card key={candidate.id} className="border-2 border-green-200 hover:border-green-400 transition-all duration-300 rounded-3xl overflow-hidden hover:shadow-xl bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="h-14 w-14 ring-4 ring-green-300">
                          <AvatarImage src={candidate.photo_url} />
                          <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{candidate.name}</h4>
                        <p className="text-gray-600">{candidate.position}</p>
                        <p className="text-sm text-green-600 font-semibold">
                          Starts {candidate.offer_details?.start_date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">${candidate.offer_details?.base_salary?.toLocaleString()}</p>
                      <Badge className="bg-green-500 text-white mb-2">Accepted</Badge>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="rounded-xl">
                          <FileText className="h-4 w-4 mr-1" />
                          Contract
                        </Button>
                        <Button size="sm" className="bg-green-500 hover:bg-green-600 rounded-xl">
                          <Users className="h-4 w-4 mr-1" />
                          Onboard
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OfferStage;
