"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function ContactForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!name || !email || !message) {
            setStatus("error");
            setErrorMessage("Please fill in all fields.");
            return;
        }

        setStatus("loading");
        setErrorMessage("");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, message }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to send message");
            }

            setStatus("success");
            setName("");
            setEmail("");
            setMessage("");
        } catch (error: any) {
            setStatus("error");
            setErrorMessage(error.message || "Something went wrong. Please try again later.");
        }
    };

    if (status === "success") {
        return (
            <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-lime-400/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="text-lime-400" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-neutral-400 mb-8 max-w-xs">
                    Thanks for reaching out. We've received your message and will get back to you shortly.
                </p>
                <button
                    onClick={() => setStatus("idle")}
                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="h-full flex flex-col justify-between">
            <div className="space-y-4">
                {status === "error" && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm">
                        <AlertCircle className="shrink-0 mt-0.5" size={16} />
                        <p>{errorMessage}</p>
                    </div>
                )}

                <div>
                    <label htmlFor="name" className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Your Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/10 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 outline-none transition-all disabled:opacity-50"
                        placeholder="John Doe"
                        disabled={status === "loading"}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/10 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 outline-none transition-all disabled:opacity-50"
                        placeholder="john@example.com"
                        disabled={status === "loading"}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">How can we help?</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/10 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 outline-none transition-all resize-none h-32 disabled:opacity-50"
                        placeholder="Tell us about your project, issue, or question..."
                        disabled={status === "loading"}
                        required
                    ></textarea>
                </div>
            </div>

            <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3.5 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 mt-auto shadow-[0_0_20px_rgba(163,230,53,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]"
            >
                {status === "loading" ? (
                    <>
                        <Loader2 size={18} className="animate-spin" /> Sending...
                    </>
                ) : (
                    <>
                        Send Message <Send size={18} />
                    </>
                )}
            </button>
        </form>
    );
}
