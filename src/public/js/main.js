

 $(document).ready(function($) {

  // ====================== Add input field in /admin/shoe-table ============================
  var i = 1;
  $(".add-size-btn").click(function() {
    $("#size-fields").append('<div valign="top" class="input-group col-xs-3"><input type="number" class="form-control" id="param-size-number' + i + '" name="size[' + i + '][number]" placeholder="Size number" required /><input type="number" class="form-control input-stock-size" id="param-size-stock' + i + '" name="size[' + i + '][stock]" value="" placeholder="Stock" onkeyup="getTotalStockOfSize()" required/><a href="javascript:void(0);" class="removeSizeBtn btn btn-danger"><i class="fa fa-minus"></i></a></div>');
    i++;
  });
  $("#size-fields").on('click', '.removeSizeBtn', function() {
    $(this).parent().remove();
  });

  //=================== ARROW IN INDEX =============================
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
    $("html").animate({ scrollTop: $('html').prop("scrollHeight")}, 200);
  });

  $('.btn-info-scroll').click(function(){
    $("html").animate({ scrollTop: $('html').prop("scrollHeight")}, 200);
  });

  // ======================== Button to change section ==========================
  $('[data-switch]').on('click', function (e) {
    var $page = $('#shoe-sections-index'),
        blockToShow = e.currentTarget.getAttribute('data-switch');
    $('[data-switch]').attr('class','')
    e.currentTarget.setAttribute('class','active');
    // Hide all children.
    $page.children().hide();
    // And show the requested component.
    $page.children(blockToShow).show();
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
  })
  .then(data => {
      if (data.success) {
          setCookie('token', data.token, 1);
          window.location.href = "/"
      } else {
          // alert('ajax error:' + data.msg)
          window.location.href = "/login"
      }
  })
  .catch(err => {
      console.log(err)
  })
}

function logout() {
  $.ajax({
      url: '/logout',
      type: 'post',
  })
  .then(data => {
      document.cookie = data +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.href = "/login"
  })
  .catch(err => {
      console.log(err)
  })
}


// Show the total quantity from stocks /admin/shoe-table
function getTotalStockOfSize(){
  var arr = document.getElementsByClassName('input-stock-size');
    var total=0;
    for(var i=0;i<arr.length;i++){
        if(parseInt(arr[i].value))
            total += parseInt(arr[i].value);
    }
    $('#size-input').html('<label for="shoe-quantity" class="col-form-label">Total Quantity Of Shoe: <b id="total">'+total+'</b></label><input hidden id="edit-shoe-quantity" name="quantity" value="'+total+'">')
}

