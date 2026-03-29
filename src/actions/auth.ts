"use server"

import { cookies } from "next/headers"

export async function storeToken(token: string) {
    cookies().set({
        name: "token",
        value: token,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
}

export async function removeToken() {
    cookies().delete("token");
}

export async function getToken() {
    return cookies().get("token")?.value;
}
