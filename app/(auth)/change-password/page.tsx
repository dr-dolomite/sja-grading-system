import Image from "next/image"
import { ChangePasswordForm } from "@/components/change-password-form"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

export default function ChangePasswordPage() {
  return (
    <div className="min-h-svh flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-4 mb-6">
          <Image
            src="/sja-logos/sja-logo-transparent.png"
            alt="SJA Logo"
            width={32}
            height={32}
            className="size-8"
          />
          <span className="text-base font-semibold">SJA Grading System</span>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold">
              Set your new password
            </CardTitle>
            <CardDescription>
              You must change your password before continuing.
            </CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            <ChangePasswordForm />
          </div>
        </Card>
      </div>
    </div>
  )
}