//=================== /admin/product-table ================================
//WHEN HTML DOM is loaded, Delete product confirm shows
  document.addEventListener('DOMContentLoaded', function(){
      var productId;
      var deleteProductForm = document.forms['delete-product-form'];
      var restoreForm = document.forms['restore-product-form'];

      $('#delete-product').on('show.bs.modal', function (event) {
          var button = $(event.relatedTarget)
          productId = button.data('id')
      })

      //When delete product btn clicked
      var btnDeleteCategory = document.getElementById('btn-delete-product')
      if(btnDeleteCategory){
        btnDeleteCategory.onclick = function(){
          deleteProductForm.action = '/product/' + productId + '?_method=DELETE';
          deleteProductForm.submit();
        }
      }

      //When button delete clicked
      $('#delete-product').on('show.bs.modal', function (product) {
        var button = $(product.relatedTarget)
        productId = button.data('id')
        })
        var btnDeleteProduct = document.getElementById('btn-delete-product')
        if (btnDeleteProduct){
          btnDeleteProduct.onclick = function(){
            deleteProductForm.action = '/product/' + productId + '/force?_method=DELETE';
            deleteProductForm.submit();
          }
        }
        //When button restore clicked
        $('#restore-product').on('show.bs.modal', function (product) {
        var button = $(product.relatedTarget)
        productId = button.data('id')
        })
        var btnRestoreProduct = document.getElementById('btn-restore-product')
        if (btnRestoreProduct){
          btnRestoreProduct.onclick = function(){
            restoreForm.action = '/product/' + productId + '/restore?_method=PATCH';
            restoreForm.submit();
          }
        }

//=================== /admin/brand-table ================================
        //Delete brand
        var brandId;
        var deleteBrandForm = document.forms['delete-brand-form'];

        $('#delete-brand').on('show.bs.modal', function (event) {
          var button = $(event.relatedTarget)
          brandId = button.data('id')
        })

        //When delete brand btn clicked
        var btnDeleteCategory = document.getElementById('btn-delete-brand')
        if(btnDeleteCategory){
          btnDeleteCategory.onclick = function(){
            deleteBrandForm.action = '/brand/' + brandId + '?_method=DELETE';
            deleteBrandForm.submit();
          }
        }

        // Get ID of brand to modal for editing
        $(document).on("click", ".open-modal-edit-brand", function () {
        var brandId = $(this).data('id');
        var brandName = $('#' + brandId + '-name').text();
        var brandDesc = $('#' + brandId + '-desc').text();
        // var brandImage = document.getElementById(brandId + '-image').getAttribute('alt')

        $('#edit-brand-name').attr('value', brandName);
        document.getElementById('edit-brand-desc').value = brandDesc;
        document.getElementById('editBrandLabel').innerHTML = 'Edit brand <b> '+brandName+'</b>';
        // document.getElementById('edit-brand-image').value = brandImage;
          
        var btnEditBrand = document.getElementById('btn-edit-brand')
        var editBrandForm = document.forms['edit-brand-form'];
        btnEditBrand.onclick = function(){
            editBrandForm.action = '/brand/' + brandId + '?_method=PUT';
            editBrandForm.submit();
        }
      });
        
//================== /admin/brand-deleted-table ==========================
        //Restore brand
        var brandDeletedId;
        var restoreBrandForm = document.forms['restore-brand-form']
        $('#restore-brand').on('show.bs.modal', function (brand) {
          var button = $(brand.relatedTarget)
          brandDeletedId = button.data('id')
          })
          var btnRestoreBrand = document.getElementById('btn-restore-brand')
          if (btnRestoreBrand){
            btnRestoreBrand.onclick = function(){
              restoreBrandForm.action = '/brand/' + brandDeletedId + '/restore?_method=PATCH';
              restoreBrandForm.submit();
            }
          }
          
          //Permently delete brand
          var forceDeleteBrandForm = document.forms['permantly-delete-brand-form']
          $('#force-delete-brand').on('show.bs.modal', function (brand) {
            var button = $(brand.relatedTarget)
            brandDeletedId = button.data('id')
            })
            var btnForceDeleteBrand = document.getElementById('btn-force-delete-brand')
            if (btnForceDeleteBrand){
              btnForceDeleteBrand.onclick = function(){
                forceDeleteBrandForm.action = '/brand/' + brandDeletedId + '/force?_method=DELETE';
                forceDeleteBrandForm.submit();
              }
            }
  

// ====================== CRUD /admin/shoetype-table =====================
    //Delete shoetype
    var shoetypeId;
    var deleteShoetypeForm = document.forms['delete-shoetype-form'];

    $('#delete-shoetype').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget)
      shoetypeId = button.data('id')
    })

    //When delete shoetype btn clicked
    var btnDeleteCategory = document.getElementById('btn-delete-shoetype')
    if(btnDeleteCategory){
      btnDeleteCategory.onclick = function(){
        deleteShoetypeForm.action = '/shoetype/' + shoetypeId + '?_method=DELETE';
        deleteShoetypeForm.submit();
      }
    }

    // Get ID of shoetype to modal for editing
    $(document).on("click", ".open-modal-edit-shoetype", function () {
    var shoetypeId = $(this).data('id');
    var shoetypeName = $('#' + shoetypeId + '-name').text();
    // var shoetypeImage = document.getElementById(shoetypeId + '-image').getAttribute('src')

    $('#edit-shoetype-name').attr('value', shoetypeName);
    document.getElementById('editShoetypeLabel').innerHTML = 'Edit shoetype <b> '+shoetypeName+'</b>';
    // document.getElementById('edit-shoetype-image').value = shoetypeImage;

    var btnEditShoetype = document.getElementById('btn-edit-shoetype')
    var editShoetypeForm = document.forms['edit-shoetype-form'];
    btnEditShoetype.onclick = function(){
        editShoetypeForm.action = '/shoetype/' + shoetypeId + '?_method=PUT';
        editShoetypeForm.submit();
    }
  });
    
