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



// ---------------- Interactive terminal ----------------
const input = document.getElementById("terminal-input");
const output = document.getElementById("output");
const terminalBody = document.querySelector(".Terminal");

const history = [];   // every command typed
let historyIndex = 0; // where we are when pressing up/down

// Each command is a function that returns an array of lines to print
const commands = {
    help: () => [
        "Available commands:",
        "  about      who I am",
        "  skills     what I can do",
        "  projects   things I've built",
        "  funfacts   random facts about me",
        "  contact    how to reach me",
        "  github     open my GitHub",
        "  theme      switch light/dark",
        "  whoami     who is using this terminal?",
        "  date       current date and time",
        "  echo       repeat whatever you type after it",
        "  clear      clear the screen",
    ],
    about: () => {
        openAbout();
        return ["Opening about window..."];
    },
    skills: () => [
        "Coding: Python, HTML, CSS",
        "Outside CS: public speaking, critical thinking (Model United Nations)",
    ],
    projects: () => {
        openProjects();
        return ["Opening projects window..."];
    },
    funfacts: () => [
        "⚽ I hosted an FC 25 tournament back in high school!",
        "🤖 I like to collect old consoles and tech!",
    ],
    contact: () => [
        "📧 oscar.padiman@binus.ac.id",
        "🐱‍💻 github: oscarsamuelpad-byte",
    ],
    github: () => {
        window.open("https://github.com/oscarsamuelpad-byte", "_blank");
        return ["Opening GitHub..."];
    },
    theme: () => {
        button.click(); // reuse the toggle button from above
        return ["Theme switched."];
    },
    whoami: () => ["a curious visitor 👋"],
    date: () => [new Date().toString()],
    echo: (args) => [args.join(" ")],
    clear: () => {
        output.innerHTML = "";
        return [];
    },
};

function printLine(text) {
    const line = document.createElement("div");
    line.className = "terminal-line output-line";
    line.textContent = text; // textContent (not innerHTML) so typed text can't inject HTML
    output.appendChild(line);
}

function printCommandEcho(text) {
    // Shows "oscar.padiman:~$ whatever you typed" in the history
    const line = document.createElement("div");
    line.className = "terminal-line";

    const user = document.createElement("span");
    user.className = "textgreen";
    user.textContent = "oscar.padiman:";

    const cmd = document.createElement("span");
    cmd.className = "textwhite";
    cmd.textContent = "~$ " + text;

    line.append(user, " ", cmd);
    output.appendChild(line);
}

function runCommand(raw) {
    const trimmed = raw.trim();
    printCommandEcho(trimmed);
    if (trimmed === "") return;

    history.push(trimmed);
    historyIndex = history.length;

    const [name, ...args] = trimmed.split(/\s+/);
    const command = commands[name.toLowerCase()];

    if (command) {
        command(args).forEach(printLine);
    } else {
        printLine(`command not found: ${name}. Type 'help' to see commands.`);
    }
}

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        runCommand(input.value);
        input.value = "";
        input.scrollIntoView({ block: "end" }); // keep the prompt in view
    } else if (e.key === "ArrowUp") {
        e.preventDefault(); // stops cursor jumping to start of input
        if (historyIndex > 0) {
            historyIndex--;
            input.value = history[historyIndex];
        }
    } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex < history.length - 1) {
            historyIndex++;
            input.value = history[historyIndex];
        } else {
            historyIndex = history.length;
            input.value = "";
        }
    }
});

// Clicking anywhere in the terminal focuses the prompt, like a real terminal
terminalBody.addEventListener("click", () => input.focus());

const modal = document.getElementById("projects-modal");
const aboutModal = document.getElementById("about-modal");

function openProjects() { modal.hidden = false; }
function openAbout()    { aboutModal.hidden = false; }

function closeAll() {
    modal.hidden = true;
    aboutModal.hidden = true;
    input.focus(); // hand the cursor back to the prompt
}

document.getElementById("modal-close").addEventListener("click", closeAll);
document.getElementById("about-close").addEventListener("click", closeAll);

// Click on the dark backdrop (but not the window itself) closes it
[modal, aboutModal].forEach((m) => {
    m.addEventListener("click", (e) => {
        if (e.target === m) closeAll();
    });
});

// Esc closes whichever is open
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && (!modal.hidden || !aboutModal.hidden)) closeAll();
});

function openProjects() {
    modal.hidden = false;
}

function closeProjects() {
    modal.hidden = true;
    input.focus(); // hand the cursor back to the prompt
}

document.getElementById("modal-close").addEventListener("click", closeProjects);

// Click on the dark backdrop (but not the window itself) closes it
modal.addEventListener("click", (e) => {
    if (e.target === modal) closeProjects();
});

// Esc closes it
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeProjects();
});