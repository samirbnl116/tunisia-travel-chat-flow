import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      content: "Hi! What's your name?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const webhookUrl = "https://gorgeous-egret-smart.ngrok-free.app/webhook-test/3a31f0b7-ba10-4d4d-b72b-9d5c55399889";
  const chatId = "0c066edc-af1b-4927-9cc1-79238b3b8938";
  const { toast } = useToast();

  // Poll Supabase for new messages every few seconds
  useEffect(() => {
    const pollMessages = async () => {
      try {
        // Note: This assumes chat_messages table has the structure as defined
        // You may need to add a chat_id column to filter by specific chatId
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error polling messages:', error);
          return;
        }

        if (data && data.length > 0) {
          const latestMessage = data[0];
          const lastMessageId = messages[messages.length - 1]?.id;
          
          // Only add if it's a new message and not from user
          if (latestMessage.id !== lastMessageId && latestMessage.source === 'n8n') {
            const newMessage: ChatMessage = {
              id: latestMessage.id,
              content: latestMessage.message,
              isUser: false,
              timestamp: new Date(latestMessage.created_at),
            };
            
            setMessages(prev => [...prev, newMessage]);
            
            toast({
              title: "New message received",
              description: "You have a new message from our travel team.",
            });
          }
        }
      } catch (error) {
        console.error('Error polling messages:', error);
      }
    };

    const interval = setInterval(pollMessages, 3000); // Poll every 3 seconds

    return () => {
      clearInterval(interval);
    };
  }, [messages, toast]);

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

    // Forward to n8n webhook with new payload format
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: chatId,
          answer: inputMessage,
        }),
      });

      toast({
        title: "Message sent successfully!",
        description: "Your message has been sent.",
      });
    } catch (error) {
      console.error("Error sending to webhook:", error);
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      });
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
                placeholder="Type your message here..."
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
              Type your name to get started with our travel assistant.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;