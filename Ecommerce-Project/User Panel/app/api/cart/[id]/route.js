import connectDB from "../../../../lib/mongodb";
import mongoose from "mongoose";  
import Cart from "../../../../model/cart";
import { NextResponse } from "next/server";




export const DELETE = async (req, context) => {
  try {
    await connectDB();

    const { id } = await  context.params; 
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
    }

    const deleted = await Cart.findByIdAndDelete(id);

    if (!deleted) {
      return new Response(JSON.stringify({ error: "Cart item not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Cart item deleted" }), { status: 200 });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const  PUT = async (req,context) =>
{
try {
await connectDB();

const {id} = await  context.params;

     if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    const {quantity,totalprice} = await req.json();
   
    const updatedCart = await Cart.findByIdAndUpdate(
      id,                    
      { quantity ,totalprice},          
      { new: true }          
    );

    return NextResponse.json(
      { message: "Quantity updated", data: updatedCart },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
};


