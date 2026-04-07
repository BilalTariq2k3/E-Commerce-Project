
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "../../component/DashboardLayout/DashboardLayout";
import DashboardComponent from "../../component/Dashboard/Dashboard";



export default function DashboardPage() {
  const session = getServerSession(authOptions);

  
  

  if (!session) {
    redirect("/login");
  }


  return (
    <DashboardLayout>
  
<DashboardComponent/>

  
     
    </DashboardLayout>
  );
}
