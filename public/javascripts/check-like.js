document.addEventListener("DOMContentLoaded", function(){
    // hàm sử lý click button
    var confirm = document.querySelectorAll(".confirm");
    var button = document.getElementById("check_like");
    button.addEventListener("click", function(){
        for (let i = 0; i < confirm.length; i++) {
            confirm[i].classList.add("disappear");    
        }
    })
})