//================== /admin/shoetype-deleted-table ==========================
    //Restore shoetype
    var shoetypeDeletedId;
    var restoreShoetypeForm = document.forms['restore-shoetype-form']
    $('#restore-shoetype').on('show.bs.modal', function (shoetype) {
      var button = $(shoetype.relatedTarget)
      shoetypeDeletedId = button.data('id')
      })
      var btnRestoreShoetype = document.getElementById('btn-restore-shoetype')
      if (btnRestoreShoetype){
        btnRestoreShoetype.onclick = function(){
          restoreShoetypeForm.action = '/shoetype/' + shoetypeDeletedId + '/restore?_method=PATCH';
          restoreShoetypeForm.submit();
        }
      }
      
      //Permently delete shoetype
      var forceDeleteShoetypeForm = document.forms['permantly-delete-shoetype-form']
      $('#force-delete-shoetype').on('show.bs.modal', function (shoetype) {
        var button = $(shoetype.relatedTarget)
        shoetypeDeletedId = button.data('id')
        })
        var btnForceDeleteShoetype = document.getElementById('btn-force-delete-shoetype')
        if (btnForceDeleteShoetype){
          btnForceDeleteShoetype.onclick = function(){
            forceDeleteShoetypeForm.action = '/shoetype/' + shoetypeDeletedId + '/force?_method=DELETE';
            forceDeleteShoetypeForm.submit();
          }
        }

// ====================== CRUD /admin/shoe-table =====================
    //Delete shoe
    var shoeId;
    var deleteShoeForm = document.forms['delete-shoe-form'];

    $('#delete-shoe').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget)
      shoeId = button.data('id')
    })

    //When delete shoe btn clicked
    var btnDeleteCategory = document.getElementById('btn-delete-shoe')
    if(btnDeleteCategory){
      btnDeleteCategory.onclick = function(){
        deleteShoeForm.action = '/shoe/' + shoeId + '?_method=DELETE';
        deleteShoeForm.submit();
      }
    }

    // Get ID of shoe to modal for editing
    $(document).on("click", ".open-modal-edit-shoe", function () {
      var shoeId = $(this).data('id');
      var shoeImage = document.getElementById(shoeId + '-image').getAttribute('src')
          shoeBrandName = $('#' + shoeId + '-brand-name').text(),
          shoeTypeName = $('#' + shoeId + '-type-name').text(),
          shoeName = $('#' + shoeId + '-name').text(),
          shoeColor = $('#' + shoeId + '-color').text(),
          shoePrice = $('#' + shoeId + '-price').text(),
          shoeSale = $('#' + shoeId + '-sale').text(),
          shoeQuantity = $('#' + shoeId + '-quantity').text(),
          shoeAvailable = $('#' + shoeId + '-available').text(),
          shoeBestseller = $('#' + shoeId + '-bestseller').text(),
          shoeSale = $('#' + shoeId + '-sale').text();

      document.getElementById('editShoeLabel').innerHTML = 'Edit shoe <b> '+shoeName+'</b>';
      $('#preview-image-edit').attr('src', shoeImage);

      var editBrandOptions = document.getElementsByClassName('edit-brand-options');
      for(var i=0; i<editBrandOptions.length; i++){
        if(editBrandOptions[i].innerHTML == shoeBrandName){
          var selectedOptions = editBrandOptions[i]
          selectedOptions.setAttribute('selected', 'selected')
          break;
        }
      }

      var editTypeOptions = document.getElementsByClassName('edit-type-options');
      for(var i=0; i<editTypeOptions.length; i++){
        if(editTypeOptions[i].innerHTML == shoeTypeName){
          var selectedOptions = editTypeOptions[i]
          selectedOptions.setAttribute('selected', 'selected')
          break;
        }
      }

      $('#edit-shoe-name').attr('value', shoeName);
      
      var editSaleOptions = document.getElementsByClassName('edit-color-options');
      for(var i=0; i<editSaleOptions.length; i++){
        if(editSaleOptions[i].value == shoeColor){
          var selectedOptions = editSaleOptions[i]
          selectedOptions.setAttribute('selected', 'selected')
          break;
        }
      }

      var editColorOptions = document.getElementsByClassName('edit-color-options');
      for(var i=0; i<editColorOptions.length; i++){
        if(editColorOptions[i].value == shoeColor){
          var selectedOptions = editColorOptions[i]
          selectedOptions.setAttribute('selected', 'selected')
          break;
        }
      }

      $('#edit-shoe-price').attr('value', shoePrice);
      document.getElementById('total').innerHTML = shoeQuantity;
      
      var editAvailableOptions = document.getElementsByClassName('edit-sale-options');
      for(var i=0; i<editAvailableOptions.length; i++){
        if(editAvailableOptions[i].value == shoeSale){
          var selectedOptions = editAvailableOptions[i]
          selectedOptions.setAttribute('selected', 'selected')
          break;
        }
      }
      
      var editBestsellerOptions = document.getElementsByClassName('edit-bestseller-options');
      for(var i=0; i<editBestsellerOptions.length; i++){
        if(editBestsellerOptions[i].value == shoeBestseller){
          var selectedOptions = editBestsellerOptions[i]
          selectedOptions.setAttribute('selected', 'selected')
          break;
        }
      }

      var btnEditShoe = document.getElementById('btn-edit-shoe')
      var editShoeForm = document.forms['edit-shoe-form'];
      btnEditShoe.onclick = function(){
          editShoeForm.action = '/shoe/' + shoeId + '?_method=PUT';
          editShoeForm.submit();
      }
  });
    
