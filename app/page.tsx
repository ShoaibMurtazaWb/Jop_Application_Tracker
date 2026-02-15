import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-1">
        {/* Hero Section */}

        <section className="container mx-auto px-4 py-32">
          <div className="mx-auto max-2-4xl text-center">
            <h1 className="text-black mb-6 text-6xl font-bold">A better to track your job application</h1>
            <p className="text-muted-foreground mb-10 text-xl">Capture, organize and manage your job search in one place</p>
            <div className="flex flex-col items-center gap-4">
              <Link href="/sign-up">
                <Button className="h-12 px-8 text-lg font-medium" size="lg" >
                  Start for free <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <p className="text-small text-muted-foreground">Free forever. No credit card required.</p>
            </div>
          </div>
        </section>


        {/* Hero Images Section with Tabs */}
        <section className="bg-gray-50 py-20">

        </section>
      </main>
    </div>
  );
}
