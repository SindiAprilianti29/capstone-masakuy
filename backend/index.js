// const Hapi = require("@hapi/hapi");
// const authRoutes = require("./routes/auth");
// const recommendationRoutes = require("./routes/recommendation");
// const upgradeRoutes = require("./routes/upgrade"); // Tambahkan ini

// const init = async () => {
//   const server = Hapi.server({
//     port: 5000,
//     host: "localhost",
//     routes: {
//       cors: {
//         origin: ["*"],
//       },
//     },
//   });

//   server.route(authRoutes);
//   server.route(recommendationRoutes);
//   server.route(upgradeRoutes); // Tambahkan ini

//   await server.start();
//   console.log("Server running on %s", server.info.uri);
// };

// process.on("unhandledRejection", (err) => {
//   console.log(err);
//   process.exit(1);
// });

// init();

const Hapi = require("@hapi/hapi");

// Import semua route
const authRoutes = require("./routes/auth");
const recommendationRoutes = require("./routes/recommendation");
const upgradeRoutes = require("./routes/upgrade");

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"], // Izinkan CORS untuk semua origin (frontend dapat akses)
      },
    },
  });

  // Registrasi semua route
  server.route(authRoutes);
  server.route(recommendationRoutes);
  server.route(upgradeRoutes);

  // Start server
  await server.start();
  console.log("✅ Server running on:", server.info.uri);
};

// Tangani error yang tidak ditangkap
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});

init();
