import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "../Components/DashboardLayout/DashboardLayout";
import DashboardComponentPage from "../Components/DashBoardComponent/DashboardComponent";



export default function DashboardPage() {
  const session = getServerSession(authOptions);

  
  

  if (!session) {
    redirect("/login");
  }


  return (
    <DashboardLayout>
     <DashboardComponentPage/>
     
    </DashboardLayout>
  );
}
