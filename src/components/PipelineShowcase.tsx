
import { motion, Reorder } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GripVertical, CheckCircle, Users, Award, MessageSquare, Trophy, X } from "lucide-react";
import { useState } from "react";

export const PipelineShowcase = () => {
  const mandatoryStages = [
    {
      id: 1,
      name: "Application Screening",
      description: "Initial review of applications",
      isMandatory: true,
      icon: CheckCircle,
      color: "bg-red-500"
    },
    {
      id: 5,
      name: "Final Interview",
      description: "Final decision interview",
      isMandatory: true,
      icon: Trophy,
      color: "bg-orange-500"
    },
    {
      id: 6,
      name: "Offer Stage",
      description: "Extending and negotiating offers",
      isMandatory: true,
      icon: CheckCircle,
      color: "bg-green-600"
    }
  ];

  const [optionalStages, setOptionalStages] = useState([
    {
      id: 2,
      name: "Assessment",
      description: "Technical or skills assessment",
      isMandatory: false,
      icon: Award,
      color: "bg-blue-500"
    },
    {
      id: 3,
      name: "Initial Interview",
      description: "First round interview",
      isMandatory: false,
      icon: MessageSquare,
      color: "bg-green-500"
    },
    {
      id: 4,
      name: "Secondary Interview",
      description: "Second round interview",
      isMandatory: false,
      icon: Users,
      color: "bg-purple-500"
    }
  ]);

  const removeOptionalStage = (stageId: number) => {
    setOptionalStages(prev => prev.filter(stage => stage.id !== stageId));
  };

  const allStages = [
    mandatoryStages[0],
    ...optionalStages,
    mandatoryStages[1],
    mandatoryStages[2]
  ];

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 max-w-4xl mx-auto border border-gray-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h3 className="text-3xl font-bold text-gray-900 mb-3">
          Pipeline Stages Configuration
        </h3>
        <p className="text-gray-600 text-lg">
          Drag and drop to reorder optional stages. Mandatory stages have fixed positions.
        </p>
      </motion.div>

      <div className="space-y-4">
        {/* First mandatory stage */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-red-50 border-2 border-red-200 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                1
              </div>
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Application Screening</h4>
                <p className="text-sm text-gray-600">Initial review of applications</p>
              </div>
            </div>
            <Badge className="bg-red-100 text-red-800 border-red-200 font-medium">
              Mandatory
            </Badge>
          </div>
        </motion.div>

        {/* Reorderable optional stages */}
        <Reorder.Group axis="y" values={optionalStages} onReorder={setOptionalStages}>
          {optionalStages.map((stage, index) => {
            const IconComponent = stage.icon;
            
            return (
              <Reorder.Item
                key={stage.id}
                value={stage}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
                className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 cursor-grab active:cursor-grabbing shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical className="h-5 w-5 text-gray-400" />
                    </motion.div>
                    <div className={`w-10 h-10 rounded-full ${stage.color} flex items-center justify-center text-white font-bold`}>
                      {index + 2}
                    </div>
                    <div className={`w-8 h-8 rounded-full ${stage.color} flex items-center justify-center`}>
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{stage.name}</h4>
                      <p className="text-sm text-gray-600">{stage.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-medium">
                      Optional
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOptionalStage(stage.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>

        {/* Remaining mandatory stages */}
        {mandatoryStages.slice(1).map((stage, index) => {
          const IconComponent = stage.icon;
          const stageNumber = optionalStages.length + index + 2;
          
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: (optionalStages.length + index + 1) * 0.1 }}
              viewport={{ once: true }}
              className="bg-red-50 border-2 border-red-200 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full ${stage.color} flex items-center justify-center text-white font-bold`}>
                    {stageNumber}
                  </div>
                  <div className={`w-8 h-8 rounded-full ${stage.color} flex items-center justify-center`}>
                    <IconComponent className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{stage.name}</h4>
                    <p className="text-sm text-gray-600">{stage.description}</p>
                  </div>
                </div>
                <Badge className="bg-red-100 text-red-800 border-red-200 font-medium">
                  Mandatory
                </Badge>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        viewport={{ once: true }}
        className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
      >
        <div className="flex items-center space-x-2 text-blue-800 mb-2">
          <CheckCircle className="h-5 w-5" />
          <span className="font-semibold text-lg">Fully Customizable Pipeline</span>
        </div>
        <p className="text-blue-700 leading-relaxed">
          Configure your hiring pipeline to match your company's unique process. Add, remove, or reorder stages as needed. 
          Our AI analyzes candidate performance at each stage with 100% accuracy.
        </p>
      </motion.div>
    </div>
  );
};
