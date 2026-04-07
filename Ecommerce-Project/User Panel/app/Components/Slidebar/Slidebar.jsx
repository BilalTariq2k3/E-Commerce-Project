import "./Slidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faArrowRightFromBracket,
  faChartBar,
  faLayerGroup,
  faBagShopping,
  faDolly,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

import { usePathname } from "next/navigation";

import { handleSignOut } from "../../utilis/signout";

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="py-5 sidebar d-flex flex-column px-4">
      <div className="d-flex align-items-center gap-2 mb-5">
        <FontAwesomeIcon icon={faStore} size="2x" />
        <h3 className="m-0">Online Store</h3>
      </div>

      <div className="slidebar-items d-flex flex-column gap-4">
        <h4
          className={`menu-item ${pathname === "/dashboard" ? "active" : ""}`}
        >
          <FontAwesomeIcon className="me-2" icon={faChartBar} />
          <Link className="link" href="/dashboard">
            Dashboard
          </Link>
        </h4>

        <h4 className={`menu-item ${pathname === "/Category" ? "active" : ""}`}>
          <FontAwesomeIcon className="me-2" icon={faLayerGroup} />
          <Link className="link" href="/Category">
            Category
          </Link>
        </h4>

        <h4 className={`menu-item ${pathname === "/Product" ? "active" : ""}`}>
          <FontAwesomeIcon className="me-2" icon={faDolly} />
          <Link className="link" href="/Product">
            Product
          </Link>
        </h4>

        <h4 className={`menu-item ${pathname === "/Order" ? "active" : ""}`}>
          <FontAwesomeIcon className="me-2" icon={faBagShopping} />
          <Link className="link" href="/Order">
            Order
          </Link>
        </h4>

        <h4 className="menu-item" onClick={handleSignOut}>
          <FontAwesomeIcon className="me-2" icon={faArrowRightFromBracket} />
          Sign out
        </h4>
      </div>
    </div>
  );
}
