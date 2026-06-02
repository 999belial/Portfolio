document.getElementById("generate-btn").addEventListener("click", async () => {
  const genre = document.getElementById("genre-select").value;
  const output = document.getElementById("idea-output");
  const loader = document.getElementById("gen-loader");

  
  output.innerText = "";
  output.classList.add("hidden");
  loader.classList.remove("hidden");

  try {
    
    const response = await fetch("/api/generate-idea", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ genre: genre }),
    });

    const data = await response.json();

    
    loader.classList.add("hidden");
    output.classList.remove("hidden");
    output.innerHTML = `<div class="idea-text">${data.idea}</div>`;
  } catch (error) {
    loader.classList.add("hidden");
    output.classList.remove("hidden");
    output.innerHTML = `<div class="idea-text" style="color: #ff4444;">Ops! Something went wrong. Please try again.</div>`;
  }
});