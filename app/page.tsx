import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-1">
          {/* Hero Section */}

          <section className="container mx-auto px-4 py-32">
            <div>
            <h1 className="text-black">A better to track your job application</h1>
            <p className="text-muted-foreground">Capture, organize and manage your job search in one place</p>
            </div>
            <section>
              <button>Start for free</button>
            </section>
          </section>
      </main>
    </div>
  );
}
