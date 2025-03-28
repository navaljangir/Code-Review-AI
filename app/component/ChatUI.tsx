'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { ArrowUp } from "lucide-react";
import { useRef } from "react"

export function ChatInterface(){
    const message = useRef('');
    return <div className="h-full flex justify-center items-center">
        <div className="w-[500px] flex items-center gap-4">
         <Input type='text' placeholder="Enter your Code to Start Working"
         className="py-6 rounded-xl outline-none ring-none"
         onChange={(e)=> message.current = e.target.value}
         />
        <Button variant={'link'} className="bg-white py-4 rounded-full"><ArrowUp className="h-10 w-10"/></Button>
        </div>
    </div>
}