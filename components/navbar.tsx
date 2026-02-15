import { Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function NavBar() {
    return (
        <nav className="border border-gray-200 bg-white">
            <div className="container mx-auto flex h-16 items-center px-4 justify-between">
                <Link href="/" className="flex items-center gap-2 text-xl text-primary font-semibold">
                    <Briefcase />
                    Job Tracker
                </Link>

                <div className="flex items-center gap-4">
                    <Link href="/sign-in" >
                        <Button className="text-gray-700 hover:text-black" variant="ghost">
                            Login
                        </Button>
                    </Link>
                    <Link href="/sign-up" >
                        <Button className="bg-primary hover:bg-primary/90 text-white hover:text-white" variant="ghost">
                            Start for free
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
