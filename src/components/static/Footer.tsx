export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-400">
        <p>Securing the future, one line of code at a time.</p>
        <p className="mt-2 text-xs text-slate-500">&copy; {new Date().getFullYear()} Cyber Shield Organizers. All rights reserved.</p>
      </div>
    </footer>
  );
}