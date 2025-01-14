import { NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  const { email, username, password } = await request.json();

  if (!email || !username || !password) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash: hashedPassword,
    },
  });

  return NextResponse.json(
    { message: "User created successfully", user: newUser },
    { status: 201 }
  );
}

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const { postId } = params;

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return NextResponse.json(
      { error: "Access denied, no token provided" },
      { status: 403 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
    };
    const userId = decoded.id;

    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
    });

    if (!post || post.userId !== userId) {
      return NextResponse.json(
        { error: "You are not authorized to delete this post" },
        { status: 403 }
      );
    }

    await prisma.post.delete({
      where: { id: parseInt(postId) },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
}
