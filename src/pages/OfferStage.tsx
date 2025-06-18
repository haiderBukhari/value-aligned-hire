
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Handshake, DollarSign, Calendar, Clock, FileText, Search, Filter, Plus, 
  CheckCircle, XCircle, AlertTriangle, Send, Download, Edit, Trophy, Gift
} from "lucide-react";

const OfferStage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const offers = [
    {
      id: 1,
      candidate: "Sarah Martinez",
      position: "Senior Developer",
      offerAmount: "$135,000",
      status: "Pending",
      sentDate: "2024-06-07",
      responseDeadline: "2024-06-14",
      benefits: ["Health Insurance", "401k Matching", "Remote Work", "PTO"],
      startDate: "2024-07-01",
      signingBonus: "$10,000",
      equity: "0.5%",
      level: "Senior",
      department: "Engineering"
    },
    {
      id: 2,
      candidate: "David Kim",
      position: "Product Manager",
      offerAmount: "$128,000",
      status: "Accepted",
      sentDate: "2024-06-05",
      responseDeadline: "2024-06-12",
      benefits: ["Health Insurance", "401k Matching", "Flexible Hours", "Learning Budget"],
      startDate: "2024-07-15",
      signingBonus: "$8,000",
      equity: "0.3%",
      level: "Senior",
      department: "Product"
    },
    {
      id: 3,
      candidate: "Emily Chen",
      position: "UX Designer",
      offerAmount: "$95,000",
      status: "Negotiating",
      sentDate: "2024-06-06",
      responseDeadline: "2024-06-13",
      benefits: ["Health Insurance", "Design Tools", "Conference Budget", "PTO"],
      startDate: "2024-07-08",
      signingBonus: "$5,000",
      equity: "0.2%",
      level: "Mid",
      department: "Design"
    },
    {
      id: 4,
      candidate: "Alex Wilson",
      position: "Marketing Manager",
      offerAmount: "$75,000",
      status: "Declined",
      sentDate: "2024-06-03",
      responseDeadline: "2024-06-10",
      benefits: ["Health Insurance", "Marketing Budget", "Flexible Schedule"],
      startDate: "2024-07-22",
      signingBonus: "$3,000",
      equity: "0.1%",
      level: "Mid",
      department: "Marketing"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'accepted': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'negotiating': return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      case 'declined': return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="h-5 w-5" />;
      case 'accepted': return <CheckCircle className="h-5 w-5" />;
      case 'negotiating': return <AlertTriangle className="h-5 w-5" />;
      case 'declined': return <XCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const pendingOffers = offers.filter(offer => offer.status === 'Pending');
  const acceptedOffers = offers.filter(offer => offer.status === 'Accepted');
  const negotiatingOffers = offers.filter(offer => offer.status === 'Negotiating');

  const stats = [
    { 
      label: "Active Offers", 
      value: offers.filter(o => o.status !== 'Declined').length, 
      icon: Handshake, 
      gradient: "from-blue-500 to-indigo-600",
      description: "Currently outstanding offers"
    },
    { 
      label: "Acceptance Rate", 
      value: Math.round((acceptedOffers.length / offers.length) * 100) + "%", 
      icon: Trophy, 
      gradient: "from-green-500 to-emerald-600",
      description: "Overall offer acceptance"
    },
    { 
      label: "Avg Offer", 
      value: "$" + Math.round(offers.reduce((acc, offer) => acc + parseInt(offer.offerAmount.replace(/[^0-9]/g, '')), 0) / offers.length / 1000) + "k", 
      icon: DollarSign, 
      gradient: "from-purple-500 to-pink-600",
      description: "Average salary offered"
    },
    { 
      label: "Time to Accept", 
      value: "4.2 days", 
      icon: Calendar, 
      gradient: "from-orange-500 to-red-600",
      description: "Average response time"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Luxurious Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105 rounded-3xl group">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
            <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${stat.gradient}`}></div>
            <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full`}></div>
            <CardContent className="p-8 relative">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <p className="text-sm font-bold text-gray-600 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-4xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 font-medium">{stat.description}</p>
                </div>
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-xl transform group-hover:rotate-12 transition-transform duration-500`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Premium Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-5 h-6 w-6 text-gray-400" />
          <Input
            placeholder="Search offers, candidates, and negotiations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-14 h-14 border-2 border-gray-200 focus:border-green-500 rounded-3xl text-lg font-medium shadow-lg"
          />
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" className="h-14 px-8 rounded-3xl border-2 border-gray-200 hover:border-green-500 font-semibold text-lg">
            <Filter className="mr-3 h-6 w-6" />
            Filter Offers
          </Button>
          <Button className="h-14 px-8 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-3xl font-semibold text-lg shadow-xl">
            <Plus className="mr-3 h-6 w-6" />
            Create New Offer
          </Button>
        </div>
      </div>

      {/* Offer Management Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-2 rounded-2xl h-14">
          <TabsTrigger value="all" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg font-semibold text-lg">
            All Offers ({offers.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg font-semibold text-lg">
            Pending ({pendingOffers.length})
          </TabsTrigger>
          <TabsTrigger value="negotiating" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg font-semibold text-lg">
            Negotiating ({negotiatingOffers.length})
          </TabsTrigger>
          <TabsTrigger value="accepted" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg font-semibold text-lg">
            Accepted ({acceptedOffers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-6">
            {offers.map((offer) => (
              <Card key={offer.id} className="border-2 border-gray-100 hover:border-green-300 transition-all duration-300 rounded-3xl overflow-hidden hover:shadow-2xl">
                <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 p-2">
                  <div className="bg-white rounded-2xl">
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start space-x-6">
                          <div className="relative">
                            <Avatar className="h-16 w-16 ring-4 ring-green-200 shadow-lg">
                              <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-xl">
                                {offer.candidate.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <Gift className="absolute -bottom-1 -right-1 h-6 w-6 text-green-500 bg-white rounded-full p-1" />
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900">{offer.candidate}</h3>
                              <p className="text-lg text-gray-600 font-semibold">{offer.position}</p>
                              <p className="text-sm text-gray-500">{offer.department} • {offer.level} Level</p>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                                <p className="text-2xl font-black text-green-600">{offer.offerAmount}</p>
                                <p className="text-xs text-green-700 font-semibold">Base Salary</p>
                              </div>
                              <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                                <p className="text-lg font-bold text-blue-600">{offer.signingBonus}</p>
                                <p className="text-xs text-blue-700 font-semibold">Signing Bonus</p>
                              </div>
                              <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
                                <p className="text-lg font-bold text-purple-600">{offer.equity}</p>
                                <p className="text-xs text-purple-700 font-semibold">Equity</p>
                              </div>
                              <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
                                <p className="text-lg font-bold text-orange-600">{offer.startDate}</p>
                                <p className="text-xs text-orange-700 font-semibold">Start Date</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-3">
                          <Badge className={`${getStatusColor(offer.status)} px-4 py-2 text-sm font-bold rounded-xl shadow-lg flex items-center space-x-2`}>
                            {getStatusIcon(offer.status)}
                            <span>{offer.status}</span>
                          </Badge>
                          <div className="text-sm text-gray-600">
                            <p><span className="font-semibold">Sent:</span> {offer.sentDate}</p>
                            <p><span className="font-semibold">Deadline:</span> {offer.responseDeadline}</p>
                            {offer.status === 'Pending' && (
                              <p className="font-bold text-orange-600">
                                {getDaysRemaining(offer.responseDeadline)} days left
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <Gift className="h-4 w-4 mr-2 text-green-600" />
                            Benefits Package
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {offer.benefits.map((benefit, index) => (
                              <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-full font-medium">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm font-semibold text-gray-700">Offer Value:</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={75} className="w-24 h-3" />
                              <span className="text-sm font-bold text-green-600">Competitive</span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-3">
                            <Button variant="outline" size="sm" className="rounded-xl border-2 border-gray-200 hover:border-blue-400">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-xl border-2 border-gray-200 hover:border-yellow-400">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl">
                              <Send className="h-4 w-4 mr-2" />
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

        <TabsContent value="pending">
          <div className="space-y-6">
            {pendingOffers.map((offer) => (
              <Card key={offer.id} className="border-2 border-yellow-200 rounded-3xl shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-yellow-500 text-white font-semibold">
                          {offer.candidate.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-lg">{offer.candidate}</h4>
                        <p className="text-gray-600">{offer.position}</p>
                        <p className="text-sm text-yellow-600 font-semibold">
                          {getDaysRemaining(offer.responseDeadline)} days remaining
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{offer.offerAmount}</p>
                      <Badge className="bg-yellow-500 text-white">Awaiting Response</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="negotiating">
          <div className="space-y-6">
            {negotiatingOffers.map((offer) => (
              <Card key={offer.id} className="border-2 border-blue-200 rounded-3xl shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-500 text-white font-semibold">
                          {offer.candidate.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-lg">{offer.candidate}</h4>
                        <p className="text-gray-600">{offer.position}</p>
                        <p className="text-sm text-blue-600 font-semibold">In negotiation phase</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{offer.offerAmount}</p>
                      <Badge className="bg-blue-500 text-white">Negotiating</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="accepted">
          <div className="space-y-6">
            {acceptedOffers.map((offer) => (
              <Card key={offer.id} className="border-2 border-green-200 rounded-3xl shadow-lg bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 ring-2 ring-green-400">
                        <AvatarFallback className="bg-green-500 text-white font-semibold">
                          {offer.candidate.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-lg">{offer.candidate}</h4>
                        <p className="text-gray-600">{offer.position}</p>
                        <p className="text-sm text-green-600 font-semibold">
                          Starts {offer.startDate}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{offer.offerAmount}</p>
                      <Badge className="bg-green-500 text-white">Accepted</Badge>
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
