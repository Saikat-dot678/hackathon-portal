export const metadata = {
  title: "Admin Dashboard | BURNBRAIN",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // The RootLayout (src/app/layout.tsx) handles the <html>, <body>, and global cursor.
    <div className="admin-wrapper bg-black text-white min-h-screen">
      {children}
    </div>
  );
}