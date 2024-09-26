import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { Database,User} from "@lib/DB";
export const GET = async () => {
  {/*readDB();
  const rooms = readDB();
    const courseNoList = [];
    for (const enroll of rooms) {
        courseNoList.push(enroll.);
    }
  return NextResponse.json({
    ok: true,
    rooms:rooms
    //totalRooms:
  });
  */}
  
};

export const POST = async (request: NextRequest) => {
  const payload = checkToken();
  if(!payload) {
   return NextResponse.json(
     {
       ok: false,
       message: "Invalid token",
    },
     { status: 401 }
   );
  }
  const {role} = <User>payload;
  readDB();
  if (role !== "ADMIN"||"SUPER_ADMIN") {
    return NextResponse.json(
      {
        ok: true,
        message: "Only ADMIN or SUPER_ADMIN can use this API route",
      },
      { status: 403 }
    );
  }
  const body = await request.json();
  const { roomName } = body;
  const foundCourse = (<Database>DB).Room.find((x) => x.roomName === roomName);
  if(foundCourse) {
   return NextResponse.json(
     {
       ok: false,
       message: `Room ${foundCourse} already exists`,
     },
     { status: 400 }
   );
  }
  const roomId = nanoid();

  //call writeDB after modifying Database
  (<Database>DB).Room.push({
    roomName,
    roomId,
  });
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId :roomId,
    message: `Room ${foundCourse} has been created`,
  });
};
