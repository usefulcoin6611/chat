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
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-extrabold bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-2">
            Spring Chat
          </CardTitle>
          <CardDescription className="text-base">Mulai dengan memasukkan username Anda</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Contoh: user123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-lg h-12 rounded-xl focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 text-md rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-colors">
              Masuk
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
