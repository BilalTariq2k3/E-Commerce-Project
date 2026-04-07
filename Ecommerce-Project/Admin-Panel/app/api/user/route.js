import connectdb from '../../../lib/mongodb';
import User from "../../../models/user";

export async function GET() {
  try {
    await connectdb();

    const userdata = await User.find().sort({ createdAt: -1 });

    return Response.json({
      success: true,
      data: userdata,
    });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
