"use client";

import "./Header.css";
import Image from "next/image";
import { handleSignOut } from "../../utilis/signout";
import AccountPage from "../../AccountSetting/page";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faArrowRightFromBracket,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

import { useGetPostsQuery } from "../../Features/UserApi";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [userModal, setuserModal] = useState(false);
  const router = useRouter();

  const { data, isLoading, isError } = useGetPostsQuery();


  if (isLoading) {
    return ( 
      <div className="header d-flex justify-content-center py-4">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (isError) {
    return <div>Error loading user</div>;
  }

  return (
    <div className="header d-flex justify-content-between align-items-center px-5 py-4">
      <div className="d-flex gap-3 align-items-center">
        <FontAwesomeIcon icon={faStore} size="3x" />
        <h1 className="m-0">Online Store</h1>
      </div>

      <div className="d-flex align-items-center gap-4">
        <div>
          <FontAwesomeIcon
            icon={faCartShopping}
            size="2x"
            onClick={() => router.push("../../Cart")}
          />
        </div>

        {/* Profile Image */}
        <div className="profile-circle" onClick={() => setOpen(!open)}>
          <Image
            src={data?.profileImage || "/uploads/placeholder.jpg"}
            alt="Profile Image"
            width={100}
            height={100}
            unoptimized
          />
        </div>

        {/* Dropdown */}
        {open && (
          <div className="profile-dropdown shadow">
            <ul className="list-unstyled m-0">
              <li className="dropdown-item-custom">
                <p className="account" onClick={() => setuserModal(true)}>
                  Account Settings
                </p>
              </li>

              <li className="dropdown-item-custom" onClick={handleSignOut}>
                <FontAwesomeIcon
                  className="me-2"
                  icon={faArrowRightFromBracket}
                />
                Sign out
              </li>
            </ul>
          </div>
        )}
      </div>

      <AccountPage
        isOpen={userModal}
        onClose={() => setuserModal(false)}
      />
    </div>
  );
}