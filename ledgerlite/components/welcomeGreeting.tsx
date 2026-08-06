"use client";

import { useEffect, useState } from "react";

interface WelcomeGreetingProps {
  name: string;
  initialGreeting: string;
}

export default function WelcomeGreeting({ name, initialGreeting }: WelcomeGreetingProps) {
  const [greeting, setGreeting] = useState(initialGreeting);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good morning");
    } else if (hours < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  return (
    <h1 className="text-2xl font-bold text-[#032523]">
      {greeting}, <span className="text-[#0B7A75]">{name}</span>
    </h1>
  );
}
