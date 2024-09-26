import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Natdanai Kamthornkittikul",
    studentId: "660610755",
  });
};
