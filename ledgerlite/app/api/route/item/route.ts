import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const allProduct = await prisma.item.findMany({
        orderBy: { createdAt: "asc" }
    })

    if (!allProduct) {
        return NextResponse.json({
            success: false, message: "Product NotFound"
        }, { status: 404 })
    }

    return NextResponse.json({
        success: true, message: "successfully retrieve all products", data: allProduct
    }, { status: 200 })
}


export async function POST(req: NextRequest) {
    const { id, name, currentStock, lowStock, createdAt } = await req.json()

    if(!name){
        return NextResponse.json({
            success: false, message: "Bad Request: name is missing!"
        }, {status: 400})
    }
    

    const product = await prisma.item.upsert({
        where: {id},
        update: {
            name,
            currentStock: currentStock !== undefined ? Number(currentStock) : undefined,
            lowStock: lowStock !== undefined ? Number(lowStock) : undefined,
            createdAt: createdAt ? new Date(createdAt) : undefined 
        },
        create: {
            id: id ? id : undefined,
            name,
            currentStock: currentStock !== undefined ? Number(currentStock) : undefined,
            lowStock: lowStock !== undefined ? Number(lowStock) : undefined,
            createdAt: createdAt ? createdAt : undefined
        }
    })

    return NextResponse.json({
        success: true, message: "successfully create item"
    }, {status: 201})
}