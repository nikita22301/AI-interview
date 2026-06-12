"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteUserApi } from "../../api/signup";
import styles from "./AccountMenu.module.css";

const CONFIRM_WORD = "DELETE";

export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    router.push("/");
  };

  const closeConfirm = () => {
    setShowConfirm(false);
    setConfirmText("");
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== CONFIRM_WORD) return;

    const email = localStorage.getItem("email");

    if (!email) {
      alert("Email not found. Please log in again.");
      return;
    }

    try {
      setDeleting(true);
      const data = await deleteUserApi(email);

      if (!data.success && !data.message?.includes("successfully")) {
        alert(data.message || "Something went wrong");
        return;
      }

      localStorage.removeItem("token");
      localStorage.removeItem("email");
      router.push("/");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setDeleting(false);
      closeConfirm();
    }
  };

  const isConfirmValid = confirmText === CONFIRM_WORD;

  return (
    <div className={styles.wrapper} ref={menuRef}>
      <button
        className={styles.iconBtn}
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      </button>

      {open && (
        <div className={styles.dropdown}>
          <button className={styles.menuItem} onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
          <button
            className={`${styles.menuItem} ${styles.danger}`}
            onClick={() => { setShowConfirm(true); setOpen(false); }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete Account
          </button>
        </div>
      )}

      {showConfirm && (
        <div className={styles.overlay}>
          <div className={styles.confirmBox}>
            <h3 className={styles.confirmTitle}>Delete Account?</h3>
            <p className={styles.confirmText}>
              This action cannot be undone. All your data — profile, progress,
              and history — will be permanently deleted.
            </p>

            <p className={styles.confirmLabel}>
              Type <strong>{CONFIRM_WORD}</strong> to confirm:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={CONFIRM_WORD}
              className={styles.confirmInput}
              autoComplete="off"
              autoFocus
            />

            <div className={styles.confirmActions}>
              <button
                className={styles.cancelBtn}
                onClick={closeConfirm}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className={styles.confirmDeleteBtn}
                onClick={handleDeleteAccount}
                disabled={!isConfirmValid || deleting}
              >
                {deleting ? "Deleting…" : "Yes, Delete My Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}