import User from '../../../../models/user';
import connectdb from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';




export async function DELETE(params,context) {
    
try{
await connectdb();

  const { id } = await context.params;


const userdata = await User.findByIdAndDelete(id);
return NextResponse.json({
      success: true,
      data: userdata,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}