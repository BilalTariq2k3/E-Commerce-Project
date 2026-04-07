import { FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
export default function OrderCard({ orderdata, index }) {
  console.log('cate',orderdata);
const router = useRouter();
   const handleView = () => {
    router.push(`/admin/order/orderdetails/${orderdata._id}`);
  };
  return (
    <tr>
      {/* Index */}
      <td>{index + 1}</td>

      {/* User Name */}
      <td>{orderdata.userId?.fname || "User Not Found"} {orderdata.userId?.lname}</td>

      {/* Email */}
      <td>{orderdata.email}</td>

      {/* Phone */}
      <td>{orderdata.phone}</td>

      {/* Total Bill */}
      <td>Rs {orderdata.totalbill}</td>

      {/* Payment */}
      <td>{orderdata.paymentmethod}</td>

      {/* Date */}
      <td>
        {new Date(orderdata.createdAt).toLocaleDateString()}
      </td>

      {/* Actions */}
      <td>
        <div className="d-flex justify-content-center gap-1">
          <button className="btn btn-info btn-sm" title="View" onClick={handleView}>
            <FaEye />
          </button>
        </div>
      </td>
    </tr>
  );
}