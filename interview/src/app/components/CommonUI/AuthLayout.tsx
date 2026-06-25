"use client";

import React from "react";
import styles from "./style/AuthLayout.module.css";
import WaveBorder from "./WaveBorder";
import Logo from "./logo";

interface AuthLayoutProps {
  children: React.ReactNode;
  showLogo?: boolean;
  className?: string;
  cardClassName?: string;
}

export default function AuthLayout({
  children,
  showLogo = true,
  className = "",
  cardClassName = "",
}: AuthLayoutProps) {
  return (
    <div className={[styles.page, className].join(" ")}>
      <div className={[styles.card, cardClassName].join(" ")}>
        <div className={styles.cornerGlow} />
        <WaveBorder />
        
        {showLogo && <Logo />}
        
        {children}
      </div>
    </div>
  );
}
