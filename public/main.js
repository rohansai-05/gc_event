function toggle(){
    var navLinks=document.getElementById('nav-links');
    var content=document.getElementById('content');
    var nav=document.getElementById('nav');

    if(navLinks.style.display==='block'){
        navLinks.style.display='none';
        nav.classList.remove('open');
        content.classList.remove('open');
    }
    else{
        navLinks.style.display='block';
        nav.classList.add('open');
        content.classList.add('open');
        
    }
}