import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Chưa đăng nhập
  if (!session) {
    redirect("/login");
  }

  // Không phải ADMIN
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}