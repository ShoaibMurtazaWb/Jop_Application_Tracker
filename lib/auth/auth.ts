import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { initializeUserBoard } from "../init-user-board";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db()

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client
    }),
    session:{
        cookieCache:{
            enabled: true,
            maxAge: 60 * 60
        }
    },
    emailAndPassword: {
        enabled: true
    },
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    try {
                        if (user.id) {
                            await initializeUserBoard(user.id)
                        }
                    } catch (error) {
                        console.error("Board initialization failed:", error)
                    }
                }
            }
        }
    }
});

export async function getSession() {
    const result = await auth.api.getSession({
        headers: await headers()
    })

    return result
}

export async function signout() {
    const result = await auth.api.signOut({
        headers: await headers()
    })

    if (result.success) {
        redirect("/sign-in")
    }
}