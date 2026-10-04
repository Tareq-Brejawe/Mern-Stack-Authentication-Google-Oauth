import ResetPasswordPage from "@/components/ResetPassword";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPage />
    </Suspense>
  );
};

export default page;
