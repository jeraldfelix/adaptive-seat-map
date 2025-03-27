
import { Rocket, Bot, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AIIntegrationProps {
  onInitialize?: () => void;
}

const AIIntegration = ({ onInitialize }: AIIntegrationProps) => {
  const handleTestConnection = () => {
    toast.success('AI features are enabled by default');
    
    if (onInitialize) {
      onInitialize();
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Rocket className="h-5 w-5 mr-2 text-blue-500" />
          AI-Powered Seat Allocation
        </CardTitle>
        <CardDescription>
          Intelligent seat recommendations are automatically enabled
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
            <div className="flex">
              <Info className="h-5 w-5 mr-2" />
              <div>
                <p>AI-powered features:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Team-based seat allocation</li>
                  <li>Historical preference matching</li>
                  <li>Natural language seat requests</li>
                  <li>Predictive booking recommendations</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
            <span className="text-sm font-medium">
              AI Features Enabled
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleTestConnection}>
          <Bot className="h-4 w-4 mr-2" />
          Test AI Features
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIIntegration;
