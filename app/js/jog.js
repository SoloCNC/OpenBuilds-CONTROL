var allowContinuousJog = false;
var continuousJogRunning = false;
var jogdist = 10;
var safeToUpdateSliders = true;


function mmtoinchrate() {
  var value = $('#jograte').val();
  var convert = "";
  convert = (value / 25.4).toFixed(2); //converts the value of input(mm) to inch;
  $("#jograteinch").val(convert);
}

function inchtommrate() {
  var value = $('#jograteinch').val();
  var convert = "";
  convert = (value * 25.4).toFixed(2); //converts the value of input(mm) to inch;
  $("#jograte").val(convert);
}


function mmMode() {
  unit = "mm";
  localStorage.setItem('unitsMode', unit);
  $('#dist01label').html('0.1mm')
  $('#dist1label').html('1mm')
  $('#dist10label').html('10mm')
  $('#dist100label').html('100mm')
  if (jogdist == 0.254) {
    jogdist = 0.1
  }
  if (jogdist == 2.54) {
    jogdist = 1
  }
  if (jogdist == 25.4) {
    jogdist = 10
  }
  if (jogdist == 254) {
    jogdist = 100
  }
  $('#jogratemmdiv').show()
  $('#jograteinchdiv').hide()
  inchtommrate();
}

function inMode() {
  unit = "in";
  localStorage.setItem('unitsMode', unit);
  $('#dist01label').html('0.01"')
  $('#dist1label').html('0.1"')
  $('#dist10label').html('1"')
  $('#dist100label').html('10"')
  if (jogdist == 0.1) {
    jogdist = 0.254
  }
  if (jogdist == 1) {
    jogdist = 2.54
  }
  if (jogdist == 10) {
    jogdist = 25.4
  }
  if (jogdist == 100) {
    jogdist = 254
  }
  $('#jogratemmdiv').hide()
  $('#jograteinchdiv').show()
  mmtoinchrate()
}

function cancelJog() {
  socket.emit('stop', true)
  continuousJogRunning = false;
}


