import { Notification } from "@/lib/models/Notification";

type NotificationType = "Info" | "Success" | "Warning" | "Error";

interface CreateNotificationInput {
  type?: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
}

/**
 * Records an in-app notification in the `notifications` collection. Used by
 * write endpoints (e.g. creating a user or enquiry) so the dashboard reflects
 * real-time activity. Failures are swallowed so they never block the main
 * action — the notification is a side effect, not a hard dependency.
 */
export async function createNotification(input: CreateNotificationInput) {
  try {
    await Notification.create({
      type: input.type ?? "Info",
      title: input.title,
      message: input.message,
      read: false,
      actionUrl: input.actionUrl,
    });
  } catch (error) {
    console.error("[v0] createNotification failed:", error);
  }
}
