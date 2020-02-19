if(!sessionStorage.getItem('login')){
    window.location.href="login.html"
}

function logout(){
    sessionStorage.removeItem('login')
    window.location.href="login.html"
}