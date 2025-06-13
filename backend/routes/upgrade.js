const fs = require("fs");
const path = require("path");

const usersPath = path.join(__dirname, "../data/users.json");

const upgradePremium = {
  method: "POST",
  path: "/upgrade",
  handler: (request, h) => {
    const { userId } = request.payload;

    if (!userId) {
      return h.response({ success: false, message: "User ID tidak boleh kosong." }).code(400);
    }

    let users;
    try {
      users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
    } catch (err) {
      return h.response({ success: false, message: "Gagal membaca file user." }).code(500);
    }

    const user = users.find((u) => u.id === userId);

    if (!user) {
      return h.response({ success: false, message: "User tidak ditemukan." }).code(404);
    }

    if (user.isPremium) {
      return h.response({ success: false, message: "User sudah premium." }).code(400);
    }

    user.isPremium = true;

    try {
      fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    } catch (err) {
      return h.response({ success: false, message: "Gagal menyimpan perubahan." }).code(500);
    }

    return h.response({ success: true, message: "Akun berhasil di-upgrade ke Premium." }).code(200);
  },
};

module.exports = [upgradePremium];
