import Notification from "../../../../models/notification";
import connectdb from "../../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function DELETE(params, context) {
  try {
    await connectdb();

    const { id } = await context.params;

    const data = await Notification.findByIdAndDelete(id);
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
