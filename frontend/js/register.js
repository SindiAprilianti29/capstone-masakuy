const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registrasi berhasil! Silakan login.");
        window.location.href = "login.html";
      } else {
        alert(data.message || "Registrasi gagal");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat mendaftar");
    }
  });
}
