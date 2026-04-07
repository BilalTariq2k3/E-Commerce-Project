"use client";

import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="container py-5 text-center">
      <h1>Payment Successful ✅</h1>
      <p>Thank you for your order!</p>
      <button
        className="btn btn-primary mt-3"
        onClick={() => router.push("../dashboard")}
      >
        Go to Dashboard
      </button>
    </div>
  );
}
