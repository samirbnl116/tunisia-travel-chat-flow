import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, MapPin, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "Welcome! I'm your personal Tunisia travel assistant. Please tell me about your travel plans - include your name, places you'd like to visit, dates, and contact information. I'll help you plan the perfect journey!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Forward to n8n webhook if URL is provided
    if (webhookUrl.trim()) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: inputMessage,
            timestamp: new Date().toISOString(),
            source: "tunisia-travel-chat",
          }),
        });

        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: "Thank you! I've received your travel request and forwarded it to our team. We'll contact you shortly with a personalized itinerary and guide recommendations for your Tunisia adventure!",
          isUser: false,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botResponse]);
        toast({
          title: "Message sent successfully!",
          description: "Your travel request has been forwarded to our team.",
        });
      } catch (error) {
        console.error("Error sending to webhook:", error);
        toast({
          title: "Error",
          description: "Failed to send your message. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Simulate response when no webhook URL is provided
      setTimeout(() => {
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: "I've received your travel request! To complete the process, please configure the n8n webhook URL. Once configured, your requests will be automatically forwarded to the travel planning system.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }

    setInputMessage("");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-chat-bg">
      {/* Header */}
      <div className="bg-gradient-hero shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-white hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Homepage</span>
          </Link>
          
          <div className="flex items-center space-x-2 text-white">
            <MapPin className="w-5 h-5" />
            <span className="font-semibold">Tunisia Travel Assistant</span>
          </div>
        </div>
      </div>

      {/* Webhook Configuration */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <Card className="p-4 mb-4 bg-accent/10 border-accent/20">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            <span className="font-medium text-sm">n8n Webhook Configuration</span>
          </div>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter your n8n webhook URL here..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast({ title: "URL saved", description: "Webhook URL has been configured." })}
            >
              Save
            </Button>
          </div>
        </Card>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 pb-4">
        <Card className="h-[calc(100vh-200px)] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Tell me about your travel plans (name, places, dates, contact info)..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !inputMessage.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2">
              Example: "Hi, I'm John. I want to visit Mahdia and Monastir on 20/07/2025. We want a tourist guide from 9am to 5pm. My phone number is 25365475 and my email is john@example.com."
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;