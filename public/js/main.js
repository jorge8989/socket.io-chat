$(function() {
  var socket = io.connect();
  var $messageForm = $("#messageForm");
  var $message = $("#message");
  var $chat = $("#chat");
  var $userForm = $("#userForm");
  var $messageArea = $("#messageArea");
  var $userFormArea = $("#userFormArea");
  var $users = $("#users");
  var $username = $("#username");
  var $sendMsgBtn = $('#send-msg-btn');

  $messageForm.submit((e) => {
    e.preventDefault();
    socket.emit('send message', $message.val());
    $message.val('');
  });

  $message.keyup((e) => {
    $sendMsgBtn.prop('disabled', $message.val().trim().length == 0);
  });

  socket.on('new message', (data) => {
    $chat.append('<div class="message"><strong>' + data.user + ':</strong> ' + data.msg + '</div>');
    $($chat).scrollTop($chat[0].scrollHeight);
  });

  socket.on('get users', (data) => {
    var html = '';
    for (i = 0; i < data.length; i++) {
      html += '<li class="list-group-item">' + data[i] + '</li>';
    }
    $users.html(html);
  });

  $userForm.submit((e) => {
    e.preventDefault();
    socket.emit('new user', $username.val(), (data) => {
      if (data) {
        $userFormArea.hide();
        $messageArea.show();
      }
    });
    $username.val('');
  });
});
