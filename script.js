const buttons = document.querySelectorAll("button");

buttons.forEach(function(button) {
    button.addEventListener("click", function() {
    console.log("Du klikkede på knappen!");
    });
});

document.body.classList.toggle("dark-mode");
const facts = [
    "Jeg elsker webudvikling",
    "Min yndlingsfarve er blå",
    "Jeg kan lide at lære nye ting"
];
const hour = new Date().getHours();