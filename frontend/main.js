// Import modul JS per halaman
import "./js/login.js";
import "./js/register.js";
import "./js/home.js";

// Kamu bisa tambahkan deteksi halaman untuk menjalankan script sesuai kebutuhan
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.endsWith("login.html")) {
    console.log("Halaman login dimuat");
    // login.js akan otomatis jalan saat diimport
  } else if (path.endsWith("register.html")) {
    console.log("Halaman register dimuat");
    // register.js akan otomatis jalan
  } else if (path.endsWith("home.html")) {
    console.log("Halaman home dimuat");
    // home.js akan otomatis jalan
  } else {
    console.log("Halaman landing page (index.html) dimuat");
  }
});
