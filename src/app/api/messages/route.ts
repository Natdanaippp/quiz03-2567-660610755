import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import {Database,User} from "@lib/DB";
export const GET = async (request: NextRequest) => {
  readDB();
  const roomId = request.nextUrl.searchParams.get("roomId");

  const foundroomId = (<Database>DB).Room.find((x) => x.roomId === roomId);
  if(!foundroomId){
    return NextResponse.json(
     {
      ok: false,
       message: `Room is not found`,
     },
     { status: 404 }
   );
  }
  const Rooms = [];
  for (const room of (<Database>DB).Message) {
    const rooms = (<Database>DB).Message.find((x) => x.roomId === room);
    Rooms.push(rooms);
  }
  return NextResponse.json({
  ok: true,
  "Messges":Rooms,
  });
};

export const POST = async (request: NextRequest) => {
  readDB();
  const body = await request.json();
  const { roomId,messageText } = body;
  const foundroomId = (<Database>DB).Message.find((x) => x.roomId === roomId);
  if(!foundroomId){
  return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }
   

  const messageId = nanoid();

  writeDB();
  (<Database>DB).Message.push({
    roomId,
    messageText,
  });
  return NextResponse.json({
    ok: true,
    roomId:messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();
  if(!payload){
  return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
   
  const { role} = <User>payload;
  if (role !== "SUPER_ADMIN") {
    return NextResponse.json(
      {
        ok: true,
        message: "Only SUPER_ADMIN can use this API route",
      },
      { status: 403 }
    );
  }
  const body = await request.json();
  const { messageId } = body;
  readDB();
  const foundmessageId = (<Database>DB).Message.findIndex(
    (x) => x.messageId === messageId
  );
  if (foundmessageId === -1) {
    return NextResponse.json(
        {
          ok: false,
          message: "Message is not found",
        },
        { status: 404 }
      );
  }
   
  (<Database>DB).Message.splice(foundmessageId, 1);
  writeDB();
  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
