import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

//sales route
export async function POST(req: NextRequest){
    try {
        const { id, quantity, unitPrice, customItem, createdAt, itemId  } = await req.json()

    if (!quantity || !unitPrice){
        console.log("BAd request: quantity or unit price are required!")
        return NextResponse.json({
            success: false, error: "Bad Request: Quantity or unit price is required!"
        }, {status: 400})
    }

    const totalAmount = quantity * unitPrice

    if (id){
        const salesItem = await prisma.sales.findUnique({
            where: {id}
        })

        if (salesItem){
            return NextResponse.json({
                success: true, error: "sales already completed"
            }, {status: 200}) 
        }else{
            const result = await prisma.$transaction(async(tsx)=>{
                if(itemId){
                    const product = await tsx.item.findUnique({
                        where: {id: itemId}
                    })

                    if (!product){
                        throw new Error("product does not exist")
                    }

                    if(product.currentStock < quantity) {
                        throw new Error(`insufficient stock; available stock is ${product.currentStock}`)
                    }

                     tsx.item.update({
                        where: {id: itemId},
                        data: {
                            currentStock: {
                                decrement: Number(quantity)
                            }
                        }
                    })

                    const sale =  tsx.sales.create({
                        data: {
                            id: id ? id : undefined,
                            quantity: Number(quantity),
                            unitPrice: Number(unitPrice),
                            totalAmount,
                            createdAt: createdAt ? new Date(createdAt) : undefined,
                            customItem: customItem ? customItem : null,
                            itemId: itemId ? itemId : null,
                        }
                    })

                    return sale;
                }
            })
            return  NextResponse.json({
                success: true, message: "successfull"
            }, {status: 201})
        }



    }
    } catch (error) {
        console.log(`Error processing sales: ${error}`)
        return NextResponse.json({
            success: false, error: "internal server error"
        }, {status: 500})
    }
}


