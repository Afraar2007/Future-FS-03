export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="font-display text-2xl font-bold">
            Nila Malik<span className="text-primary">.</span>
          </div>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Slow-cooked classics and modern comforts, delivered hot to your door.
          </p>
        </div>
        <div className="text-sm">
          <div className="mb-3 font-semibold">Hours</div>
          <ul className="space-y-1 text-muted-foreground">
            <li>Mon – Thu · 9:00 – 10:00</li>
            <li>Fri – Sat · 9:00 – 11:00</li>
            <li>Sun · 9:00 – 10:00</li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="mb-3 font-semibold">Contact</div>
          <ul className="space-y-1 text-muted-foreground">
            <li>Road, Vikramangalam, Ambalavarkattalai, Tamil Nadu 621701</li>
            <li>ameeramra17@gmail.com</li>
            <li>contact no: +91 9659932065</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 px-4 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Tandoor Kitchen. Crafted with care.
      </div>
    </footer>
  );
}
