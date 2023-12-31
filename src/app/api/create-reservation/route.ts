import { NextRequest, NextResponse } from "next/server"

import { getDbURL } from "@/lib/data/get-db-url"
import { initialize } from "@medusajs/inventory"

type RequestBody = {
  location_id?: string
  inventory_item_id?: string
  metadata: Record<string, string>
}
export async function POST(request: NextRequest) {
  const { location_id, inventory_item_id, metadata } = ((await request.json()) ??
    {}) as RequestBody


  if (location_id && inventory_item_id) {
    const inventoryService = await initialize({
      database: {
        url: await getDbURL(),
        type: "postgres",
        extra: {
          ssl: { rejectUnauthorized: false },
        },
      },
    })

    const reservationItem = await inventoryService.createReservationItem({
      location_id,
      inventory_item_id,
      metadata,
      description: "try on",
      quantity: 1,
    })

    return NextResponse.json({
      reservationItem,
    })
  } else {
    return new NextResponse(
      JSON.stringify({
        error: "Missing parameters",
      }),
      {
        status: 400,
      }
    )
  }
}
