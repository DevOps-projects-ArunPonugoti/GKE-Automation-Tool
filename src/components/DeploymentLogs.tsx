import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2, XCircle, Loader2, Terminal, GitBranch, Cloud, Server } from 'lucide-react';
import clsx from 'clsx';

interface Step {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  logs: string[];
  startTime?: Date;
  endTime?: Date;
  icon?: React.ReactNode;
}

interface DeploymentLogsProps {
  steps: Step[];
  isVisible: boolean;
}

export function DeploymentLogs({ steps, isVisible }: DeploymentLogsProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (stepId: string) => {
    const newExpandedSteps = new Set(expandedSteps);
    if (expandedSteps.has(stepId)) {
      newExpandedSteps.delete(stepId);
    } else {
      newExpandedSteps.add(stepId);
    }
    setExpandedSteps(newExpandedSteps);
  };

  if (!isVisible) return null;

  const getStepIcon = (status: Step['status'], defaultIcon?: React.ReactNode) => {
    const iconClass = "h-5 w-5";
    
    switch (status) {
      case 'completed':
        return <CheckCircle2 className={`${iconClass} text-green-500 transition-all duration-300 ease-in-out`} />;
      case 'failed':
        return <XCircle className={`${iconClass} text-red-500 transition-all duration-300 ease-in-out`} />;
      case 'running':
        return (
          <div className="relative">
            <div className="absolute inset-0 h-5 w-5 animate-ping rounded-full bg-blue-400 opacity-75"></div>
            <Loader2 className={`${iconClass} text-blue-500 animate-spin`} />
          </div>
        );
      default:
        return defaultIcon || <div className={`${iconClass} rounded-full border-2 border-gray-300`} />;
    }
  };

  const getDuration = (step: Step) => {
    if (!step.startTime) return '';
    const endTime = step.endTime || new Date();
    const duration = Math.round((endTime.getTime() - step.startTime.getTime()) / 1000);
    return `${duration}s`;
  };

  const getProgressLine = (index: number) => {
    if (index === steps.length - 1) return null;

    const currentStep = steps[index];
    const nextStep = steps[index + 1];
    
    return (
      <div 
        className={clsx(
          "absolute left-6 ml-[7px] w-[2px] h-full -bottom-4",
          "transition-all duration-500",
          currentStep.status === 'completed' ? 'bg-green-500' :
          currentStep.status === 'running' ? 'bg-gradient-to-b from-blue-500 to-gray-300' :
          'bg-gray-300'
        )}
      />
    );
  };

  return (
    <div className="mt-8 bg-gray-900 rounded-lg overflow-hidden transition-all duration-500 ease-in-out">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Terminal className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-white">Deployment Logs</h3>
        </div>
      </div>
      <div className="p-4 space-y-6">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {getProgressLine(index)}
            <div className="space-y-2">
              <button
                onClick={() => toggleStep(step.id)}
                className={clsx(
                  'w-full flex items-center justify-between p-4 rounded-lg',
                  'bg-gray-800 hover:bg-gray-700 transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  step.status === 'running' && 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20'
                )}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {getStepIcon(step.status, step.icon)}
                  </div>
                  <div>
                    <span className={clsx(
                      'font-medium',
                      step.status === 'completed' && 'text-green-400',
                      step.status === 'running' && 'text-blue-400',
                      step.status === 'failed' && 'text-red-400',
                      step.status === 'pending' && 'text-gray-400'
                    )}>
                      {step.title}
                    </span>
                    {step.startTime && (
                      <div className="text-gray-500 text-sm mt-1">
                        Duration: {getDuration(step)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {step.status === 'running' && (
                    <span className="text-blue-400 text-sm animate-pulse mr-2">
                      In Progress
                    </span>
                  )}
                  {expandedSteps.has(step.id) ? (
                    <ChevronDown className="h-5 w-5 text-gray-400 transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400 transition-transform duration-200" />
                  )}
                </div>
              </button>
              
              {expandedSteps.has(step.id) && step.logs.length > 0 && (
                <div className="pl-14 pr-4 py-3 space-y-2">
                  <div className={clsx(
                    'rounded-lg overflow-hidden transition-all duration-500 ease-in-out',
                    'bg-gray-950 border border-gray-800'
                  )}>
                    <pre className="text-sm font-mono p-4 overflow-x-auto">
                      {step.logs.map((log, index) => (
                        <div
                          key={index}
                          className={clsx(
                            'py-1 transition-all duration-300',
                            step.status === 'running' && index === step.logs.length - 1 
                              ? 'text-blue-400 animate-pulse'
                              : 'text-gray-300'
                          )}
                        >
                          {log}
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}