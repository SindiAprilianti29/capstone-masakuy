const fetch = require("node-fetch");
const { findUserById, updateUser } = require("../utils/users");

const getRecommendation = {
  method: "POST",
  path: "/recommendation",
  handler: async (request, h) => {
    const { ingredients, userId } = request.payload;

    // Validasi input
    if (!ingredients || ingredients.length === 0) {
      return h.response({ success: false, message: "No ingredients provided." }).code(400);
    }

    // Jika user login → validasi dan batasi
    if (userId) {
      const user = findUserById(userId);
      if (!user) {
        return h.response({ success: false, message: "User tidak ditemukan." }).code(404);
      }

      if (!user.isPremium) {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        user.promptHistory = user.promptHistory || [];

        const thisMonthPrompts = user.promptHistory.filter((ts) => {
          const d = new Date(ts);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });

        if (thisMonthPrompts.length >= 4) {
          return h
            .response({
              success: false,
              message: "Batas 4 kali penggunaan bulan ini tercapai. Silakan upgrade ke premium.",
            })
            .code(403);
        }

        // Simpan penggunaan
        user.promptHistory.push(now.toISOString());
        const updated = updateUser(user);
        if (!updated) {
          return h.response({ success: false, message: "Gagal menyimpan data penggunaan." }).code(500);
        }
      }
    }

    // Kirim ke model ML
    try {
      const mlResponse = await fetch("http://202.10.36.53:8012/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bahan_input: ingredients.join(", ") }),
      });

      if (!mlResponse.ok) {
        const errorText = await mlResponse.text();
        console.error("Model ML error:", errorText);
        return h.response({ success: false, message: "Gagal memproses rekomendasi." }).code(500);
      }

      const { results } = await mlResponse.json();

      const recipes = results.map((item, index) => ({
        id: index + 1,
        title: item.nama_makanan,
        deskripsi: item.deskripsi,
        score: item.score,
      }));

      return h.response({ success: true, recipes }).code(200);
    } catch (err) {
      console.error("Fetch error:", err.message);
      return h.response({ success: false, message: "Server gagal memanggil model ML." }).code(500);
    }
  },
};

module.exports = [getRecommendation];
