function validateForm() {
    var currentlenght = document.getElementById('mycomment').value.length;
    if (currentlenght < 4) {
        $('#genericModal').modal('show');
        setTimeout(function() {
            $('#genericModal').modal('hide');
            // document.getElementById('mycomment').focus();
        }, 5000);
        
        return false;
    }
    return true;
}

function validateFormNo2() {
    var currentlenght = document.getElementById('myNewComment').value.length;
    if (currentlenght < 4) {
        $('#genericModal2').modal('show');
        setTimeout(function() {
            $('#genericModal2').modal('hide');
            document.getElementById('myNewComment').focus();
        }, 5000);
        
        return false;
    }
    return true;
}

function updateComment(comment) {
    var time = document.getElementById(comment._id).querySelector('.comment-footer');
    time.style.display = "none";
    var content = document.getElementById(comment._id).querySelector('p');
    content.style.display = "none";

    const form = document.createElement('form');
    form.setAttribute("id", "changeCmt");
    form.setAttribute("method", "post");
    form.setAttribute("action", `/products/${comment.productId}/changecmt`);
    form.setAttribute("onsubmit", "return validateFormNo2()");
    form.innerHTML = `
        <input type="hidden" name="productId" value="${comment.productId}" />
        <input type="hidden" name="email" value="${comment.email}" />
        <input type="hidden" name="_id" value="${comment._id}" />
        <textarea name="newComment" id="myNewComment">${comment.comment}</textarea>
        <div class="modal" id="genericModal2" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header text-center">
                    <h5 class="modal-title">Quá ít kí tự.</h5>
                </div>
                <div class="modal-body">
                    <p>Cảm ơn bạn đã dành thời gian review. Vui lòng viết thêm vài lời review cho sản phẩm này nhé.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>
        <div class="rate">
            <span class="ratelabel"><b>Rating: </b></span>
            <input type="radio" id="star5" name="rate" value="5" checked/>
            <label for="star5" title="5 sao">5 stars</label>
            <input type="radio" id="star4" name="rate" value="4" />
            <label for="star4" title="4 sao">4 stars</label>
            <input type="radio" id="star3" name="rate" value="3" />
            <label for="star3" title="3 sao">3 stars</label>
            <input type="radio" id="star2" name="rate" value="2" />
            <label for="star2" title="2 sao">2 stars</label>
            <input type="radio" id="star1" name="rate" value="1" />
            <label for="star1" title="1 sao">1 star</label>
        </div>
        <div class="row">
        <button type="submit" class="btn btn-default pull-right" id="change_btn">
            Submit
        </button>
        <button type="button" class="btn btn-outline-dark pull-right" id="cancel_btn" onclick="cancelChanges(\'${comment._id}\')">
            Cancel
        </button>
        </div>
    `
    document.getElementById(comment._id).appendChild(form)
}

function cancelChanges(id) {
    document.getElementById("changeCmt").remove();
    var time = document.getElementById(id).querySelector('.comment-footer');
    time.style.display = "block";
    var content = document.getElementById(id).querySelector('p');
    content.style.display = "block";
}

function deleteComment(comment) {
    $('#confirmDel').modal('show');
    $('#confirmDel_btn').click(function(){
        $.ajax({
            url: `/products/${comment.productId}/deletecmt`,
            type: "POST",
            data: {
                _id: comment._id, 
                productId: comment.productId,
            },
            dataType: "json",
        });
        location.reload();
    });
    // $(`#comment_no${index}`).remove();
}
