function validateForm() {
    var currentlenght = document.getElementById('mycomment').value.length;
    if (currentlenght < 4) {
        $('#genericModal').modal('show');
        setTimeout(function() {
            $('#genericModal').modal('hide');
            document.getElementById('mycomment').focus();
        }, 5000);
        
        return false;
    }
    return true;
}
