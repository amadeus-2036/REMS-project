import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-success" />
            </div>
            <CardTitle className="text-2xl">Account Created!</CardTitle>
            <CardDescription>Please check your email to confirm your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-surface p-4 rounded-lg">
              <p className="text-sm text-text-light">
                We&apos;ve sent a confirmation email to your inbox. Click the link in the email to verify your account
                and get started.
              </p>
            </div>
            <Link href="/auth/login" className="block">
              <Button className="w-full bg-primary hover:bg-primary-dark text-white h-11">Back to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
