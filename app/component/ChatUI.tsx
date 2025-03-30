'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

export function ChatInterface() {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // Add your submission logic here
    console.log('Message submitted:', message);
    setMessage('');
  };

  return (
    <div className="h-full flex justify-center items-center bg-gradient-to-br p-6 text-black">
      <div className="w-full max-w-2xl space-y-4">
        <div className="flex items-center gap-2 shadow-lg rounded-2xl bg-white p-2">
          <Input
            type="text"
            placeholder="Enter your code to start working..."
            className="flex-1 py-6 rounded-xl border-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <Button
            onClick={handleSubmit}
            size="lg"
            className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg"
          >
            <ArrowUp className="h-6 w-6 text-white" />
          </Button>
        </div>
        <p className="text-sm text-center text-gray-500">
          Press Enter or click the arrow to submit
        </p>
      </div>
    </div>
  );
}