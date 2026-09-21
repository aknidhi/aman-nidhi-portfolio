"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Inbox,
  Mail,
  MailOpen,
  Trash2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

export default function AdminMessagesPage() {
  const supabase = createClient();

  const [messages, setMessages] = useState<Message[]>(
    []
  );

  const [selectedMessage, setSelectedMessage] =
    useState<Message | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [actionId, setActionId] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  async function loadMessages() {
    setIsLoading(true);
    setError("");

    const {
      data,
      error: loadError,
    } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (loadError) {
      console.error(
        "MESSAGE LOAD ERROR:",
        loadError
      );

      setError(
        `Unable to load messages: ${loadError.message}`
      );

      setIsLoading(false);
      return;
    }

    setMessages(data || []);
    setIsLoading(false);
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function updateMessageStatus(
    message: Message,
    status: "read" | "unread"
  ) {
    setActionId(message.id);
    setError("");

    const {
      error: updateError,
    } = await supabase
      .from("contact_messages")
      .update({
        status,
      })
      .eq("id", message.id);

    if (updateError) {
      setError(
        `Unable to update message: ${updateError.message}`
      );

      setActionId(null);
      return;
    }

    setMessages((current) =>
      current.map((item) =>
        item.id === message.id
          ? {
              ...item,
              status,
            }
          : item
      )
    );

    setSelectedMessage((current) =>
      current?.id === message.id
        ? {
            ...current,
            status,
          }
        : current
    );

    setActionId(null);
  }

  async function openMessage(
    message: Message
  ) {
    setSelectedMessage(message);

    if (message.status === "unread") {
      await updateMessageStatus(
        message,
        "read"
      );
    }
  }

  async function deleteMessage(
    message: Message
  ) {
    const confirmed = window.confirm(
      `Delete the message from ${message.name} permanently?`
    );

    if (!confirmed) {
      return;
    }

    setActionId(message.id);
    setError("");

    const {
      error: deleteError,
    } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", message.id);

    if (deleteError) {
      setError(
        `Unable to delete message: ${deleteError.message}`
      );

      setActionId(null);
      return;
    }

    setMessages((current) =>
      current.filter(
        (item) => item.id !== message.id
      )
    );

    setSelectedMessage((current) =>
      current?.id === message.id
        ? null
        : current
    );

    setActionId(null);
  }

  const unreadCount = messages.filter(
    (message) => message.status === "unread"
  ).length;

  return (
    <>
      <style jsx global>{`
        .messages-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(
            320px,
            0.85fr
          );
          gap: 20px;
          align-items: start;
        }

        .messages-list-panel,
        .message-detail-panel {
          min-width: 0;
        }

        .message-list {
          display: flex;
          flex-direction: column;
        }

        .message-list-item {
          width: 100%;
          padding: 18px 0;
          border: 0;
          border-bottom: 1px solid var(--border);
          background: transparent;
          color: inherit;
          text-align: left;
          cursor: pointer;
          transition:
            background-color 0.18s ease,
            padding-left 0.18s ease;
        }

        .message-list-item:first-child {
          padding-top: 4px;
        }

        .message-list-item:last-child {
          border-bottom: 0;
          padding-bottom: 4px;
        }

        .message-list-item:hover {
          padding-left: 6px;
        }

        .message-list-item.active {
          padding-left: 10px;
        }

        .message-list-main {
          min-width: 0;
        }

        .message-list-title {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .message-list-title strong {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14px;
          font-weight: 500;
        }

        .message-unread-dot {
          width: 6px;
          height: 6px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #ffffff;
        }

        .message-list-sender {
          margin-top: 6px;
          color: var(--muted);
          font-size: 12px;
        }

        .message-list-preview {
          margin-top: 5px;
          overflow: hidden;
          color: var(--muted-dark);
          font-size: 11px;
          line-height: 1.5;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .message-list-date {
          display: block;
          margin-top: 7px;
          color: var(--muted-dark);
          font-size: 10px;
        }

        .message-detail {
          position: sticky;
          top: 20px;
        }

        .message-detail-header {
          padding-bottom: 18px;
          border-bottom: 1px solid var(--border);
        }

        .message-detail-header h2 {
          margin: 0;
          font-size: 21px;
          font-weight: 500;
          line-height: 1.3;
        }

        .message-detail-sender {
          margin-top: 10px;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.7;
        }

        .message-detail-sender a {
          color: var(--foreground);
          text-decoration: none;
        }

        .message-detail-sender a:hover {
          text-decoration: underline;
        }

        .message-detail-body {
          padding: 20px 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.8;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .message-detail-date {
          color: var(--muted-dark);
          font-size: 10px;
        }

        .message-detail-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding-top: 18px;
          border-top: 1px solid var(--border);
        }

        .messages-summary {
          display: flex;
          gap: 16px;
          margin-top: 8px;
          color: var(--muted-dark);
          font-size: 10px;
        }

        .message-status {
          display: inline-flex;
          padding: 4px 7px;
          border: 1px solid var(--border);
          color: var(--muted);
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .message-status.unread {
          color: #ffffff;
        }

        @media (max-width: 850px) {
          .messages-layout {
            grid-template-columns: 1fr;
          }

          .message-detail {
            position: static;
          }
        }
      `}</style>

      <main className="admin-page">
        <div className="admin-container">
          <header className="admin-header admin-subpage-header">
            <div>
              <Link
                href="/admin"
                className="admin-back-link"
              >
                <ArrowLeft size={15} />
                Dashboard
              </Link>

              <p className="eyebrow">
                AMAN NIDHI / ADMIN
              </p>

              <h1>Messages.</h1>

              <p className="admin-header-description">
                Manage messages submitted through
                your contact form.
              </p>

              <div className="messages-summary">
                <span>
                  {messages.length} total
                </span>

                <span>
                  {unreadCount} unread
                </span>
              </div>
            </div>

            <button
              type="button"
              className="admin-view-site"
              onClick={loadMessages}
            >
              <Inbox size={15} />
              Refresh
            </button>
          </header>

          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}

          <section className="messages-layout">
            <div className="admin-panel messages-list-panel">
              <div className="admin-panel-header">
                <div>
                  <p className="eyebrow">
                    INBOX
                  </p>

                  <h2>
                    Incoming messages
                  </h2>
                </div>
              </div>

              {isLoading ? (
                <div className="admin-empty-state">
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="admin-empty-state">
                  <Mail size={24} />

                  <p>
                    No messages yet.
                  </p>
                </div>
              ) : (
                <div className="message-list">
                  {messages.map((message) => (
                    <button
                      key={message.id}
                      type="button"
                      className={`message-list-item ${
                        selectedMessage?.id ===
                        message.id
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        openMessage(message)
                      }
                    >
                      <div className="message-list-main">
                        <div className="message-list-title">
                          <strong>
                            {message.subject}
                          </strong>

                          {message.status ===
                            "unread" && (
                            <span className="message-unread-dot" />
                          )}
                        </div>

                        <p className="message-list-sender">
                          {message.name} ·{" "}
                          {message.email}
                        </p>

                        <p className="message-list-preview">
                          {message.message}
                        </p>

                        <time className="message-list-date">
                          {new Date(
                            message.created_at
                          ).toLocaleString()}
                        </time>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-panel message-detail-panel">
              <div className="admin-panel-header">
                <div>
                  <p className="eyebrow">
                    MESSAGE
                  </p>

                  <h2>Details</h2>
                </div>
              </div>

              {!selectedMessage ? (
                <div className="admin-empty-state">
                  <MailOpen size={24} />

                  <p>
                    Select a message to read it.
                  </p>
                </div>
              ) : (
                <div className="message-detail">
                  <div className="message-detail-header">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "space-between",
                        gap: "12px",
                      }}
                    >
                      <h2>
                        {selectedMessage.subject}
                      </h2>

                      <span
                        className={`message-status ${
                          selectedMessage.status ===
                          "unread"
                            ? "unread"
                            : ""
                        }`}
                      >
                        {selectedMessage.status}
                      </span>
                    </div>

                    <p className="message-detail-sender">
                      From{" "}
                      <strong>
                        {selectedMessage.name}
                      </strong>
                      <br />

                      <a
                        href={`mailto:${selectedMessage.email}`}
                      >
                        {selectedMessage.email}
                      </a>
                    </p>
                  </div>

                  <div className="message-detail-body">
                    {selectedMessage.message}
                  </div>

                  <time className="message-detail-date">
                    Received{" "}
                    {new Date(
                      selectedMessage.created_at
                    ).toLocaleString()}
                  </time>

                  <div className="message-detail-actions">
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                        selectedMessage.email
                      )}&su=${encodeURIComponent(
                        `Re: ${selectedMessage.subject}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="message-action-button"
                    >
                      <Mail size={14} />
                      Reply
                      <ArrowUpRight size={13} />
                    </a>

                    {selectedMessage.status ===
                    "unread" ? (
                      <button
                        type="button"
                        className="message-action-button"
                        onClick={() =>
                          updateMessageStatus(
                            selectedMessage,
                            "read"
                          )
                        }
                        disabled={
                          actionId ===
                          selectedMessage.id
                        }
                      >
                        <Check size={14} />
                        Mark read
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="message-action-button"
                        onClick={() =>
                          updateMessageStatus(
                            selectedMessage,
                            "unread"
                          )
                        }
                        disabled={
                          actionId ===
                          selectedMessage.id
                        }
                      >
                        <MailOpen size={14} />
                        Mark unread
                      </button>
                    )}

                    <button
                      type="button"
                      className="message-delete-button"
                      onClick={() =>
                        deleteMessage(
                          selectedMessage
                        )
                      }
                      disabled={
                        actionId ===
                        selectedMessage.id
                      }
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          <footer className="admin-footer">
            <span>AMAN. ADMIN</span>

            <Link href="/admin">
              Back to dashboard
            </Link>
          </footer>
        </div>
      </main>
    </>
  );
}