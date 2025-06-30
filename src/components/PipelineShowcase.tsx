
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { GripVertical, CheckCircle, Users, Award, MessageSquare, Trophy } from "lucide-react";

export const PipelineShowcase = () => {
  const pipelineStages = [
    {
      id: 1,
      name: "Application Screening",
      description: "Initial review of applications",
      isMandatory: true,
      icon: CheckCircle,
      color: "bg-red-500"
    },
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Pipeline Stages Configuration
        </h3>
        <p className="text-gray-600">
          Drag and drop to reorder optional stages. Mandatory stages have fixed positions.
        </p>
      </div>

      <div className="space-y-4">
        {pipelineStages.map((stage, index) => {
          const IconComponent = stage.icon;
          
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {!stage.isMandatory && (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical className="h-5 w-5 text-gray-400" />
                    </motion.div>
                  )}
                  <div className={`w-10 h-10 rounded-full ${stage.color} flex items-center justify-center text-white font-semibold`}>
                    {stage.id}
                  </div>
                  <div className={`w-8 h-8 rounded-full ${stage.color} flex items-center justify-center`}>
                    <IconComponent className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{stage.name}</h4>
                    <p className="text-sm text-gray-600">{stage.description}</p>
                  </div>
                </div>
                <Badge 
                  variant={stage.isMandatory ? "destructive" : "secondary"}
                  className={stage.isMandatory ? "bg-red-100 text-red-800 border-red-200" : "bg-blue-100 text-blue-800 border-blue-200"}
                >
                  {stage.isMandatory ? "Mandatory" : "Optional"}
                </Badge>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2 text-blue-800">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Fully Customizable</span>
        </div>
        <p className="text-blue-700 text-sm mt-1">
          Configure your hiring pipeline to match your company's unique process. Add, remove, or reorder stages as needed.
        </p>
      </div>
    </div>
  );
};
