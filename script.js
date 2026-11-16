const lightTheme = {
    "--bg": "#f4f1ea",
    "--bar-bg": "#d8d4cc",
    "--text": "#1a1a1a",
    "--green": "rgb(0, 120, 20)",
    "--accent": "#007a63",
    "--link": "#0b5cad",
};

const root = document.documentElement;

// Create the button and put it in the header
const button = document.createElement("button");
button.setAttribute("aria-label", "Toggle light mode");
Object.assign(button.style, {
    width: "60px",
    background: "transparent",
    color: "inherit",
    border: "1px solid currentColor",
    borderRadius: "4px",
    fontFamily: "monospace",
    fontSize: "12px",
    padding: "3px 0",
    cursor: "pointer",
});
document.querySelector(".Header").appendChild(button);

function setTheme(mode) {
    for (const [name, value] of Object.entries(lightTheme)) {
        if (mode === "light") {
            root.style.setProperty(name, value);
        } else {
            root.style.removeProperty(name); // falls back to original dark colours
        }
    }
    button.textContent = mode === "light" ? "dark" : "light";
    button.style.color = mode === "light" ? "#1a1a1a" : "white";
    try { localStorage.setItem("theme", mode); } catch (e) {}
}

// Default is dark unless the user previously chose light
let current = "dark";
try { if (localStorage.getItem("theme") === "light") current = "light"; } catch (e) {}
setTheme(current);

button.addEventListener("click", () => {
    current = current === "light" ? "dark" : "light";
    setTheme(current);
});