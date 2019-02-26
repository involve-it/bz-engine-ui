
//temporarily disabled since not implemented in the app

bz.cols.messages.after.insert(function (userId, doc) {
  if (doc && doc.text && doc.toUserId) {
    //console.log('sending push: ' + doc.text);
    var user = Meteor.users.findOne({ _id: userId }),
      title = 'New message';
    if (user) {
      title = user.username;
    }
    var otherUser = Meteor.users.findOne({ _id: doc.toUserId });
    if (otherUser) {
      if (!otherUser.status || !otherUser.status.online) {
        // notifications !
        /*bz.bus.pushHandler.push(doc.toUserId, title, doc.text, {
          type: bz.const.push.type.chat,
          id: doc.chatId
        }, otherUser);*/
      } else {
        console.log('Delaying push');
        Meteor.setTimeout(function () {
          var messageDb = bz.cols.messages.findOne({ _id: doc._id });
          if (!messageDb.seen) {
            console.log('Sending delayed push');
            /*bz.bus.pushHandler.push(messageDb.toUserId, title, messageDb.text, {
              type: bz.const.push.type.chat,
              id: messageDb.chatId
            }, otherUser);*/
          } else {
            console.log('Push cancelled');
            console.log(messageDb);
          }
        }, 1000);
      }
    }

  }
});