$(document).ready(function() {

  if (localStorage.getItem('continuousJog')) {
    if (JSON.parse(localStorage.getItem('continuousJog')) == true) {
      $('#jogTypeContinuous').prop('checked', true)
      allowContinuousJog = true;
      $('.distbtn').hide()
    } else {
      $('#jogTypeContinuous').prop('checked', false)
      allowContinuousJog = false;
      $('.distbtn').show();
    }
  }

  $('#jogTypeContinuous').on('click', function() {
    if ($(this).is(':checked')) {
      localStorage.setItem('continuousJog', true);
      allowContinuousJog = true;
      $('.distbtn').hide();
    } else {
      localStorage.setItem('continuousJog', false);
      allowContinuousJog = false;
      $('.distbtn').show();
    }
    // console.log(document.activeElement)
    document.activeElement.blur();
  });

  if (localStorage.getItem('unitsMode')) {
    if (localStorage.getItem('unitsMode') == "mm") {
      mmMode()
      $('#mmMode').click()
    } else if (localStorage.getItem('unitsMode') == "in") {
      inMode();
      $('#inMode').click()
    }
  } else {
    // default to inches
    inMode();
    $('#inMode').click()
  }

  $("#jograte").keyup(function() {
    mmtoinchrate()
  });

  $("#jograteinch").keyup(function() {
    inchtommrate()
  });

  $("#jograte").on("keypress", function(e) {
    if (e.which == 13) {
      $("#jograte").blur();
    }
  })

  $("#jograteinch").on("keypress", function(e) {
    if (e.which == 13) {
      $("#jograte").blur();
    }
  })

  $(document).mousedown(function(e) {
    safeToUpdateSliders = false;
  }).mouseup(function(e) {
    safeToUpdateSliders = true;
  }).mouseleave(function(e) {
    safeToUpdateSliders = true;
  });

  $("#xPosDro").click(function() {
    $("#xPos").hide()
    if (unit == "mm") {
      $("#xPosInput").show().focus().val(laststatus.machine.position.work.x)
    } else if (unit == "in") {
      $("#xPosInput").show().focus().val((laststatus.machine.position.work.x / 25.4).toFixed(2))
    }
  });

  $("#xPosInput").blur(function() {
    $("#xPos").show()
    $("#xPosInput").hide()
  });

  $('#xPosInput').on('keypress', function(e) {
    if (e.which === 13) {
      //Disable textbox to prevent multiple submit
      $(this).attr("disabled", "disabled");
      $("#xPos").show()
      $("#xPosInput").hide()
      //Enable the textbox again if needed.
      $(this).removeAttr("disabled");
      if (unit == "mm") {
        sendGcode("$J=G90 G21 X" + $("#xPosInput").val() + " F" + $('#jograte').val());
      } else if (unit == "in") {
        sendGcode("$J=G90 G20 X" + $("#xPosInput").val() + " F" + $('#jograteinch').val());
      }
    }
  });

  $("#yPosDro").click(function() {
    $("#yPos").hide()
    if (unit == "mm") {
      $("#yPosInput").show().focus().val(laststatus.machine.position.work.y)
    } else if (unit == "in") {
      $("#yPosInput").show().focus().val((laststatus.machine.position.work.y / 25.4).toFixed(2))
    }
  });

  $("#yPosInput").blur(function() {
    $("#yPos").show()
    $("#yPosInput").hide()
  });

  $('#yPosInput').on('keypress', function(e) {
    if (e.which === 13) {
      //Disable textbox to prevent multiple submit
      $(this).attr("disabled", "disabled");
      $("#yPos").show()
      $("#yPosInput").hide()
      //Enable the textbox again if needed.
      $(this).removeAttr("disabled");
      if (unit == "mm") {
        sendGcode("$J=G90 G21 Y" + $("#yPosInput").val() + " F" + $('#jograte').val());
      } else if (unit == "in") {
        sendGcode("$J=G90 G20 Y" + $("#yPosInput").val() + " F" + $('#jograteinch').val());
      }
    }
  });

  $("#zPosDro").click(function() {
    $("#zPos").hide()
    if (unit == "mm") {
      $("#zPosInput").show().focus().val(laststatus.machine.position.work.z)
    } else if (unit == "in") {
      $("#zPosInput").show().focus().val((laststatus.machine.position.work.z / 25.4).toFixed(2))
    }
  });

  $("#zPosInput").blur(function() {
    $("#zPos").show()
    $("#zPosInput").hide()
  });

  $('#zPosInput').on('keypress', function(e) {
    if (e.which === 13) {
      //Disable textbox to prevent multiple submit
      $(this).attr("disabled", "disabled");
      $("#zPos").show()
      $("#zPosInput").hide()
      //Enable the textbox again if needed.
      $(this).removeAttr("disabled");
      if (unit == "mm") {
        sendGcode("$J=G90 G21 Z" + $("#zPosInput").val() + " F" + $('#jograte').val());
      } else if (unit == "in") {
        sendGcode("$J=G90 G20 Z" + $("#zPosInput").val() + " F" + $('#jograteinch').val());
      }
    }
  });


  $('#dist01').on('click', function(ev) {
    if (unit == "mm") {
      jogdist = 0.1;
    } else if (unit == "in") {
      jogdist = 0.254;
    }
    $('.distbtn').removeClass('bd-openbuilds')
    $('#dist01').addClass('bd-openbuilds')
    $('.jogdist').removeClass('fg-openbuilds')
    $('.jogdist').addClass('fg-gray')
    $('#dist01label').removeClass('fg-gray')
    $('#dist01label').addClass('fg-openbuilds')
  })

  $('#dist1').on('click', function(ev) {
    if (unit == "mm") {
      jogdist = 1;
    } else if (unit == "in") {
      jogdist = 2.54;
    }
    $('.distbtn').removeClass('bd-openbuilds')
    $('#dist1').addClass('bd-openbuilds')
    $('.jogdist').removeClass('fg-openbuilds')
    $('.jogdist').addClass('fg-gray')
    $('#dist1label').removeClass('fg-gray')
    $('#dist1label').addClass('fg-openbuilds')
  })

  $('#dist10').on('click', function(ev) {
    if (unit == "mm") {
      jogdist = 10;
    } else if (unit == "in") {
      jogdist = 25.4;
    }
    $('.distbtn').removeClass('bd-openbuilds')
    $('#dist10').addClass('bd-openbuilds')
    $('.jogdist').removeClass('fg-openbuilds')
    $('.jogdist').addClass('fg-gray')
    $('#dist10label').removeClass('fg-gray')
    $('#dist10label').addClass('fg-openbuilds')
  })

  $('#dist100').on('click', function(ev) {
    if (unit == "mm") {
      jogdist = 100;
    } else if (unit == "in") {
      jogdist = 254.0;
    }
    $('.distbtn').removeClass('bd-openbuilds')
    $('#dist100').addClass('bd-openbuilds')
    $('.jogdist').removeClass('fg-openbuilds')
    $('.jogdist').addClass('fg-gray')
    $('#dist100label').removeClass('fg-gray')
    $('#dist100label').addClass('fg-openbuilds')
  })

  $('#dist500').on('click', function(ev) {
    jogdist = 500;
    $('.distbtn').removeClass('bd-openbuilds')
    $('#dist500').addClass('bd-openbuilds')
    $('.jogdist').removeClass('fg-openbuilds')
    $('.jogdist').addClass('fg-gray')
    $('#dist500label').removeClass('fg-gray')
    $('#dist500label').addClass('fg-openbuilds')
  })

  $('#gotozeroWPos').on('click', function(ev) {
    sendGcode('G21 G90');
    sendGcode('G0 Z5');
    sendGcode('G0 X0 Y0');
    sendGcode('G0 Z0');
  });

  $('#gotoXzeroMpos').on('click', function(ev) {
    if (grblParams['$22'] == 1) {
      sendGcode('G53 G0 X-' + grblParams["$27"]);
    } else {
      sendGcode('G53 G0 X0');
    }
  });

  $('#gotoYzeroMpos').on('click', function(ev) {
    if (grblParams['$22'] == 1) {
      sendGcode('G53 G0 Y-' + grblParams["$27"]);
    } else {
      sendGcode('G53 G0 Y0');
    }
  });

  $('#gotoZzeroMpos').on('click', function(ev) {
    if (grblParams['$22'] == 1) {
      sendGcode('G53 G0 Z-' + grblParams["$27"]);
    } else {
      sendGcode('G53 G0 Z0');
    }
  });

  $('#gotozeroZmPosXYwPos').on('click', function(ev) {
    if (grblParams['$22'] == 1) {
      sendGcode('G53 G0 Z-' + grblParams["$27"]);
    } else {
      sendGcode('G53 G0 Z0');
    }
    sendGcode('G0 X0 Y0');
    sendGcode('G0 Z0');
  });

  $('#gotozeroMPos').on('click', function(ev) {
    if (grblParams['$22'] == 1) {
      sendGcode('G53 G0 Z-' + grblParams["$27"]);
      sendGcode('G53 G0 X-' + grblParams["$27"] + ' Y-' + grblParams["$27"]);
    } else {
      sendGcode('G53 G0 Z0');
      sendGcode('G53 G0 X0 Y0');
    }


  });


  // $('.xM').on('click', function(ev) {
  //   if (!allowContinuousJog) {
  //     var dir = 'X-';
  //     var feedrate = $('#jograte').val();
  //     jog('X', '-' + jogdist, feedrate);
  //   }
  //   $('#runNewProbeBtn').addClass("disabled")
  //   $('#confirmNewProbeBtn').removeClass("disabled")
  // })
  //
  // $('.xP').on('click', function(ev) {
  //   if (!allowContinuousJog) {
  //     var dir = 'X-';
  //     var feedrate = $('#jograte').val();
  //     jog('X', jogdist, feedrate);
  //   }
  //   $('#runNewProbeBtn').addClass("disabled")
  //   $('#confirmNewProbeBtn').removeClass("disabled")
  // })
  //
  // $('.yM').on('click', function(ev) {
  //   if (!allowContinuousJog) {
  //     var dir = 'X-';
  //     var feedrate = $('#jograte').val();
  //     jog('Y', '-' + jogdist, feedrate);
  //   }
  //   $('#runNewProbeBtn').addClass("disabled")
  //   $('#confirmNewProbeBtn').removeClass("disabled")
  // })
  //
  // $('.yP').on('click', function(ev) {
  //   if (!allowContinuousJog) {
  //     var dir = 'X-';
  //     var feedrate = $('#jograte').val();
  //     jog('Y', jogdist, feedrate);
  //   }
  //   $('#runNewProbeBtn').addClass("disabled")
  //   $('#confirmNewProbeBtn').removeClass("disabled")
  // })
  //
  // $('.zM').on('click', function(ev) {
  //   if (!allowContinuousJog) {
  //     var dir = 'X-';
  //     var feedrate = $('#jograte').val();
  //     jog('Z', '-' + jogdist, feedrate);
  //   }
  //   $('#runNewProbeBtn').addClass("disabled")
  //   $('#confirmNewProbeBtn').removeClass("disabled")
  // })
  //
  // $('.zP').on('click', function(ev) {
  //   if (!allowContinuousJog) {
  //     var dir = 'X-';
  //     var feedrate = $('#jograte').val();
  //     jog('Z', jogdist, feedrate);
  //   }
  //   $('#runNewProbeBtn').addClass("disabled")
  //   $('#confirmNewProbeBtn').removeClass("disabled")
  // })

  $('.xM').on('touchstart mousedown', function(ev) {
    ev.preventDefault();
    if (allowContinuousJog) { // startJog();
      var direction = "X-";
      var distance = 1000;

      if (Object.keys(grblParams).length > 0) {
        if (parseInt(grblParams.$20) == 1) {
          // Soft Limits is enabled so lets calculate maximum move distance
          var mindistance = parseInt(grblParams.$130)
          var maxdistance = 0; // Grbl all negative coordinates
          // Negative move:
          distance = (mindistance + (parseInt(laststatus.machine.position.offset.x) + parseInt(laststatus.machine.position.work.x))) - 1
        }
      }
      var feed = $('#jograte').val();
      socket.emit('runCommand', "$J=G91 G21 " + direction + distance + " F" + feed + "\n");
      continuousJogRunning = true;
      $('.xM').click();
    } else {
      var feedrate = $('#jograte').val();
      jog('X', '-' + jogdist, feedrate);
    }
    $('#runNewProbeBtn').addClass("disabled")
    $('#confirmNewProbeBtn').removeClass("disabled")
  });
  $('.xM').on('touchend mouseup', function(ev) {
    ev.preventDefault();
    if (allowContinuousJog) {
      cancelJog()
    }
  });

  $('.xP').on('touchstart mousedown', function(ev) {
    // console.log("xp down")
    ev.preventDefault();
    if (allowContinuousJog) { // startJog();
      var direction = "X";
      var distance = 1000;
      if (Object.keys(grblParams).length > 0) {
        if (parseInt(grblParams.$20) == 1) {
          // Soft Limits is enabled so lets calculate maximum move distance
          var mindistance = parseInt(grblParams.$130)
          var maxdistance = 0; // Grbl all negative coordinates
          // Positive move:
          distance = (maxdistance - (parseInt(laststatus.machine.position.offset.x) + parseInt(laststatus.machine.position.work.x))) - 1
        }
      }
      var feed = $('#jograte').val();
      socket.emit('runCommand', "$J=G91 G21 " + direction + distance + " F" + feed + "\n");
      continuousJogRunning = true;
      $('.xP').click();
    } else {
      var feedrate = $('#jograte').val();
      jog('X', jogdist, feedrate);
    }
    $('#runNewProbeBtn').addClass("disabled")
    $('#confirmNewProbeBtn').removeClass("disabled")
  });
  $('.xP').on('touchend mouseup', function(ev) {
    // console.log("xp up")
    ev.preventDefault();
    if (allowContinuousJog) {
      cancelJog()
    }
  });

  $('.yM').on('touchstart mousedown', function(ev) {
    ev.preventDefault();
    if (allowContinuousJog) { // startJog();
      var direction = "Y-";
      var distance = 1000;

      if (Object.keys(grblParams).length > 0) {
        if (parseInt(grblParams.$20) == 1) {
          // Soft Limits is enabled so lets calculate maximum move distance
          var mindistance = parseInt(grblParams.$131)
          var maxdistance = 0; // Grbl all negative coordinates
          // Negative move:
          distance = (mindistance + (parseInt(laststatus.machine.position.offset.y) + parseInt(laststatus.machine.position.work.y))) - 1
        }
      }

      var feed = $('#jograte').val();
      socket.emit('runCommand', "$J=G91 G21 " + direction + distance + " F" + feed + "\n");
      continuousJogRunning = true;
      $('.yM').click();
    } else {
      var feedrate = $('#jograte').val();
      jog('Y', '-' + jogdist, feedrate);
    }
    $('#runNewProbeBtn').addClass("disabled")
    $('#confirmNewProbeBtn').removeClass("disabled")
  });
  $('.yM').on('touchend mouseup', function(ev) {
    ev.preventDefault();
    if (allowContinuousJog) {
      cancelJog()
    }
  });

  $('.yP').on('touchstart mousedown', function(ev) {
    ev.preventDefault();
    if (allowContinuousJog) { // startJog();
      var direction = "Y";
      var distance = 1000;

      if (Object.keys(grblParams).length > 0) {
        if (parseInt(grblParams.$20) == 1) {
          // Soft Limits is enabled so lets calculate maximum move distance
          var mindistance = parseInt(grblParams.$131)
          var maxdistance = 0; // Grbl all negative coordinates
          // Positive move:
          distance = (maxdistance - (parseInt(laststatus.machine.position.offset.y) + parseInt(laststatus.machine.position.work.y))) - 1
        }
      }

      var feed = $('#jograte').val();
      socket.emit('runCommand', "$J=G91 G21 " + direction + distance + " F" + feed + "\n");
      continuousJogRunning = true;
      $('#yP').click();
    } else {
      var feedrate = $('#jograte').val();
      jog('Y', jogdist, feedrate);
    }
    $('#runNewProbeBtn').addClass("disabled")
    $('#confirmNewProbeBtn').removeClass("disabled")
  });
  $('.yP').on('touchend mouseup', function(ev) {
    ev.preventDefault();
    if (allowContinuousJog) {
      cancelJog()
    }
  });

  $('.zM').on('touchstart mousedown', function(ev) {
    ev.preventDefault();
    if (allowContinuousJog) { // startJog();
      var direction = "Z-";
      var distance = 1000;

      if (Object.keys(grblParams).length > 0) {
        if (parseInt(grblParams.$20) == 1) {
          // Soft Limits is enabled so lets calculate maximum move distance
          var mindistance = parseInt(grblParams.$132)
          var maxdistance = 0; // Grbl all negative coordinates
          // Negative move:
          distance = (mindistance + (parseInt(laststatus.machine.position.offset.z) + parseInt(laststatus.machine.position.work.z))) - 1
        }
      }

      var feed = $('#jograte').val();
      socket.emit('runCommand', "$J=G91 G21 " + direction + distance + " F" + feed + "\n");
      continuousJogRunning = true;
      $('.zM').click();
    } else {
      var feedrate = $('#jograte').val();
      jog('Z', '-' + jogdist, feedrate);
    }
    $('#runNewProbeBtn').addClass("disabled")
    $('#confirmNewProbeBtn').removeClass("disabled")
  });
  $('.zM').on('touchend mouseup', function(ev) {
    ev.preventDefault();
    if (allowContinuousJog) {
      cancelJog()
    }
  });

  $('.zP').on('touchstart mousedown', function(ev) {
    ev.preventDefault();
    if (allowContinuousJog) { // startJog();
      var direction = "Z";
      var distance = 1000;

      if (Object.keys(grblParams).length > 0) {
        if (parseInt(grblParams.$20) == 1) {
          // Soft Limits is enabled so lets calculate maximum move distance
          var mindistance = parseInt(grblParams.$132)
          var maxdistance = 0; // Grbl all negative coordinates
          // Positive move:
          distance = (maxdistance - (parseInt(laststatus.machine.position.offset.z) + parseInt(laststatus.machine.position.work.z))) - 1
        }
      }

      var feed = $('#jograte').val();
      socket.emit('runCommand', "$J=G91 G21 " + direction + distance + " F" + feed + "\n");
      continuousJogRunning = true;
      $('.zP').click();
    } else {
      var feedrate = $('#jograte').val();
      jog('Z', jogdist, feedrate);
    }
    $('#runNewProbeBtn').addClass("disabled")
    $('#confirmNewProbeBtn').removeClass("disabled")
  });
  $('.zP').on('touchend mouseup', function(ev) {
    ev.preventDefault();
    if (allowContinuousJog) {
      cancelJog()
    }
  });


  $('#homeBtn').on('click', function(ev) {
    home();
  })

  $('#chkSize').on('click', function() {
    var bbox2 = new THREE.Box3().setFromObject(object);
    console.log('bbox for Draw Bounding Box: ' + object + ' Min X: ', (bbox2.min.x), '  Max X:', (bbox2.max.x), 'Min Y: ', (bbox2.min.y), '  Max Y:', (bbox2.max.y));
    var feedrate = $('#jograte').val();
    if (laststatus.machine.firmware.type === 'grbl') {
      var moves = `
        $J=G90G21X` + (bbox2.min.x) + ` Y` + (bbox2.min.y) + ` F` + feedrate + `\n
        $J=G90G21X` + (bbox2.max.x) + ` Y` + (bbox2.min.y) + ` F` + feedrate + `\n
        $J=G90G21X` + (bbox2.max.x) + ` Y` + (bbox2.max.y) + ` F` + feedrate + `\n
        $J=G90G21X` + (bbox2.min.x) + ` Y` + (bbox2.max.y) + ` F` + feedrate + `\n
        $J=G90G21X` + (bbox2.min.x) + ` Y` + (bbox2.min.y) + ` F` + feedrate + `\n
        `;
    } else {
      var moves = `
       G90\n
       G0 X` + (bbox2.min.x) + ` Y` + (bbox2.min.y) + ` F` + feedrate + `\n
       G0 X` + (bbox2.max.x) + ` Y` + (bbox2.min.y) + ` F` + feedrate + `\n
       G0 X` + (bbox2.max.x) + ` Y` + (bbox2.max.y) + ` F` + feedrate + `\n
       G0 X` + (bbox2.min.x) + ` Y` + (bbox2.max.y) + ` F` + feedrate + `\n
       G0 X` + (bbox2.min.x) + ` Y` + (bbox2.min.y) + ` F` + feedrate + `\n
       G90\n`;
    }
    socket.emit('runJob', {
      data: moves,
      isJob: false,
      fileName: ""
    });
  });

});

