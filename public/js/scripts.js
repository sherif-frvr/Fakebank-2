document.addEventListener('DOMContentLoaded', function() {
    const welcomeText = document.getElementById('welcomeText');
    const text = "Welcome to Bank of Trust";
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            welcomeText.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 150); // Adjust 150ms for slower typing
        }
    }

    typeWriter();
});