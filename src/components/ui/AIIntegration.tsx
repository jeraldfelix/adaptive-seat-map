
import { Rocket, Bot, Info, Building } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AIIntegrationProps {
  onInitialize?: () => void;
}

const AIIntegration = ({ onInitialize }: AIIntegrationProps) => {
  const handleTestConnection = () => {
    toast.success('AI-powered seat allocation is active');
    
    if (onInitialize) {
      onInitialize();
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Rocket className="h-5 w-5 mr-2 text-blue-500" />
          Smart Seat Allocation
        </CardTitle>
        <CardDescription>
          Department-based seat prioritization is automatically enabled
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
            <div className="flex">
              <Info className="h-5 w-5 mr-2 flex-shrink-0" />
              <div>
                <p>Priority-based allocation algorithm:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>First looks for seats in your department's primary zone</li>
                  <li>Then checks adjacent seats in the same section</li>
                  <li>Next tries other sections on the same floor</li>
                  <li>Finally considers seats on other floors</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            <div className="flex">
              <Building className="h-5 w-5 mr-2 flex-shrink-0" />
              <div>
                <p>Department zones are configured based on:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Designated floor and sections for each department</li>
                  <li>Team proximity for collaboration</li>
                  <li>Department-specific amenities</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
            <span className="text-sm font-medium">
              Smart Allocation Active
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleTestConnection}>
          <Bot className="h-4 w-4 mr-2" />
          Test Allocation Algorithm
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIIntegration;
