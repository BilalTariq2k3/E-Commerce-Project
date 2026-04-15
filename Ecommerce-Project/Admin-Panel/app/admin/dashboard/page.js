import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "../../component/DashboardLayout/DashboardLayout";
import DashboardComponent from "../../component/Dashboard/Dashboard";

export default async function DashboardPage() {
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch {
    // Stale cookie encrypted with another NEXTAUTH_SECRET — clear cookies and re-login
    redirect("/admin/clear-session");
  }

  if (!session) {
    redirect("/admin/login");
  }


  return (
    <DashboardLayout>
  
<DashboardComponent/>

  
     
    </DashboardLayout>
  );
}
