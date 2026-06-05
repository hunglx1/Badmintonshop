import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function requireAdmin() {
const session = await getServerSession(authOptions);

if (!session) {
return {
ok: false,
status: 401,
message: "Bạn chưa đăng nhập",
};
}

if (session.user.role !== "ADMIN") {
return {
ok: false,
status: 403,
message: "Bạn không có quyền truy cập",
};
}

return {
ok: true,
session,
};
}
