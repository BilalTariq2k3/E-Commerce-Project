import { useRouter } from "next/navigation";
import "./ordercard.css";

export default function OrderCard({ orderData, index }) {
  const formattedDate = new Date(orderData.createdAt).toLocaleDateString();
  const router = useRouter();

  return (
    <tr>
      <td className="fw-semibold">{index}</td>
      <td className="fw-semibold">{orderData._id}</td>

      <td className="fw-bold text-success">{formattedDate}</td>

      <td className="fw-bold text-success">{orderData.totalbill}$</td>

      <td>Delivered</td>

      <td>
        <button
          className="btn btn-success btn-sm"
          onClick={() => router.push(`/OrderCardDetails/${orderData._id}`)}
        >
          View Details
        </button>
      </td>
    </tr>
  );
}
