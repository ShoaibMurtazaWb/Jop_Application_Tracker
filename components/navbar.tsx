"use client";

import { Briefcase, LayoutDashboard, LogOut, User } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import SignOutButton from "./sign-out-button";
import { useSession } from "@/lib/auth/auth-client";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary transition-opacity hover:opacity-90"
                >
                    <div className="rounded-lg bg-primary p-1.5 text-white">
                        <Briefcase size={20} />
                    </div>
                    <span>Job Tracker</span>
                </Link>

                <div className="flex items-center gap-3">
                    {session?.user ? (
                        <>
                            {/* Desktop Dashboard Link */}
                            <Link href="/dashboard" className="hidden sm:block">
                                <Button
                                    variant="ghost"
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground"
                                >
                                    Dashboard
                                </Button>
                            </Link>

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-9 w-9 rounded-full border border-gray-100 p-0 ring-offset-background transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                                {session.user.name?.[0].toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="w-60" align="end" sideOffset={8}>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1.5 px-1 py-1">
                                            <p className="text-sm font-semibold leading-none text-foreground">
                                                {session.user.name}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {session.user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />

                                    <Link href="/dashboard">
                                        <DropdownMenuItem className="cursor-pointer gap-2">
                                            <LayoutDashboard size={16} className="text-muted-foreground" />
                                            Dashboard
                                        </DropdownMenuItem>
                                    </Link>

                                    <DropdownMenuSeparator />

                                    {/* Wrapping SignOutButton in a Styled Item if it's just a functional component */}
                                    <SignOutButton />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/sign-in">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-sm font-medium text-gray-600 hover:text-black"
                                >
                                    Log In
                                </Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button size="sm" className="bg-primary px-5 font-medium shadow-sm hover:bg-primary/90">
                                    Start for free
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
