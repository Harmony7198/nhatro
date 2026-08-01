export function initializeToast() {

  const container = document.createElement("div");

  container.className =
    "toast-container position-fixed top-0 end-0 p-3";

  container.id = "toast-container";

  container.setAttribute("data-testid", "toast-container");

  document.body.appendChild(container);
}