// Array com os URLs das imagens de fundo
  // Selecionando os elementos
const openSidebar = document.getElementById("open-sidebar");
const closeSidebar = document.getElementById("close-sidebar");
const sidebar = document.getElementById("sidebar");

// Abrir a barra lateral
openSidebar.addEventListener("click", () => {
    sidebar.classList.remove("hidden");
    sidebar.classList.add("visible");
});

// Fechar a barra lateral
closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("visible");
    sidebar.classList.add("hidden");
});



  