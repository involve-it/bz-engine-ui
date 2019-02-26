/**
 * Created by arutu_000 on 10/6/2015.
 */


/*TODO delete old show popup message*/

Template.bzChatMessagePopup.onRendered(function(){
  if(this.data) {
    var id = this.data._id;
    $(document).on('closed.fndtn.reveal', '[data-reveal].js-chat-message-modal', function () {
      hideMessageModal(id);
    });
  }
});

Template.bzChatMessagePopup.onDestroyed(function(){
  $(document).off('closed.fndtn.reveal', '[data-reveal].js-chat-message-modal');
});

Template.bzChatMessagePopup.events({
  'click .js-go-to-msg-link': function(){
    hideMessageModal()
    // need to close the modal with the message:
  }
});

/* Passing param. from sAlert to sAlertCustom the template */
Template.sAlertCustom.helpers({
  isHtml: function () {
    var data = Template.currentData();
    return data && data.html;
  }
});