function changeStepSize(dir) {
  if (jogdist == 0.1 || jogdist == 0.254) {
    if (dir == 1) {
      jogdist = 1;
      $('.distbtn').removeClass('bd-openbuilds')
      $('#dist1').addClass('bd-openbuilds')
      $('.jogdist').removeClass('fg-openbuilds')
      $('.jogdist').addClass('fg-gray')
      $('#dist1label').removeClass('fg-gray')
      $('#dist1label').addClass('fg-openbuilds')
    }
    if (dir == -1) {
      // do nothing
    }
  } else if (jogdist == 1 || jogdist == 2.54) {
    if (dir == 1) {
      jogdist = 10;
      $('.distbtn').removeClass('bd-openbuilds')
      $('#dist10').addClass('bd-openbuilds')
      $('.jogdist').removeClass('fg-openbuilds')
      $('.jogdist').addClass('fg-gray')
      $('#dist10label').removeClass('fg-gray')
      $('#dist10label').addClass('fg-openbuilds')
    }
    if (dir == -1) {
      jogdist = 0.1;
      $('.distbtn').removeClass('bd-openbuilds')
      $('#dist01').addClass('bd-openbuilds')
      $('.jogdist').removeClass('fg-openbuilds')
      $('.jogdist').addClass('fg-gray')
      $('#dist01label').removeClass('fg-gray')
      $('#dist01label').addClass('fg-openbuilds')
    }
  } else if (jogdist == 10 || jogdist == 25.4) {
    if (dir == 1) {
      jogdist = 100;
      $('.distbtn').removeClass('bd-openbuilds')
      $('#dist100').addClass('bd-openbuilds')
      $('.jogdist').removeClass('fg-openbuilds')
      $('.jogdist').addClass('fg-gray')
      $('#dist100label').removeClass('fg-gray')
      $('#dist100label').addClass('fg-openbuilds')
    }
    if (dir == -1) {
      jogdist = 1;
      $('.distbtn').removeClass('bd-openbuilds')
      $('#dist1').addClass('bd-openbuilds')
      $('.jogdist').removeClass('fg-openbuilds')
      $('.jogdist').addClass('fg-gray')
      $('#dist1label').removeClass('fg-gray')
      $('#dist1label').addClass('fg-openbuilds')
    }
  } else if (jogdist == 100 || jogdist == 254) {
    if (dir == 1) {
      // do nothing
    }
    if (dir == -1) {
      jogdist = 10;
      $('.distbtn').removeClass('bd-openbuilds')
      $('#dist10').addClass('bd-openbuilds')
      $('.jogdist').removeClass('fg-openbuilds')
      $('.jogdist').addClass('fg-gray')
      $('#dist10label').removeClass('fg-gray')
      $('#dist10label').addClass('fg-openbuilds')
    }
  }

}

function jog(dir, dist, feed = null) {
  if (feed) {
    socket.emit('jog', dir + ',' + dist + ',' + feed);
  } else {
    socket.emit('jog', dir + ',' + dist);
  }
}

function jogXY(xincrement, yincrement, feed = null) {
  var data = {
    x: xincrement,
    y: yincrement,
    feed: feed
  }
  socket.emit('jogXY', data);
}

function home() {
  if (laststatus != undefined && laststatus.machine.firmware.type == 'grbl') {
    sendGcode('$H')
  } else if (laststatus != undefined && laststatus.machine.firmware.type == 'smoothie') {
    sendGcode('G28')
  }
}