"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();
  const [needsPassword, setNeedsPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuthState = async () => {
      // フラグメントからパラメータを取得
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      
      const accessToken = params.get('access_token');
      const type = params.get('type');
      
      console.log("=== 認証状態デバッグ ===");
      console.log("Hash:", hash);
      console.log("Access token:", !!accessToken);
      console.log("Type:", type);
      
      if (type === 'invite' || accessToken) {
        console.log("招待フローを検出");
        setNeedsPassword(true);
      } else {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          router.push("/");
        } else {
          console.log("認証情報なし");
        }
      }
    };
    
    checkAuthState();
  }, [router]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      
      router.push("/");
    } catch (error) {
      setError("パスワードの設定に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  if (!needsPassword) {
    return <div>認証中...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">パスワードを設定してください</h1>
        
        <form onSubmit={handleSetPassword} className="space-y-4">
          <div>
            <Label htmlFor="password">新しいパスワード</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="confirmPassword">パスワードを再入力</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <div className="text-red-600 text-sm">{error}</div>}
          
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "設定中..." : "パスワードを設定"}
          </Button>
        </form>
      </div>
    </div>
  );
}