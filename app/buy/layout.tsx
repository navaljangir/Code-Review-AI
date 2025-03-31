"use client";
import { ReactNode, useEffect } from "react";

export default function Layout({ children } : {children : ReactNode}) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return <>{children}</>;
}
