$(function () {

  $('[data-toggle="tooltip"]').tooltip()

  $('#permissionCb').change(function() {
    if($(this).is(":checked")) {
      $('#permField').val("Permission Granted");
    } else {
      $('#permField').val("Permission Not Granted");
    }
    console.log("permField value=" + $('#permField').val())
  })

  drawDiamond();

})
