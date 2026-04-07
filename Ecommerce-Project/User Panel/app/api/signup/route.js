import connectDB from "../../../lib/mongodb";
import User from "../../../model/user";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { fname, lname, email, password } = body;

    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return new Response(
        JSON.stringify({ error: "Email already registered" }),
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newuser = await User.create({
      fname,
      lname,
      email,
      password: hashedPassword,
    });
    return new Response(
      JSON.stringify({
        message: "user created successfully",
        data: newuser,
      }),
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
