"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem("chat_username", username.trim());
      router.push("/chat");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-6 relative">
      <Card className="w-full max-w-md border-none bg-white dark:bg-slate-900 z-10 rounded-[40px] overflow-hidden">
        <CardHeader className="text-center pt-12 pb-6 px-10">
          <div className="mx-auto w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
          </div>
          <CardTitle className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
            Discapp
          </CardTitle>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-normal">
            Fast, simple, and secure messaging.
          </p>
        </CardHeader>

        <CardContent className="px-10 pb-12 pt-6">
          <form onSubmit={handleLogin} className="space-y-12">
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1 mb-6">
                Username
              </label>
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-lg h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                required
              />
            </div>
            <Button type="submit" className="w-full h-16 text-xl font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-95 text-white">
              Get Started
            </Button>
          </form>

          <div className="mt-10 text-center pt-8 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-400 font-medium tracking-wide">© 2077 Discapp</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
