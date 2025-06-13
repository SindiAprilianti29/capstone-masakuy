const { addUser, authenticateUser } = require("../utils/users");

const authRoutes = [
  {
    method: "POST",
    path: "/register",
    handler: async (request, h) => {
      const { name, email, password } = request.payload;

      if (!name || !email || !password) {
        return h.response({ status: "fail", message: "Semua field harus diisi." }).code(400);
      }

      const result = addUser({ name, email, password });

      if (result.error) {
        return h.response({ status: "fail", message: result.error }).code(400);
      }

      return h.response({ status: "success", user: result.user }).code(201);
    },
  },
  {
    method: "POST",
    path: "/login",
    handler: async (request, h) => {
      const { email, password } = request.payload;

      if (!email || !password) {
        return h.response({ status: "fail", message: "Email dan password wajib diisi." }).code(400);
      }

      const result = authenticateUser(email, password);

      if (result.error) {
        return h.response({ status: "fail", message: result.error }).code(401);
      }

      return h.response({ status: "success", user: result.user }).code(200);
    },
  },
];

module.exports = authRoutes;
