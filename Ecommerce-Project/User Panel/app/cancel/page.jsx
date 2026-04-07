'use client'

import { useRouter } from "next/navigation";

export default function SuccessPage() {
    const router = useRouter();
  return (
    <div className="container py-5 text-center">
      <h1>Payment not Successful </h1>
      <p>Try again</p>
      <button  className="btn btn-primary mt-3" onClick={()=>router.push('../dashboard')}
      >Go  back to Dashboard</button>
    
    </div>
  );
}
