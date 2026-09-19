import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("Missing Supabase environment variables.");
}

const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);

const LIMITS = {
  name: 100,
  email: 200,
  subject: 200,
  message: 5000,
};

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request." },
        { status: 400 }
      );
    }

    const name = cleanText(body.name);
    const email = cleanText(body.email).toLowerCase();
    const subject = cleanText(body.subject);
    const message = cleanText(body.message);

    /*
     * Honeypot field.
     * Real users should never fill this hidden field.
     */
    const website = cleanText(body.website);

    if (website) {
      return NextResponse.json(
        { success: true },
        { status: 200 }
      );
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (name.length > LIMITS.name) {
      return NextResponse.json(
        { error: "Name is too long." },
        { status: 400 }
      );
    }

    if (email.length > LIMITS.email) {
      return NextResponse.json(
        { error: "Email is too long." },
        { status: 400 }
      );
    }

    if (subject.length > LIMITS.subject) {
      return NextResponse.json(
        { error: "Subject is too long." },
        { status: 400 }
      );
    }

    if (message.length > LIMITS.message) {
      return NextResponse.json(
        { error: "Message is too long." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    /*
     * Prevent extremely large/abnormal whitespace-only input.
     */
    if (
      name.length < 2 ||
      subject.length < 2 ||
      message.length < 5
    ) {
      return NextResponse.json(
        { error: "Please provide more complete information." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("contact_messages")
      .insert([
        {
          name,
          email,
          subject,
          message,
        },
      ]);

    if (error) {
      console.error("Supabase contact message error:", error);

      return NextResponse.json(
        { error: "Failed to save your message." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}