//================== /admin/shoe-deleted-table ==========================
    //Restore shoe
    var shoeDeletedId;
    var restoreShoeForm = document.forms['restore-shoe-form']

    $('#restore-shoe').on('show.bs.modal', function (shoe) {
      var button = $(shoe.relatedTarget)
      shoeDeletedId = button.data('id')
    })
    var btnRestoreShoe = document.getElementById('btn-restore-shoe')
    if (btnRestoreShoe){
      btnRestoreShoe.onclick = function(){
        restoreShoeForm.action = '/shoe/' + shoeDeletedId + '/restore?_method=PATCH';
        restoreShoeForm.submit();
      }
    }
      
    //Permently delete shoe
    var forceDeleteShoeForm = document.forms['permantly-delete-shoe-form']
    $('#force-delete-shoe').on('show.bs.modal', function (shoe) {
      var button = $(shoe.relatedTarget)
      shoeDeletedId = button.data('id')
    })
    var btnForceDeleteShoe = document.getElementById('btn-force-delete-shoe')
    if (btnForceDeleteShoe){
      btnForceDeleteShoe.onclick = function(){
        forceDeleteShoeForm.action = '/shoe/' + shoeDeletedId + '/force?_method=DELETE';
        forceDeleteShoeForm.submit();
      }
    }
    

})

//==================== DISPLAY ICON FOR NAVBAR RESPONSIVE =================
$('.icon-responsive').on('click', function() {
  if(document.getElementById('navbar-dropdown-items').getAttribute('style')){
    document.getElementById('navbar-dropdown-items').removeAttribute('style');
    document.getElementById('icon-nav-responsive').setAttribute('class', 'fa fa-bars')
  }
  else{
    $('#navbar-dropdown-items').attr('style', 'display: block');
    document.getElementById('icon-nav-responsive').setAttribute('class', 'fa fa-times')
  }
})


//==================== HEADER SCROLL DOWN =================
$(window).scroll(function() {    
  var scroll = $(window).scrollTop();
  if (scroll >= 5) {
      $(".main-header").addClass("header-sticky");
  }
  else {
    $(".main-header").removeClass("header-sticky");
  }
});

$(".main-header").hover(function(){
  $(this).attr('style','background: var(--clr2);box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);');
  }, function(){
  $(this).attr('style','')
});

// ================= ADD DOT TO MONEY============================
var money = document.getElementById('money-dot').innerHTML
var moneyDots = money.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
$('.money-dot-anywhere').text(moneyDots + ' VND');

// ================= /shoe/:id =============================
  // ================= OPEN UL LI SHOE DETAIL =========
$('.nav-list-items').on('click', function() {
  $('.nav-list-items').not(this).find('div').hide();
  $('.nav-list-items').not(this).find('i').attr('class', 'fa fa-plus');
  $(this).find('div').slideToggle('normal', function() {
    $(this).parent().find('i').toggleClass('fa-minus fa-plus');
  });
});

  //================= OPEN MODAL BY ELEMENT 'a' /shoe/:id=================
  var hrefAShoeDetail = document.getElementById("href-a-shoe-detail")
  if(hrefAShoeDetail){
    hrefAShoeDetail.onclick = function() {
      returnModal.style.display = "block";
    }
  }

  var moreDetail = document.getElementById("more-detail")
  if(moreDetail){
    moreDetail.onclick = function() {
      deliveryModal.style.display = "block";
    }
  }

