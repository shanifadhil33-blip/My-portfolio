"use server";
import { signIn } from "@/auth";
/** Every sign in goes to Google with the account picker (set on the provider). */
export async function signInWithGoogle() { await signIn("google", { redirectTo: "/inbox" }); }
