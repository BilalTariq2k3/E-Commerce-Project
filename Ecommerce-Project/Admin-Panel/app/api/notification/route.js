import connectdb from "../../../lib/mongodb";
import Notification from "../../../models/notification";

export async function GET() {
  try {
    await connectdb();

    const data = await Notification.find().sort({ createdAt: -1 });

    return Response.json({
      success: true,
      data,
    });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
