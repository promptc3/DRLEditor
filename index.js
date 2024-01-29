require("./dist/app.bundle.js", function(drlEditor) {
    drlEditor.createEditor('//some rules');
    const randomfunc = () => { 
        let x = 1 + 2;
        console.log(`Helloooo ${x}`);
    }
    drlEditor.createAction(randomfunc);
    const btn = document.getElementById("log-btn");
    btn.addEventListener("click", (e) => {
        alert(drlEditor.getValue())
    })
});

