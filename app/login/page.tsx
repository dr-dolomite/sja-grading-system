import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2">
            <Image
              src="/sja-logos/sja-logo-transparent.png"
              alt="SJA Logo"
              width={32}
              height={32}
              className="size-8"
            />
            <span className="text-base font-semibold">SJA Grading System</span>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/sja-logos/sja-logo-solid-bg.png"
          alt="SJA"
          fill
          className="object-contain p-16 opacity-10"
          priority={false}
        />
      </div>
    </div>
  )
}
