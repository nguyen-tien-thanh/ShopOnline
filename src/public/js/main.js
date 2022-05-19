
//=================== ARROW IN INDEX =============================
  $(document).ready(function($) {
    
    $('.login-section').hide();
    $('#move-to-login-section').click(function(){
        $('.register-sidenav').animate({
            left: '0',
        });
        $('.register-section').animate({
            opacity: 0,
            height: 'hide'
        })
        $('.login-sidenav').animate({
            right: '0',
        });
        $('.login-section').animate({
            height: 'show',
            opacity: 1,
        });
    })

    $('#move-to-register-section').click(function(){
        $('.login-sidenav').animate({
            left: '0',
        });
        $('.login-section').animate({
            opacity: 0,
            height: 'hide'
        })
        $('.register-sidenav').animate({
            left: '60%',
        });
        $('.register-section').animate({
            height: 'show',
            opacity: 1,
        });
    })

    $(window).on('scroll', function() {
      //ADD .TIGHT
      if ($(window).scrollTop() + $(window).height() > $('.wrapper').outerHeight()) {
        $('body').addClass('tight');
        $('.arrow').hide();
      } else {
        $('body').removeClass('tight');
        $('.arrow').show();
      }
    });

    //BACK TO PRESENTATION MODE
    $("html").on("click", "body.tight .wrapper", function() {
      $('html, body').animate({
        scrollTop: $('.wrapper').outerHeight() - $(window).height()
      }, 500);
    });
  });

  $('.arrow').click(function(){
    $("html").animate({ scrollTop: $('html').prop("scrollHeight")}, 1200);
  });

//==================== MODAL OF Delivery ===========================
var deliveryModal = document.getElementById("delivery-modal");
var deliveryBtn = document.getElementById("delivery-btn");
var deliverySpan = document.getElementsByClassName("delivery-close")[0];
if(deliveryBtn){
  deliveryBtn.onclick = function() {
    deliveryModal.style.display = "block";
  }
  deliverySpan.onclick = function() {
    deliveryModal.style.display = "none";
  }
}

//==================== MODAL OF Payment ===========================
var paymentModal = document.getElementById("payment-modal");
var paymentBtn = document.getElementById("payment-btn");
var paymentSpan = document.getElementsByClassName("payment-close")[0];
if(paymentBtn){
  paymentBtn.onclick = function() {
    paymentModal.style.display = "block";
  }
  paymentSpan.onclick = function() {
    paymentModal.style.display = "none";
  }
}

//==================== MODAL OF RETURN ===========================
var returnModal = document.getElementById("return-modal");
var returnBtn = document.getElementById("return-btn");
var returnSpan = document.getElementsByClassName("return-close")[0];
if(returnBtn){
  returnBtn.onclick = function() {
    returnModal.style.display = "block";
  }

  returnSpan.onclick = function() {
    returnModal.style.display = "none";
  }
}

window.onclick = function(event) {
  if (event.target == paymentModal || event.target == deliveryModal || event.target == returnModal) {
    paymentModal.style.display = "none";
    deliveryModal.style.display = "none";
    returnModal.style.display = "none";
  }
}

//==================== COPY PAYMENT NUMBER ID =================
function CopyToClipboard(id){
  var r = document.createRange();
  r.selectNode(document.getElementById(id));
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(r);
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
}

// Toggle between adding and removing the "responsive" class to main-header when the user clicks on the icon 
function openNavResponsive() {
  var x = document.getElementById("main-header");
  if (x.className === "main-header") {
    x.className += " responsive";
  } else {
    x.className = "main-header";
  }
}

//=================== SET TOKEN FROM LOGIN =============================
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function login(){
  $.ajax({
      url: '/login',
      type: 'post',
      data: {
          username: $('#username').val(),
          password: $('#password').val(),
      },
      msg: ''
  }
  ).then(data => {
      if (data.success) {
          setCookie('token', data.token, 1);
          window.location.href = "/admin"
      } else {
          window.location.href = "/login"
      }

  }).catch(err => {
      console.log(err)
  })
}

function logout() {
  $.ajax({
      url: '/logout',
      type: 'post',
  }
  ).then(data => {
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/login"
  }).catch(err => {
      console.log(err)
  })
}


//=================== /admin/product-table ================================
//WHEN HTML DOM is loaded, Delete confirm shows
  document.addEventListener('DOMContentLoaded', function(){
      var productId;
      var deleteForm = document.forms['delete-product-form'];

      $('#delete-product').on('show.bs.modal', function (event) {
          var button = $(event.relatedTarget)
          productId = button.data('id')
      })

      //When delete product btn clicked
      var btnDeleteCategory = document.getElementById('btn-delete-product')
      btnDeleteCategory.onclick = function(){
          deleteForm.action = '/product/' + productId + '?_method=DELETE';
          deleteForm.submit();
      }
  })
  function Back()
  {
      history.back();
  }