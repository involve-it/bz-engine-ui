/**
 * Created by ashot on 5/20/15.
 */

Template.bzChatId.onCreated(function() {
  var instance = this;
  //this.getMessagesData = new ReactiveVar(false);
  //friendUserId = Router.current().params.userId;
  currentUser = Meteor.user();

  instance.buttonStateDisabled = new ReactiveVar(true);
  
  //here init subscribe messages-new
  instance.subscribe('messages-new', function() {})
  
});

Template.bzChatId.onRendered(function() {
  
  var userAgent = navigator.userAgent;
  var ios = /AppleWebKit/.test(userAgent) && /Mobile\/\w+/.test(userAgent);
  var mobile = ios || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(userAgent);

  
  function resizeWinChat() {
    var $win = $(window).height(),
        headerH = $('#bz-header').outerHeight(),
        chatHeader = $('.bz-user-owner-toolbar').outerHeight(),
        chatTextInput = $('.bz-user-inputs-messages').outerHeight(),
        paddingBorder = (mobile && $(window).width() <= 640 ) ? 1 : 41;
    
    if(mobile) {
      $('#bz-footer').outerHeight(0).css('display','none');
      var footerH = 0;
    } else {
      var footerH = $('#bz-footer').outerHeight();
    }
    
    $('.bz-messages-container').css('height', ( $win - headerH - footerH - chatHeader - chatTextInput - paddingBorder) );
  }
  
  Meteor.startup(function() {
    $(window).resize(function(e) {
      resizeWinChat();
    });  
  });
  
  resizeWinChat();
  
  $.each($('textarea[data-autoresize]'), function() {
      var offset = this.offsetHeight - this.clientHeight;
      var resizeTextarea = function(el) {
          $(el).css('height', 'auto').css('height', el.scrollHeight + offset);
      };

      $(this).on('keyup input', function() {
          if(this.scrollHeight > 44) {
            resizeTextarea(this);
            
            resizeWinChat();
          }
      }).removeAttr('data-autoresize');
  });

  scrollMessages();

});

Template.bzChatId.onDestroyed(function() {
  $(window).off('resize');
});

Template.bzChatId.rendered = function () {
//todo: Don't forget turn on:
 //Trail();
    var that = this;
    scrollMessages();
    //var lastCount = this.data.messages.count();
    Deps.autorun(function() {
        /*var newCount = that.data.messages.count();
        if(newCount > lastCount) {
            scrollMessages();
        }*/
    });
};

Template.bzChatId.events({
  'click #send-btn': function (e, v) {
    if(!currentUser){
      alert('please login');
    } else {
      var messageText = v.$('#message-input').val();
        if($.trim(messageText) === "") {
            return false;
        }
        if(messageText !== '') {
          
          /* OLD CODE */
          //sendMessage.call(this, messageT]ext, this.chat, this.user._id);
          
          var request = {
            destinationUserId: Session.get('userOtherParty')._id,
            message: messageText,
            type: ''
          };
          
          Meteor.call('addMessage', request, function(e, r) {

            var res;
            res = (!e) ? r : e;

            if (res.error && res.message) {
              bz.ui.alert('Error ID: ' + res.error, {type: 'error', timeout: 2000});
              return;
            }

            if (!res.success && !res.result) {
              bz.ui.alert('Error ID: ' + res.error.errorId, {type:'error', timeout: 2000});
            }

          });
          
          v.$('#message-input').val('');
          
        }//end if
    }
  },
  'keydown #message-input': function(e, v) {
    var messageText = v.$('#message-input').val();
    
    if(e.which === 13) {
      e.preventDefault();
      //console.log("you pressed enter");

      if($.trim(messageText) === "") return false;
      
      if(messageText !== '') {
        var request = {
          destinationUserId: Session.get('userOtherParty')._id,
          message: messageText,
          type: ''
        };
        
        /* OLD CODE */
        //sendMessage.call(this, messageText, this.chat, this.user._id);
        
        Meteor.call('addMessage', request, function(e, r) {

          var res;
          res = (!e) ? r : e;

          if (res.error && res.message) {
            bz.ui.alert('Error ID: ' + res.error, {type: 'error', timeout: 2000});
            return;
          }

          if (!res.success && !res.result) {
            bz.ui.alert('Error ID: ' + res.error.errorId, {type:'error', timeout: 2000});  
          }
          
        });
        
        /* clear value */
        v.$('#message-input').val('');
      }
    }

    Meteor.setTimeout(function() {
      var messageText = $.trim(v.$('#message-input').val());
      (messageText.length > 0) ? v.buttonStateDisabled.set(false) : v.buttonStateDisabled.set(true);
    }, 100);
    
  }
});

Template.bzChatId.helpers({
  buttonStateDisabled: function() {
    return Template.instance().buttonStateDisabled.get();
  },

  getSubscribeNewMessages: function() {
    var arrayNewMessagesSubscribe = bz.cols.messages.find({}).fetch();
    
    //console.info("ДАННЫЕ NewMessagesSubscribe: ", arrayNewMessagesSubscribe);

    Meteor.setTimeout(function() {
      scrollMessages();
    }, 0);
    
    return arrayNewMessagesSubscribe;
  },
  
  getMessages: function (a, b) {
    /*var ins = Template.instance(),
        chatID = Router.current() && Router.current().params.chatId,
        request = {chatId: chatID};
    
    
    console.info('getMessage OLD ', this);


    Meteor.call('getMessages', request, function(e, r) {
      
      var res;
      res = (!e) ? r : e;

      if (res.error && res.message) {
        bz.ui.alert('Error ID: ' + res.error, {type: 'error', timeout: 2000});
        return;
      }

      if (res.success && res.result) {
        (res.result.length > 0) ? ins.getMessagesData.set(res.result.reverse()) : ins.getMessagesData.set([]);
        console.info('Данные из метода getMessage[s]: ', ins.getMessagesData.get());
      } else {
        bz.ui.alert('Error ID: ' + res.error.errorId, {type:'error', timeout: 2000});
      }
      
    });*/
    
    /* OLD CODE */
    /*var messages = this.messages
    return messages;*/
  }    
});

Template.bzMessageToolbar.onCreated(function() {
  this.getFriendUserData = new ReactiveVar(false);
});

Template.bzMessageToolbar.helpers({
  getFriendUserName: function() {
    var ins = Template.instance(), chatId = Router.current().params.chatId;
    
    if (ins.getFriendUserData.get() === false) {
      Meteor.call('getChat', chatId, function(e, r) {
        
        var res;
        res = (!e) ? r : e;
        
        if (res.error && res.message) {
          bz.ui.alert('Error ID: ' + res.error, {type: 'error', timeout: 2000});
          return;
        }
  
        if (res.success && res.result) {
          Session.set('userOtherParty', res.result.otherParty[0]);
          ins.getFriendUserData.set(res.result.otherParty[0]);
        } else {
          bz.ui.alert('Error ID: ' + res.result.errorId, {type:'error', timeout: 2000});
        }
        
      });

    }
    
    return ins.getFriendUserData.get();
    
    /* OLD CODE */
    /*var friendUserName = this.user.username,
        partEmail;
    if(friendUserName) {
      return friendUserName;
    } else {
      partEmail = this.user.emails[0].address;
      return partEmail.split('@')[0];
    }*/
  },
  getFriendAvatarUrl: function(){
      //return this.user.profile && this.user.profile.image && this.user.profile.image.data || "/img/content/avatars/avatar-no.png";
  }
});

Template.bzMessageToolbar.onDestroyed(function() {
 delete Session.keys['userOtherParty'];
});