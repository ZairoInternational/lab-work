import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/db';
import Category from '../../../../models/category';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, slug } = await req.json();

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const newCategory = await Category.create({ name, slug });
    return NextResponse.json(newCategory);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
