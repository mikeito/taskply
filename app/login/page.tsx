import LoginForm from "@/components/login-form"
import { GalleryVerticalEnd } from "lucide-react"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCookie, getCookies, setCookie, deleteCookie, hasCookie } from 'cookies-next';

export default async function LoginPage() {

  const exists = await hasCookie('token', { cookies });

  // Check if token exists, if so, redirect to dashboard
  if (exists) {
    redirect("/dashboard");
  }
  
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
