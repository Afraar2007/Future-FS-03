import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useCallback, type FormEvent } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "../lib/auth";
import { UtensilsCrossed } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Tandoor" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { user, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!email) return;
      signIn(email, mode === "signup" ? name : undefined);
      navigate({ to: "/" });
    },
    [email, name, mode, signIn, navigate],
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto grid max-w-5xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
        <div className="hidden md:block">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-pop">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold leading-tight">
            Welcome to <span className="text-gradient-warm">Tandoor.</span>
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Sign in to save addresses, see order history, and reorder your favourites in one tap.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            <li>• Saved addresses & cards</li>
            <li>• Live order tracking</li>
            <li>• Exclusive weekly drops</li>
            <li>
              • <span className="text-foreground">Tip:</span> use an email containing
              <code className="mx-1 rounded bg-secondary px-1 py-0.5 text-xs">admin</code>
              to access the admin dashboard.
            </li>
          </ul>
        </div>

        <div className="rounded-3xl bg-card p-8 shadow-pop">
          {user ? (
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold">You're signed in</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {user.name} · {user.email}
              </p>
              <button
                onClick={() => {
                  signOut();
                }}
                className="mt-6 inline-flex rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 inline-flex rounded-full bg-secondary p-1 text-sm">
                <button
                  onClick={() => setMode("signin")}
                  className={`rounded-full px-4 py-1.5 font-semibold ${mode === "signin" ? "bg-card shadow-card" : "text-muted-foreground"}`}
                >
                  Sign in
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`rounded-full px-4 py-1.5 font-semibold ${mode === "signup" ? "bg-card shadow-card" : "text-muted-foreground"}`}
                >
                  Create account
                </button>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                {mode === "signup" && <Field label="Full name" value={name} onChange={setName} />}
                <Field label="Email" type="email" value={email} onChange={setEmail} required />
                <Field label="Password" type="password" value={password} onChange={setPassword} />
                <button
                  type="submit"
                  className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-pop transition-transform hover:scale-[1.02]"
                >
                  {mode === "signin" ? "Sign in" : "Create account"}
                </button>
              </form>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Demo only — credentials are stored locally on your device.
              </p>
            </>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none ring-primary/30 transition-shadow focus:ring-2"
      />
    </label>
  );
}
