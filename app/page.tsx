 "use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type Profile = {
  id: string;
  full_name: string | null;
  created_at: string;
};

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) loadProfile(data.user.id);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (nextUser) loadProfile(nextUser.id);
      else setProfile(null);
    });
    return () => listener.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProfile(userId: string) {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, created_at")
      .eq("id", userId)
      .maybeSingle();
    if (error) {
      setMessage("Could not load profile: " + error.message);
      return;
    }
    setProfile(data);
    setFullName(data?.full_name ?? "");
  }

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setMessage("Add your Supabase URL and public key to .env.local first.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session && data.user) {
          const { error: profileError } = await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: fullName.trim(),
          });
          if (profileError) throw profileError;
          await loadProfile(data.user.id);
          setMessage("Account created successfully.");
        } else {
          setMessage("Sign-up started. Check your email to confirm your account, then log in.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage("Logged in successfully.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !user) return;
    setBusy(true);
    setMessage("");
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName.trim(),
    });
    setBusy(false);
    if (error) setMessage(error.message);
    else {
      setMessage("Profile saved.");
      await loadProfile(user.id);
    }
  }

  async function logout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setMessage("You have logged out.");
  }

  if (!supabase) {
    return (
      <main className="page">
        <section className="hero">
          <div className="brand-mark">M</div>
          <p className="eyebrow">YOUR HEALTHCARE COMPANION</p>
          <h1>MediGuide <span>360</span></h1>
          <p className="lead">A simpler way to organise your healthcare journey.</p>
        </section>
        <section className="panel">
          <h2>Connect Supabase to continue</h2>
          <p>Copy <code>.env.example</code> to <code>.env.local</code> and add your Supabase project URL and public key. See README.md for the phone-friendly setup steps.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="topbar">
        <div className="brand"><span className="brand-mark small">M</span><strong>MediGuide 360</strong></div>
        {user && <button className="button button-light" onClick={logout}>Log out</button>}
      </header>

      <section className="hero">
        <p className="eyebrow">YOUR HEALTHCARE COMPANION</p>
        <h1>Healthcare, <span>made simpler.</span></h1>
        <p className="lead">Organise your healthcare journey in one place.</p>
      </section>

      {message && <div className="notice" role="status">{message}</div>}

      {!user ? (
        <section className="panel auth-panel">
          <h2>{mode === "signup" ? "Create your account" : "Welcome back"}</h2>
          <p className="muted">Use an email address you can access.</p>
          <form onSubmit={handleAuth} className="form">
            {mode === "signup" && (
              <label>Full name
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Enter your name" />
              </label>
            )}
            <label>Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
            </label>
            <label>Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="At least 8 characters" />
            </label>
            <button className="button" disabled={busy}>{busy ? "Please wait..." : mode === "signup" ? "Create account" : "Log in"}</button>
          </form>
          <p className="switch-mode">
            {mode === "signup" ? "Already have an account?" : "New to MediGuide 360?"}{" "}
            <button className="text-button" onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setMessage(""); }}>
              {mode === "signup" ? "Log in" : "Create account"}
            </button>
          </p>
        </section>
      ) : (
        <>
          <section className="welcome">
            <div>
              <p className="eyebrow">PATIENT DASHBOARD</p>
              <h2>Hello{profile?.full_name ? `, ${profile.full_name}` : ""}!</h2>
              <p className="muted">Your account is connected securely.</p>
            </div>
            <div className="avatar">♥</div>
          </section>

          <section className="panel">
            <h2>Patient profile</h2>
            <form onSubmit={saveProfile} className="form">
              <label>Full name
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Enter your full name" />
              </label>
              <button className="button" disabled={busy}>{busy ? "Saving..." : "Save profile"}</button>
            </form>
          </section>

          <section className="feature-grid">
            <article className="feature-card"><span>▤</span><h3>Medical records</h3><p>Organise reports in a future version.</p><small>Coming soon</small></article>
            <article className="feature-card"><span>⌖</span><h3>Find hospitals</h3><p>Explore hospital information in a future version.</p><small>Coming soon</small></article>
            <article className="feature-card"><span>▣</span><h3>OPD booking</h3><p>Plan appointments in a future version.</p><small>Coming soon</small></article>
            <article className="feature-card"><span>◉</span><h3>Voice assistant</h3><p>Get simple guidance in your language.</p><small>Coming soon</small></article>
          </section>
        </>
      )}

      <footer>Prototype only · Not for emergencies or medical diagnosis</footer>
    </main>
  );
}
