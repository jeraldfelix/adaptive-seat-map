
import { useState } from 'react';
import { Rocket, Bot, Key, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { toast } from 'sonner';

interface AIIntegrationProps {
  onInitialize?: () => void;
}

const AIIntegration = ({ onInitialize }: AIIntegrationProps) => {
  const [apiKey, setApiKey] = useLocalStorage<string | null>('mistral-api-key', null);
  const [inputKey, setInputKey] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);
  
  const handleSaveApiKey = () => {
    if (!inputKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    setApiKey(inputKey);
    setIsConfiguring(false);
    toast.success('Mistral API key saved!');
    
    if (onInitialize) {
      onInitialize();
    }
  };
  
  const handleRemoveApiKey = () => {
    setApiKey(null);
    setInputKey('');
    toast('API key removed');
  };
  
  if (isConfiguring) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Bot className="h-5 w-5 mr-2 text-blue-500" />
            Configure Mistral AI
          </CardTitle>
          <CardDescription>
            Add your Mistral AI API key to enable intelligent seat allocation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">Mistral API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your Mistral API key"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setIsConfiguring(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveApiKey}>
            Save API Key
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Rocket className="h-5 w-5 mr-2 text-blue-500" />
          AI-Powered Seat Allocation
        </CardTitle>
        <CardDescription>
          {apiKey 
            ? 'Mistral AI is configured and ready to optimize your seat allocation'
            : 'Add your Mistral API key to enable intelligent seat recommendations'}
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
              {apiKey ? 'Mistral AI Connected' : 'Not Connected'}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {apiKey ? (
          <div className="w-full flex justify-between">
            <Button variant="outline" size="sm" onClick={handleRemoveApiKey}>
              <Key className="h-4 w-4 mr-2" />
              Remove API Key
            </Button>
            <Button size="sm">
              <Bot className="h-4 w-4 mr-2" />
              Test Connection
            </Button>
          </div>
        ) : (
          <Button className="w-full" onClick={() => setIsConfiguring(true)}>
            <Key className="h-4 w-4 mr-2" />
            Configure Mistral AI
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AIIntegration;
